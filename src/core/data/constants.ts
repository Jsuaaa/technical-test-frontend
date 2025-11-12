import { TaskPriority, TaskStatus } from "../domain/task";

export const TASK_STATUSES = Object.values(TaskStatus) as TaskStatus[];
export const TASK_PRIORITIES = Object.values(TaskPriority) as TaskPriority[];
export const DEFAULT_TASK_PRIORITY = TaskPriority.LOW;
export const DEFAULT_TASK_STATUS = TaskStatus.BACKLOG;

// * Task priority color mapping, usually this comes from a db
export const PRIORITY_KIND_COLOR: Record<
  TaskPriority,
  "red" | "magenta" | "cyan"
> = {
  [TaskPriority.HIGH]: "red",
  [TaskPriority.MEDIUM]: "magenta",
  [TaskPriority.LOW]: "cyan",
};

// * Task status color mapping, usually this comes from a db
export const TASK_STATUS_COLOR: Record<TaskStatus, "gray" | "blue" | "green"> =
  {
    [TaskStatus.BACKLOG]: "gray",
    [TaskStatus.IN_PROGRESS]: "blue",
    [TaskStatus.DONE]: "green",
  };
