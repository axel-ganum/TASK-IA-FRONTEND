// src/types/Task.ts
export interface Subtask {
  id: string;
  title: string;
  description?: string | null;
  completed: boolean;
  task?: Task; // opcional para evitar ciclos infinitos en JSON
}

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  tags: string[];
  completed: boolean;
  subtasks: Subtask[];
}
