import { useMemo, useState } from "react";
import { Heading, Tag, Tile } from "@carbon/react";

import TaskEditModal from "./TaskEditModal";
import TaskActionsDropdown from "./TaskActionsDropdown";
import { Task } from "../domain/task";
import useTaskBoard from "../hooks/useTask";
import { PRIORITY_KIND, TASK_STATUS_COLOR } from "../data/constants";
import { formatTaskStatusLabel } from "../utils/formatTaskStatusLabel";

type TaskComponentProps = {
  task: Task;
};

const TaskComponent = ({ task }: TaskComponentProps) => {
  const { priority, title, description, status, id } = task;
  const { handleUpdateTask, isUpdating, isDeleting } = useTaskBoard();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const isBusy = isUpdating || isDeleting;

  const tileClassName = useMemo(() => {
    const base =
      "flex min-h-[200px] max-w-[700px] flex-col gap-2 rounded-lg p-4 shadow-sm";
    const background = "bg-white";
    const hover = isBusy ? "" : "cursor-pointer transition hover:shadow-md";
    const cursor = isBusy ? "cursor-not-allowed opacity-75" : "";
    return `${base} ${background} ${hover} ${cursor}`.trim();
  }, [isBusy]);

  const handleEditClick = () => {
    if (isBusy) return;
    setIsEditModalOpen(true);
  };

  const handlePrimaryClick = () => {
    if (isBusy) return;
    setIsEditModalOpen(true);
  };

  return (
    <>
      <Tile
        className={tileClassName}
        onClick={handlePrimaryClick}
        tabIndex={0}
        role="button"
        aria-label={`Editar tarea ${title}`}
        onKeyDown={(event) => {
          if (isBusy) return;
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setIsEditModalOpen(true);
          }
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2">
            <Tag type={PRIORITY_KIND[priority]} className="w-fit">
              {priority}
            </Tag>
            <Tag type={TASK_STATUS_COLOR[status]} className="w-fit">
              {formatTaskStatusLabel(status)}
            </Tag>
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-gray-900">
              <span className="text-xs text-gray-500">FMCR #{id}</span>
            </div>
          </div>
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
        <Heading className="text-base font-semibold text-gray-900">
          {title}
        </Heading>
        <p className="text-sm text-gray-600">
          {description ?? "Sin descripción"}
        </p>
      </Tile>
      {isEditModalOpen && (
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
