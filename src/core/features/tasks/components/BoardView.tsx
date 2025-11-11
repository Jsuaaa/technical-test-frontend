import { CSSProperties, useMemo } from "react";
import { Heading } from "@carbon/react";
import TaskComponent from "./Task";
import { TASK_STATUSES, formatTaskStatusLabel } from "../../../lib/utils";
import useTaskBoard from "../hooks/useTaskBoard";

const BoardView = () => {
  const { tasks } = useTaskBoard();

  const boardColumnsStyle = useMemo(
    () =>
      ({
        "--board-columns": `repeat(${TASK_STATUSES.length}, minmax(0, 1fr))`,
        margin: "20px",
      } as CSSProperties),
    []
  );

  return (
    <div
      className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-(--board-columns)"
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
            {tasks.length &&
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
