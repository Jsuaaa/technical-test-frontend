import { act, fireEvent, render, screen } from "@testing-library/react";
import ListView from "../ListView";
import { TaskPriority, TaskStatus } from "@/src/core/domain/task";

jest.mock("@/src/core/common/Task", () => ({
  __esModule: true,
  default: ({ task }: { task: { id: number; title: string } }) => (
    <div data-testid={`task-${task.id}`}>{task.title}</div>
  ),
}));

jest.mock("@/src/core/common/TaskEditModal", () => ({
  __esModule: true,
  default: ({
    task,
    onClose,
    onSubmit,
  }: {
    task: { id: number; title: string };
    onClose: () => void;
    onSubmit: (task: { id: number; title: string }) => void;
  }) => (
    <div data-testid="task-edit-modal">
      <span>{`Editando ${task.title}`}</span>
      <button type="button" onClick={onClose}>
        cerrar
      </button>
      <button
        type="button"
        onClick={() => onSubmit({ ...task, title: "Actualizada" })}
      >
        guardar
      </button>
    </div>
  ),
}));

jest.mock("@/src/core/common/TaskActionsDropdown", () => ({
  __esModule: true,
  default: ({
    task,
    onEditTask,
    disabled,
  }: {
    task: { id: number; title: string };
    onEditTask: (task: { id: number; title: string }) => void;
    disabled: boolean;
  }) => (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onEditTask(task)}
      data-testid={`edit-${task.id}`}
    >
      editar
    </button>
  ),
}));

const mockUseTaskBoard = jest.fn();

jest.mock("@/src/core/providers/TaskBoardProvider", () => ({
  __esModule: true,
  useTaskBoard: () => mockUseTaskBoard(),
}));

const createTask = (overrides: Partial<{ id: number; title: string }> = {}) => ({
  id: overrides.id ?? 1,
  title: overrides.title ?? "Tarea de prueba",
  description: "Descripción",
  status: TaskStatus.BACKLOG,
  priority: TaskPriority.MEDIUM,
});

const renderComponent = () => {
  return render(<ListView />);
};

describe("ListView", () => {
  const handleUpdateTask = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseTaskBoard.mockReturnValue({
      tasks: [createTask({ id: 1, title: "Primera tarea" })],
      isUpdating: false,
      isDeleting: false,
      handleUpdateTask,
    });
  });

  it("renderiza la vista móvil cuando el ancho es menor al breakpoint", () => {
    Object.defineProperty(window, "innerWidth", {
      value: 500,
      writable: true,
    });

    renderComponent();

    expect(screen.getByTestId("task-1")).toBeInTheDocument();
    expect(
      screen.queryByRole("columnheader", { name: /acciones/i })
    ).not.toBeInTheDocument();
  });

  it("renderiza la tabla cuando el ancho es mayor o igual al breakpoint", () => {
    Object.defineProperty(window, "innerWidth", {
      value: 1024,
      writable: true,
    });

    renderComponent();

    expect(
      screen.getByRole("columnheader", { name: /acciones/i })
    ).toBeInTheDocument();
    expect(screen.getByText("FMCR #1")).toBeInTheDocument();
  });

  it("permite editar una tarea y dispara handleUpdateTask", () => {
    Object.defineProperty(window, "innerWidth", {
      value: 1024,
      writable: true,
    });

    renderComponent();

    act(() => {
      fireEvent.click(screen.getByTestId("edit-1"));
    });

    expect(screen.getByTestId("task-edit-modal")).toBeInTheDocument();

    act(() => {
      fireEvent.click(screen.getByRole("button", { name: /guardar/i }));
    });

    expect(handleUpdateTask).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Actualizada" }),
      expect.objectContaining({
        onSuccess: expect.any(Function),
      })
    );
  });
});

