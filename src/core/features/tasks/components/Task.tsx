import { useMemo, useState } from "react";
import { Heading, Tag, Tile } from "@carbon/react";

import { PRIORITY_KIND } from "./TaskBoard";
import TaskEditModal from "./TaskEditModal";
import TaskActionsDropdown from "./TaskActionsDropdown";
import { formatTaskStatusLabel } from "../../../lib/utils";
import { Task, TaskPriority } from "../types/task";
import useTaskBoard from "../hooks/useTaskBoard";

type TaskComponentProps = {
  task: Task;
  isPlaceholder?: boolean;
};

const TaskComponent = ({
  task,
  isPlaceholder = false,
}: TaskComponentProps) => {
  const { priority, title, description, status, id } = task;
  const { handleUpdateTask, isUpdating, isDeleting } = useTaskBoard();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const isBusy = isUpdating || isDeleting;

  const tileClassName = useMemo(() => {
    const base = "flex min-h-[200px] flex-col gap-2 rounded-lg p-4 shadow-sm";
    const background = isPlaceholder ? "bg-white/40" : "bg-white";
    const hover =
      isPlaceholder || isBusy
        ? ""
        : "cursor-pointer transition hover:shadow-md";
    const cursor =
      isBusy && !isPlaceholder ? "cursor-not-allowed opacity-75" : "";
    return `${base} ${background} ${hover} ${cursor}`.trim();
  }, [isPlaceholder, isBusy]);

  const handleEditClick = () => {
    if (isPlaceholder || isBusy) return;
    setIsEditModalOpen(true);
  };

  const handlePrimaryClick = () => {
    if (isPlaceholder || isBusy) return;
    setIsEditModalOpen(true);
  };

  return (
    <>
      <Tile
        className={tileClassName}
        onClick={handlePrimaryClick}
        tabIndex={isPlaceholder ? -1 : 0}
        role={isPlaceholder ? undefined : "button"}
        aria-label={isPlaceholder ? undefined : `Editar tarea ${title}`}
        onKeyDown={(event) => {
          if (isPlaceholder || isBusy) return;
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setIsEditModalOpen(true);
          }
        }}
      >
        {!isPlaceholder && (
          <div className="flex items-start justify-between gap-4">
            <Tag type={PRIORITY_KIND[priority]} className="w-fit">
              {priority}
            </Tag>
            <TaskActionsDropdown
              triggerAriaLabel="Abrir menú de acciones"
              task={task}
              onEditTask={() => handleEditClick()}
              onDeleteSuccess={() => setIsEditModalOpen(false)}
              disabled={isBusy}
              showPriorityControl
              showStatusControl
            />
          </div>
        )}
        {isPlaceholder && (
          <Tag
            type={PRIORITY_KIND[TaskPriority.LOW]}
            className="w-fit opacity-60"
          >
            Sin prioridad
          </Tag>
        )}
        <Heading className="text-base font-semibold text-gray-900">
          {title}
        </Heading>
        <p className="text-sm text-gray-600">
          {description ?? "Sin descripción"}
        </p>
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-gray-900">
          <Tag type="gray" className="w-fit">
            {formatTaskStatusLabel(status)}
          </Tag>
          <span className="text-xs text-gray-500">{id}</span>
        </div>
      </Tile>
      {!isPlaceholder && isEditModalOpen && (
        <TaskEditModal
          key={`edit-${id}-${status}-${priority}`}
          mode="edit"
          task={task}
          open={true}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={(updatedTask) =>
            handleUpdateTask(updatedTask, {
              onSuccess: () => setIsEditModalOpen(false),
            })
          }
          isSubmitting={isUpdating}
        />
      )}
    </>
  );
};

export default TaskComponent;
