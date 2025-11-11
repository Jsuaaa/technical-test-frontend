import { useEffect, useRef, useState } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";

import TaskPrioritySelect from "./TaskPrioritySelect";
import TaskStatusSelect from "./TaskStatusSelect";
import { Task, TaskStatus } from "../types/task";
import useTaskBoard from "../hooks/useTaskBoard";

type TaskActionsDropdownProps = {
  triggerAriaLabel: string;
  task: Task;
  onEditTask: (task: Task) => void;
  onOpenChange?: (isOpen: boolean) => void;
  onDeleteSuccess?: () => void;
  disabled?: boolean;
  showPriorityControl?: boolean;
  showStatusControl?: boolean;
  menuWidthClassName?: string;
};

const TaskActionsDropdown = ({
  triggerAriaLabel,
  task,
  onEditTask,
  onOpenChange,
  onDeleteSuccess,
  disabled = false,
  showPriorityControl = true,
  showStatusControl = false,
  menuWidthClassName = "w-56",
}: TaskActionsDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const {
    handleUpdateTask,
    handleUpdateTaskStatus,
    handleDeleteTask,
    isUpdating,
    isDeleting,
  } = useTaskBoard();
  const isGloballyDisabled = disabled || isUpdating || isDeleting;

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        event.target instanceof Node &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    onOpenChange?.(isOpen);
  }, [isOpen, onOpenChange]);

  const handleToggle = (event: ReactMouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (isGloballyDisabled) return;
    setIsOpen((prev) => !prev);
  };

  const closeMenu = () => setIsOpen(false);

  const handleEditClick = () => {
    if (isGloballyDisabled) return;
    onEditTask(task);
    closeMenu();
  };

  const handlePriorityChange = (value: Task["priority"]) => {
    handleUpdateTask({
      ...task,
      priority: value,
    });
  };

  const handleStatusChange = (value: TaskStatus) => {
    handleUpdateTaskStatus(task.id, value);
  };

  const handleDeleteClick = () => {
    if (isGloballyDisabled) return;
    const confirmed = window.confirm(
      `¿Deseas eliminar la tarea "${task.title}"? Esta acción no se puede deshacer.`
    );
    if (!confirmed) return;

    handleDeleteTask(task.id, {
      onSuccess: () => {
        closeMenu();
        onDeleteSuccess?.();
      },
      onError: () => closeMenu(),
    });
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        className="flex h-8 w-8 items-center justify-center rounded-full border border-transparent text-gray-500 transition hover:border-gray-300 hover:bg-gray-100"
        aria-label={triggerAriaLabel}
        disabled={isGloballyDisabled}
        onClick={handleToggle}
      >
        <span aria-hidden="true" className="text-lg font-bold text-gray-700">
          •••
        </span>
      </button>
      {isOpen && (
        <div
          className={`absolute right-0 z-20 mt-2 rounded-md border border-gray-200 bg-white p-2 shadow-lg ${menuWidthClassName}`}
          onClick={(event) => event.stopPropagation()}
          role="menu"
        >
          <button
            type="button"
            className="w-full rounded-md px-3 py-2 text-left text-sm text-gray-700 transition hover:bg-gray-100 cursor-pointer"
            onClick={handleEditClick}
            disabled={isGloballyDisabled}
          >
            Editar tarea
          </button>
          {showPriorityControl && (
            <div className="mt-2 border-t border-gray-100 pt-2">
              <TaskPrioritySelect
                id={`task-priority-inline-${task.id}`}
                value={task.priority}
                onChange={(value) => handlePriorityChange(value)}
                hideLabel
                disabled={isGloballyDisabled}
              />
            </div>
          )}
          {showStatusControl && (
            <div className="mt-2 border-t border-gray-100 pt-2">
              <TaskStatusSelect
                id={`task-status-inline-${task.id}`}
                value={task.status}
                onChange={(value) => handleStatusChange(value)}
                hideLabel
                disabled={isGloballyDisabled}
              />
            </div>
          )}
          <div className="mt-2 border-t border-gray-100 pt-2">
            <button
              type="button"
              className="w-full rounded-md px-3 py-2 text-left text-sm text-red-600 transition hover:bg-red-50 cursor-pointer"
              onClick={handleDeleteClick}
              disabled={isGloballyDisabled}
            >
              Eliminar tarea
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskActionsDropdown;
