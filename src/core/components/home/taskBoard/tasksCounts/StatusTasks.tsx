"use client";

import { InlineNotification, SkeletonText, Tile } from "@carbon/react";
import StatusTaskCard from "./StatusTaskCard";
import useTaskBoard from "@/src/core/hooks/useTask";
import { TASK_STATUSES } from "@/src/core/data/constants";

const StatusTasks = () => {
  const {
    tasksCountByStatus,
    isLoadingTasksCountByStatus,
    isErrorTasksCountByStatus,
    errorTasksCountByStatus,
  } = useTaskBoard();

  // * Error notification
  if (isErrorTasksCountByStatus) {
    return (
      <InlineNotification
        kind="error"
        title="No se pudieron cargar los totales por estado"
        subtitle={
          errorTasksCountByStatus instanceof Error
            ? errorTasksCountByStatus.message
            : undefined
        }
        role="alert"
      />
    );
  }

  return (
    <div
      className="status-tasks-grid w-full"
      style={{
        display: "grid",
        gap: "var(--cds-spacing-05, 1rem)",
        gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
      }}
    >
      {/* Skeleton placeholders while loading */}
      {isLoadingTasksCountByStatus &&
        TASK_STATUSES.map((status) => (
          <Tile key={status} className="status-task-card" aria-busy="true">
            <SkeletonText width="70%" />
            <SkeletonText width="30%" />
          </Tile>
        ))}

      {/* Tasks count by status */}
      {tasksCountByStatus.map((taskCount, index) => (
        <StatusTaskCard
          key={index}
          status={taskCount.status}
          total={taskCount.total}
        />
      ))}
    </div>
  );
};

export default StatusTasks;
