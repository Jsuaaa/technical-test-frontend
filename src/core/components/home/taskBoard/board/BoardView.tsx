import { CSSProperties, useMemo } from "react";
import { Heading } from "@carbon/react";
import useTaskBoard from "../../../../hooks/useTask";
import TaskComponent from "@/src/core/common/Task";
import { TASK_STATUSES } from "@/src/core/data/constants";
import { formatTaskStatusLabel } from "@/src/core/utils/formatTaskStatusLabel";

const BoardView = () => {
  const { tasks, isLoading } = useTaskBoard();

  const boardColumnsStyle = useMemo(
    () =>
      ({
        "--board-columns": `repeat(${TASK_STATUSES.length}, minmax(0, 1fr))`,
        marginTop: "30px",
      } as CSSProperties),
    []
  );

  return (
    <div
      className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-(--board-columns) max-h-[550px] overflow-y-auto"
      style={boardColumnsStyle}
    >
      {TASK_STATUSES.map((status) => (
        <div
          key={status}
          className="flex min-h-full flex-col gap-3 rounded-lg border border-gray-200 bg-white/60 p-4"
        >
          <Heading style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
            {formatTaskStatusLabel(status)}
          </Heading>
          <div className="flex h-full flex-col gap-4">
            {/* Skeleton loading for when the tasks are loading */}
            {isLoading
              ? TASK_STATUSES.map((_, index) => (
                  <div
                    key={index}
                    className="h-28 w-full animate-pulse rounded-md border border-dashed border-gray-200 bg-gray-100/80"
                    aria-hidden
                  />
                ))
              : // * If the tasks are not loading, and there are tasks, render the tasks
                tasks.length > 0 &&
                tasks.map(
                  (task) =>
                    task.status === status && (
                      <TaskComponent key={task.id} task={task} />
                    )
                )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BoardView;
