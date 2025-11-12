import { supabase } from "@/src/core/utils/supabaseClient";
import { Task, TasksCountByStatus } from "../domain/task";

type GetTasksFilters = {
  search?: string;
};

export async function getTasks(filters?: GetTasksFilters): Promise<Task[]> {
  let query = supabase
    .from("tasks")
    .select("*")
    .order("created_at", { ascending: false });

  if (filters?.search) {
    const sanitizedSearch = filters.search.trim();

    if (sanitizedSearch) {
      const sanitizedWildcard = sanitizedSearch
        .replace(/\\/g, "\\\\")
        .replace(/,/g, "\\,")
        .replace(/\s+/g, " ")
        .trim();

      const wildcardTerm = `%${sanitizedWildcard}%`;

      const numericSearch = Number(sanitizedSearch);
      const orFilters = [
        `title.ilike.${wildcardTerm}`,
        `description.ilike.${wildcardTerm}`,
      ];

      if (!Number.isNaN(numericSearch)) {
        orFilters.unshift(`id.eq.${numericSearch}`);
      }

      query = query.or(orFilters.join(","));
    }
  }

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function createTask(task: Omit<Task, "id">) {
  const { error } = await supabase.from("tasks").insert(task);
  if (error) throw error;
}

export async function updateTask(id: number, task: Partial<Task>) {
  const { error } = await supabase.from("tasks").update(task).eq("id", id);
  if (error) throw error;
}

export async function deleteTask(id: number) {
  const { error } = await supabase.from("tasks").delete().eq("id", id);
  if (error) throw error;
}

export async function getTask(id: number): Promise<Task | null> {
  const { data, error } = await supabase.from("tasks").select("*").eq("id", id);
  if (error) throw error;
  return data?.[0] ?? null;
}

export async function getTasksCountByStatus(): Promise<TasksCountByStatus[]> {
  // * Supabase RPC to get the count of tasks by status
  const { data, error } = await supabase.rpc("get_tasks_status_count");
  if (error) throw error;
  return data ?? [];
}
