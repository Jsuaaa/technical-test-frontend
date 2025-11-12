import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createTask,
  deleteTask,
  getTask,
  getTasks,
  getTasksCountByStatus,
  updateTask,
} from "../services/taskService";
import { Task, UpdateTaskVariables } from "../types/task";

const useTasks = () => {
  const queryClient = useQueryClient();

  const tasksQuery = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });

  const tasksCountByStatusQuery = useQuery({
    queryKey: ["tasks-count-by-status"],
    queryFn: getTasksCountByStatus,
  });

  const createTaskMutation = useMutation({
    mutationFn: (task: Omit<Task, "id">) => createTask(task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, task }: UpdateTaskVariables) => updateTask(id, task),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["tasks", variables.id] });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: (id: string) => deleteTask(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.removeQueries({ queryKey: ["tasks", id] });
    },
  });

  const fetchTask = (id: string) =>
    queryClient.fetchQuery({
      queryKey: ["tasks", id],
      queryFn: () => getTask(id),
    });

  return {
    tasks: tasksQuery.data ?? [],
    isLoading: tasksQuery.isLoading,
    isError: tasksQuery.isError,
    error: tasksQuery.error,
    tasksCountByStatus: tasksCountByStatusQuery.data ?? [],
    isLoadingTasksCountByStatus: tasksCountByStatusQuery.isLoading,
    isErrorTasksCountByStatus: tasksCountByStatusQuery.isError,
    errorTasksCountByStatus: tasksCountByStatusQuery.error,
    refetch: tasksQuery.refetch,
    createTask: createTaskMutation.mutate,
    isCreating: createTaskMutation.isPending,
    updateTask: updateTaskMutation.mutate,
    isUpdating: updateTaskMutation.isPending,
    deleteTask: deleteTaskMutation.mutate,
    isDeleting: deleteTaskMutation.isPending,
    fetchTask,
  };
};

export default useTasks;
