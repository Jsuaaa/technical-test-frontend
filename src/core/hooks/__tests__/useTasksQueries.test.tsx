import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { ReactNode } from "react";

import {
  useTaskCreate,
  useTaskDelete,
  useTaskFetch,
  useTaskUpdate,
  useTasksCountByStatusQuery,
  useTasksQuery,
} from "../useTasksQueries";
import {
  createTask,
  deleteTask,
  getTask,
  getTasks,
  getTasksCountByStatus,
  updateTask,
} from "../../services/taskService";
import {
  Task,
  TaskPriority,
  TaskStatus,
  UpdateTaskVariables,
} from "../../domain/task";

jest.mock("../../services/taskService", () => ({
  getTasks: jest.fn(),
  getTasksCountByStatus: jest.fn(),
  createTask: jest.fn(),
  updateTask: jest.fn(),
  deleteTask: jest.fn(),
  getTask: jest.fn(),
}));

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

const createWrapper = (queryClient: QueryClient) =>
  function QueryClientTestProvider({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };

const renderHookWithClient = <T,>(callback: () => T) => {
  const queryClient = createTestQueryClient();
  const wrapper = createWrapper(queryClient);
  const renderHookResult = renderHook(callback, { wrapper });

  return {
    ...renderHookResult,
    queryClient,
  };
};

afterEach(() => {
  jest.clearAllMocks();
});

describe("useTasksQuery", () => {
  it("normaliza el término de búsqueda y retorna las tareas", async () => {
    const tasksMock: Task[] = [
      {
        id: 1,
        title: "Tarea importante",
        description: "Descripción de la tarea",
        status: TaskStatus.BACKLOG,
        priority: TaskPriority.HIGH,
      },
    ];

    const getTasksMock = getTasks as jest.MockedFunction<typeof getTasks>;
    getTasksMock.mockResolvedValue(tasksMock);

    const { result, queryClient, unmount } = renderHookWithClient(() =>
      useTasksQuery({ searchTerm: "  Tarea importante  " })
    );

    try {
      expect(result.current.isLoading).toBe(true);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(getTasksMock).toHaveBeenCalledWith({
        search: "Tarea importante",
      });
      expect(result.current.tasks).toEqual(tasksMock);
      expect(result.current.isLoading).toBe(false);
    } finally {
      unmount();
      queryClient.clear();
    }
  });

  it("consulta todas las tareas cuando no se pasan filtros", async () => {
    const getTasksMock = getTasks as jest.MockedFunction<typeof getTasks>;
    getTasksMock.mockResolvedValue([]);

    const { result, queryClient, unmount } = renderHookWithClient(() =>
      useTasksQuery()
    );

    try {
      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(getTasksMock).toHaveBeenCalledWith({ search: undefined });
      expect(result.current.tasks).toEqual([]);
    } finally {
      unmount();
      queryClient.clear();
    }
  });
});

describe("useTasksCountByStatusQuery", () => {
  it("recupera el conteo de tareas agrupadas por estado", async () => {
    const tasksCountMock = [
      { status: TaskStatus.BACKLOG, total: 2 },
      { status: TaskStatus.DONE, total: 1 },
    ];

    const getTasksCountByStatusMock =
      getTasksCountByStatus as jest.MockedFunction<
        typeof getTasksCountByStatus
      >;
    getTasksCountByStatusMock.mockResolvedValue(tasksCountMock);

    const { result, queryClient, unmount } = renderHookWithClient(() =>
      useTasksCountByStatusQuery()
    );

    try {
      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.tasksCountByStatus).toEqual(tasksCountMock);
      expect(result.current.isLoading).toBe(false);
    } finally {
      unmount();
      queryClient.clear();
    }
  });
});

