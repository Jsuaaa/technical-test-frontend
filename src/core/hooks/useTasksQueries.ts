import { useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createTask,
  deleteTask,
  getTask,
  getTasks,
  getTasksCountByStatus,
  updateTask,
} from "../services/taskService";
import { Task, UpdateTaskVariables } from "../domain/task";

export type TasksQueryFilters = {
  searchTerm?: string;
};

export const useTasksQuery = (filters?: TasksQueryFilters) => {
  const normalizedSearchTerm = filters?.searchTerm?.trim();

  const tasksQuery = useQuery({
    queryKey: ["tasks", { search: normalizedSearchTerm ?? null }],
    queryFn: () => getTasks({ search: normalizedSearchTerm }),
  });

  return {
    tasks: tasksQuery.data ?? [],
    isLoading: tasksQuery.isLoading,
    isError: tasksQuery.isError,
    error: tasksQuery.error,
    refetch: tasksQuery.refetch,
    isSuccess: tasksQuery.isSuccess,
  };
};

export const useTasksCountByStatusQuery = () => {
  const tasksCountByStatusQuery = useQuery({
    queryKey: ["tasks-count-by-status"],
    queryFn: getTasksCountByStatus,
  });

  return {
    tasksCountByStatus: tasksCountByStatusQuery.data ?? [],
    isLoading: tasksCountByStatusQuery.isLoading,
    isError: tasksCountByStatusQuery.isError,
    error: tasksCountByStatusQuery.error,
    isSuccess: tasksCountByStatusQuery.isSuccess,
    refetch: tasksCountByStatusQuery.refetch,
  };
};

export const useTaskCreate = () => {
  const queryClient = useQueryClient();

  const createTaskMutation = useMutation({
    mutationFn: (task: Omit<Task, "id">) => createTask(task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["tasks-count-by-status"] });
    },
  });

  return {
    createTask: createTaskMutation.mutate,
    createTaskAsync: createTaskMutation.mutateAsync,
    isCreating: createTaskMutation.isPending,
    isCreateSuccess: createTaskMutation.isSuccess,
    isCreateError: createTaskMutation.isError,
    createError: createTaskMutation.error,
  };
};

export const useTaskUpdate = () => {
  const queryClient = useQueryClient();

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, task }: UpdateTaskVariables) => updateTask(id, task),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["tasks", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["tasks-count-by-status"] });
    },
  });

  return {
    updateTask: updateTaskMutation.mutate,
    updateTaskAsync: updateTaskMutation.mutateAsync,
    isUpdating: updateTaskMutation.isPending,
    isUpdateSuccess: updateTaskMutation.isSuccess,
    isUpdateError: updateTaskMutation.isError,
    updateError: updateTaskMutation.error,
  };
};

export const useTaskDelete = () => {
  const queryClient = useQueryClient();

  const deleteTaskMutation = useMutation({
    mutationFn: (id: number) => deleteTask(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.removeQueries({ queryKey: ["tasks", id] });
      queryClient.invalidateQueries({ queryKey: ["tasks-count-by-status"] });
    },
  });

  return {
    deleteTask: deleteTaskMutation.mutate,
    deleteTaskAsync: deleteTaskMutation.mutateAsync,
    isDeleting: deleteTaskMutation.isPending,
    isDeleteSuccess: deleteTaskMutation.isSuccess,
    isDeleteError: deleteTaskMutation.isError,
    deleteError: deleteTaskMutation.error,
  };
};

export const useTaskFetch = () => {
  const queryClient = useQueryClient();

  const fetchTask = useCallback(
    (id: number) =>
      queryClient.fetchQuery({
        queryKey: ["tasks", id],
        queryFn: () => getTask(id),
      }),
    [queryClient]
  );

  return { fetchTask };
};
