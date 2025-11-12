import { supabase } from "@/src/core/lib/supabaseClient";
import { Task, TasksCountByStatus } from "../types/task";

export async function getTasks(): Promise<Task[]> {
  const { data, error } = await supabase.from("tasks").select("*").order("id");
  if (error) throw error;
  return data ?? [];
}

export async function createTask(task: Omit<Task, "id">) {
  const { error } = await supabase.from("tasks").insert(task);
  if (error) throw error;
}

export async function updateTask(id: string, task: Partial<Task>) {
  const { error } = await supabase.from("tasks").update(task).eq("id", id);
  if (error) throw error;
}

export async function deleteTask(id: string) {
  const { error } = await supabase.from("tasks").delete().eq("id", id);
  if (error) throw error;
}

export async function getTask(id: string): Promise<Task | null> {
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
