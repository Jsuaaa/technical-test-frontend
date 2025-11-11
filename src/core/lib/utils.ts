import { TaskPriority, TaskStatus } from "../features/tasks/types/task";

export const TASK_STATUSES = Object.values(TaskStatus) as TaskStatus[];
export const TASK_PRIORITIES = Object.values(TaskPriority) as TaskPriority[];

export const DEFAULT_TASK_PRIORITY = TaskPriority.LOW;
export const DEFAULT_TASK_STATUS = TaskStatus.BACKLOG;

export const formatTaskStatusLabel = (status: TaskStatus): string => {
  switch (status) {
    case TaskStatus.BACKLOG:
      return "Backlog";
    case TaskStatus.IN_PROGRESS:
      return "En progreso";
    case TaskStatus.DONE:
      return "Completada";
    default:
      return status;
  }
};

export const formatTaskPriorityLabel = (priority: TaskPriority): string =>
  priority;

export type TaskActionCallbacks = {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
};

// * Task priority color mapping, usually this comes from a db
export const PRIORITY_KIND: Record<TaskPriority, "red" | "magenta" | "cyan"> = {
  [TaskPriority.HIGH]: "red",
  [TaskPriority.MEDIUM]: "magenta",
  [TaskPriority.LOW]: "cyan",
};

export const TASK_STATUS_COLOR: Record<TaskStatus, "gray" | "blue" | "green"> =
  {
    [TaskStatus.BACKLOG]: "gray",
    [TaskStatus.IN_PROGRESS]: "blue",
    [TaskStatus.DONE]: "green",
  };