describe("useTaskCreate", () => {
  it("crea una tarea y refresca las queries relacionadas", async () => {
    const taskToCreate: Omit<Task, "id"> = {
      title: "Nueva tarea",
      description: "Descripción",
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.MEDIUM,
    };

    const createTaskMock = createTask as jest.MockedFunction<typeof createTask>;
    createTaskMock.mockResolvedValue(undefined);

    const { result, queryClient, unmount } = renderHookWithClient(() =>
      useTaskCreate()
    );

    const invalidateSpy = jest.spyOn(queryClient, "invalidateQueries");

    try {
      await act(async () => {
        await result.current.createTaskAsync(taskToCreate);
      });

      expect(createTaskMock).toHaveBeenCalledWith(taskToCreate);
      expect(invalidateSpy).toHaveBeenCalledTimes(2);
      expect(invalidateSpy).toHaveBeenNthCalledWith(1, {
        queryKey: ["tasks"],
      });
      expect(invalidateSpy).toHaveBeenNthCalledWith(2, {
        queryKey: ["tasks-count-by-status"],
      });
    } finally {
      unmount();
      queryClient.clear();
    }
  });
});

describe("useTaskUpdate", () => {
  it("actualiza una tarea y refresca las queries relacionadas", async () => {
    const updateVariables: UpdateTaskVariables = {
      id: 10,
      task: { title: "Título actualizado" },
    };

    const updateTaskMock = updateTask as jest.MockedFunction<typeof updateTask>;
    updateTaskMock.mockResolvedValue(undefined);

    const { result, queryClient, unmount } = renderHookWithClient(() =>
      useTaskUpdate()
    );

    const invalidateSpy = jest.spyOn(queryClient, "invalidateQueries");

    try {
      await act(async () => {
        await result.current.updateTaskAsync(updateVariables);
      });

      expect(updateTaskMock).toHaveBeenCalledWith(
        updateVariables.id,
        updateVariables.task
      );
      expect(invalidateSpy).toHaveBeenCalledTimes(3);
      expect(invalidateSpy).toHaveBeenNthCalledWith(1, {
        queryKey: ["tasks"],
      });
      expect(invalidateSpy).toHaveBeenNthCalledWith(2, {
        queryKey: ["tasks", updateVariables.id],
      });
      expect(invalidateSpy).toHaveBeenNthCalledWith(3, {
        queryKey: ["tasks-count-by-status"],
      });
    } finally {
      unmount();
      queryClient.clear();
    }
  });
});

describe("useTaskDelete", () => {
  it("elimina una tarea e invalida las queries correspondientes", async () => {
    const taskId = 42;

    const deleteTaskMock = deleteTask as jest.MockedFunction<typeof deleteTask>;
    deleteTaskMock.mockResolvedValue(undefined);

    const { result, queryClient, unmount } = renderHookWithClient(() =>
      useTaskDelete()
    );

    const invalidateSpy = jest.spyOn(queryClient, "invalidateQueries");
    const removeSpy = jest.spyOn(queryClient, "removeQueries");

    try {
      await act(async () => {
        await result.current.deleteTaskAsync(taskId);
      });

      expect(deleteTaskMock).toHaveBeenCalledWith(taskId);
      expect(invalidateSpy).toHaveBeenCalledTimes(2);
      expect(invalidateSpy).toHaveBeenNthCalledWith(1, {
        queryKey: ["tasks"],
      });
      expect(removeSpy).toHaveBeenCalledWith({ queryKey: ["tasks", taskId] });
      expect(invalidateSpy).toHaveBeenNthCalledWith(2, {
        queryKey: ["tasks-count-by-status"],
      });
    } finally {
      unmount();
      queryClient.clear();
    }
  });
});

describe("useTaskFetch", () => {
  it("obtiene una tarea específica utilizando el QueryClient", async () => {
    const task: Task = {
      id: 7,
      title: "Tarea buscada",
      description: "Detalle de la tarea",
      status: TaskStatus.DONE,
      priority: TaskPriority.LOW,
    };

    const getTaskMock = getTask as jest.MockedFunction<typeof getTask>;
    getTaskMock.mockResolvedValue(task);

    const { result, queryClient, unmount } = renderHookWithClient(() =>
      useTaskFetch()
    );

    const fetchQuerySpy = jest.spyOn(queryClient, "fetchQuery");

    try {
      let fetchedTask: Task | null = null;

      await act(async () => {
        fetchedTask = await result.current.fetchTask(task.id);
      });

      expect(fetchQuerySpy).toHaveBeenCalledWith(
        expect.objectContaining({
          queryKey: ["tasks", task.id],
        })
      );
      expect(getTaskMock).toHaveBeenCalledWith(task.id);
      expect(fetchedTask).toEqual(task);
    } finally {
      unmount();
      queryClient.clear();
    }
  });
});
