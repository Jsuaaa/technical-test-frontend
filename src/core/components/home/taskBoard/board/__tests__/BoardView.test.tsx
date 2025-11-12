import { render, screen } from "@testing-library/react";

import BoardView from "../BoardView";
import { TaskPriority, TaskStatus } from "@/src/core/domain/task";

jest.mock("@/src/core/common/Task", () => ({
  __esModule: true,
  default: ({ task }: { task: { id: number; title: string } }) => (
    <div data-testid={`task-${task.id}`}>{task.title}</div>
  ),
}));

const mockUseTaskBoard = jest.fn();

jest.mock("@/src/core/providers/TaskBoardProvider", () => ({
  __esModule: true,
  useTaskBoard: () => mockUseTaskBoard(),
}));

const tasks = [
  {
    id: 1,
    title: "Tarea backlog",
    description: "",
    status: TaskStatus.BACKLOG,
    priority: TaskPriority.LOW,
  },
  {
    id: 2,
    title: "Tarea en progreso",
    description: "",
    status: TaskStatus.IN_PROGRESS,
    priority: TaskPriority.MEDIUM,
  },
];

describe("BoardView", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseTaskBoard.mockReturnValue({
      tasks,
      isLoading: false,
    });
  });

  it("muestra los encabezados para todos los estados", () => {
    render(<BoardView />);

    expect(screen.getByText("Backlog")).toBeInTheDocument();
    expect(screen.getByText("En progreso")).toBeInTheDocument();
    expect(screen.getByText("Completada")).toBeInTheDocument();
  });

  it("renderiza las tareas en la columna correspondiente según el estado", () => {
    render(<BoardView />);

    expect(screen.getByTestId("task-1")).toBeInTheDocument();
    expect(screen.getByTestId("task-2")).toBeInTheDocument();
  });

  it("muestra placeholders de carga cuando isLoading es verdadero", () => {
    mockUseTaskBoard.mockReturnValue({
      tasks,
      isLoading: true,
    });

    const { container } = render(<BoardView />);

    const placeholders = container.querySelectorAll('[aria-hidden="true"]');
    expect(placeholders.length).toBeGreaterThan(0);
  });
});
