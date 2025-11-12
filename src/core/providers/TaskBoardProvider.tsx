import {
  createContext,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from "react";

import { Task, TaskActionCallbacks, TaskStatus } from "../domain/task";
import useTasksQueries from "../hooks/useTasksQueries";

export type TaskBoardContextValue = {
  tasks: Task[];
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  tasksCountByStatus: ReturnType<typeof useTasksQueries>["tasksCountByStatus"];
  isLoadingTasksCountByStatus: boolean;
  isErrorTasksCountByStatus: boolean;
  errorTasksCountByStatus: unknown;
  refetch: ReturnType<typeof useTasksQueries>["refetch"];
  searchTerm: string;
  handleSearch: (value: string) => void;
  clearSearch: () => void;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  handleCreateTask: (
    payload: Omit<Task, "id">,
    callbacks?: TaskActionCallbacks
  ) => void;
  handleUpdateTask: (
    taskToUpdate: Task,
    callbacks?: TaskActionCallbacks
  ) => void;
  handleUpdateTaskStatus: (
    taskId: number,
    status: TaskStatus,
    callbacks?: TaskActionCallbacks
  ) => void;
  handleDeleteTask: (
    taskId: number,
    callbacks?: TaskActionCallbacks
  ) => void;
};

export const TaskBoardContext = createContext<TaskBoardContextValue | null>(
  null
);

export const useTaskBoardState = (): TaskBoardContextValue => {
  const [searchTerm, setSearchTerm] = useState("");

  const normalizedSearchTerm = searchTerm.trim();

  const {
    tasks,
    isLoading,
    isError,
    error,
    tasksCountByStatus,
    isLoadingTasksCountByStatus,
    isErrorTasksCountByStatus,
    errorTasksCountByStatus,
    refetch,
    createTask,
    isCreating,
    updateTask,
    isUpdating,
    deleteTask,
    isDeleting,
  } = useTasksQueries({ searchTerm: normalizedSearchTerm });

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchTerm("");
  }, []);

  const handleCreateTask = useCallback(
    (payload: Omit<Task, "id">, callbacks?: TaskActionCallbacks) => {
      createTask(payload, {
        onSuccess: () => callbacks?.onSuccess?.(),
        onError: (mutationError) => callbacks?.onError?.(mutationError),
      });
    },
    [createTask]
  );

  const handleUpdateTask = useCallback(
    (taskToUpdate: Task, callbacks?: TaskActionCallbacks) => {
      const { id, ...taskPayload } = taskToUpdate;
      updateTask(
        {
          id,
          task: taskPayload,
        },
        {
          onSuccess: () => callbacks?.onSuccess?.(),
          onError: (mutationError) => callbacks?.onError?.(mutationError),
        }
      );
    },
    [updateTask]
  );

  const handleUpdateTaskStatus = useCallback(
    (taskId: number, status: TaskStatus, callbacks?: TaskActionCallbacks) => {
      updateTask(
        {
          id: taskId,
          task: { status },
        },
        {
          onSuccess: () => callbacks?.onSuccess?.(),
          onError: (mutationError) => callbacks?.onError?.(mutationError),
        }
      );
    },
    [updateTask]
  );

  const handleDeleteTask = useCallback(
    (taskId: number, callbacks?: TaskActionCallbacks) => {
      deleteTask(taskId, {
        onSuccess: () => callbacks?.onSuccess?.(),
        onError: (mutationError) => callbacks?.onError?.(mutationError),
      });
    },
    [deleteTask]
  );

  return useMemo(
    () => ({
      tasks,
      isLoading,
      isError,
      error,
      tasksCountByStatus,
      isLoadingTasksCountByStatus,
      isErrorTasksCountByStatus,
      errorTasksCountByStatus,
      refetch,
      searchTerm,
      handleSearch,
      clearSearch,
      isCreating,
      isUpdating,
      isDeleting,
      handleCreateTask,
      handleUpdateTask,
      handleUpdateTaskStatus,
      handleDeleteTask,
    }),
    [
      tasks,
      isLoading,
      isError,
      error,
      tasksCountByStatus,
      isLoadingTasksCountByStatus,
      isErrorTasksCountByStatus,
      errorTasksCountByStatus,
      refetch,
      searchTerm,
      handleSearch,
      clearSearch,
      isCreating,
      isUpdating,
      isDeleting,
      handleCreateTask,
      handleUpdateTask,
      handleUpdateTaskStatus,
      handleDeleteTask,
    ]
  );
};

type TaskBoardProviderProps = {
  children: ReactNode;
};

const TaskBoardProvider = ({ children }: TaskBoardProviderProps) => {
  const value = useTaskBoardState();

  return (
    <TaskBoardContext.Provider value={value}>
      {children}
    </TaskBoardContext.Provider>
  );
};

export default TaskBoardProvider;

