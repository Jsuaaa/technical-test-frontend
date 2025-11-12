import { TaskActionCallbacks } from "../../../lib/utils";
import useTasksMutations from "./useTasksQueries";
import { Task, TaskStatus } from "../types/task";

const useTaskBoard = () => {
  const {
    tasks,
    isLoading,
    isError,
    error,
    tasksCountByStatus,
    isLoadingTasksCountByStatus,
    isErrorTasksCountByStatus,
    errorTasksCountByStatus,
    refetch,
    createTask,
    isCreating,
    updateTask,
    isUpdating,
    deleteTask,
    isDeleting,
  } = useTasksMutations();

  const handleCreateTask = (
    payload: Omit<Task, "id">,
    callbacks?: TaskActionCallbacks
  ) => {
    createTask(payload, {
      onSuccess: () => callbacks?.onSuccess?.(),
      onError: (mutationError) => callbacks?.onError?.(mutationError),
    });
  };

  const handleUpdateTask = (
    taskToUpdate: Task,
    callbacks?: TaskActionCallbacks
  ) => {
    const { id, ...taskPayload } = taskToUpdate;
    updateTask(
      {
        id,
        task: taskPayload,
      },
      {
        onSuccess: () => callbacks?.onSuccess?.(),
        onError: (mutationError) => callbacks?.onError?.(mutationError),
      }
    );
  };

  const handleUpdateTaskStatus = (
    taskId: string,
    status: TaskStatus,
    callbacks?: TaskActionCallbacks
  ) => {
    updateTask(
      {
        id: taskId,
        task: { status },
      },
      {
        onSuccess: () => callbacks?.onSuccess?.(),
        onError: (mutationError) => callbacks?.onError?.(mutationError),
      }
    );
  };

  const handleDeleteTask = (
    taskId: string,
    callbacks?: TaskActionCallbacks
  ) => {
    deleteTask(taskId, {
      onSuccess: () => callbacks?.onSuccess?.(),
      onError: (mutationError) => callbacks?.onError?.(mutationError),
    });
  };

  return {
    tasks,
    isLoading,
    isError,
    error,
    tasksCountByStatus,
    isLoadingTasksCountByStatus,
    isErrorTasksCountByStatus,
    errorTasksCountByStatus,
    refetch,
    isCreating,
    isUpdating,
    isDeleting,
    handleCreateTask,
    handleUpdateTask,
    handleUpdateTaskStatus,
    handleDeleteTask,
  };
};

export default useTaskBoard;
