import { render, screen } from "@testing-library/react";

import StatusTasks from "../StatusTasks";

jest.mock("@carbon/react", () => ({
  InlineNotification: ({
    title,
    subtitle,
    role,
  }: {
    title: string;
    subtitle?: string;
    role: string;
  }) => (
    <div role={role}>
      <span>{title}</span>
      {subtitle && <span>{subtitle}</span>}
    </div>
  ),
  SkeletonText: ({ width }: { width: string }) => (
    <div data-testid={`skeleton-${width}`} />
  ),
  Tile: ({
    children,
    className,
    "aria-busy": ariaBusy,
  }: {
    children: React.ReactNode;
    className?: string;
    "aria-busy"?: boolean | string;
  }) => (
    <div className={className} aria-busy={Boolean(ariaBusy)}>
      {children}
    </div>
  ),
}));

jest.mock("../StatusTaskCard", () => ({
  __esModule: true,
  default: ({ status, total }: { status: string; total: number }) => (
    <div data-testid={`status-card-${status}`}>{total}</div>
  ),
}));

const mockUseTaskBoard = jest.fn();

jest.mock("@/src/core/providers/TaskBoardProvider", () => ({
  __esModule: true,
  useTaskBoard: () => mockUseTaskBoard(),
}));

describe("StatusTasks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseTaskBoard.mockReturnValue({
      tasksCountByStatus: [],
      isLoadingTasksCountByStatus: false,
      isErrorTasksCountByStatus: false,
      errorTasksCountByStatus: undefined,
    });
  });

  it("muestra una notificación de error cuando la carga falla", () => {
    const error = new Error("Error al cargar");

    mockUseTaskBoard.mockReturnValue({
      tasksCountByStatus: [],
      isLoadingTasksCountByStatus: false,
      isErrorTasksCountByStatus: true,
      errorTasksCountByStatus: error,
    });

    render(<StatusTasks />);

    expect(
      screen.getByRole("alert", {
        name: "",
      })
    ).toHaveTextContent("No se pudieron cargar los totales por estado");
    expect(screen.getByText(error.message)).toBeInTheDocument();
  });

  it("renderiza placeholders mientras se cargan los datos", () => {
    mockUseTaskBoard.mockReturnValue({
      tasksCountByStatus: [],
      isLoadingTasksCountByStatus: true,
      isErrorTasksCountByStatus: false,
      errorTasksCountByStatus: undefined,
    });

    render(<StatusTasks />);

    const skeletons = screen.getAllByTestId(/skeleton-/i);
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("muestra las tarjetas con los totales por estado", () => {
    mockUseTaskBoard.mockReturnValue({
      tasksCountByStatus: [
        { status: "backlog", total: 3 },
        { status: "in-progress", total: 5 },
      ],
      isLoadingTasksCountByStatus: false,
      isErrorTasksCountByStatus: false,
      errorTasksCountByStatus: undefined,
    });

    render(<StatusTasks />);

    expect(screen.getByTestId("status-card-backlog")).toHaveTextContent("3");
    expect(screen.getByTestId("status-card-in-progress")).toHaveTextContent(
      "5"
    );
  });
});
