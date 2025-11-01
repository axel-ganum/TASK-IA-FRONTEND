// src/types/Task.ts
export interface Subtask {
  id: string;
  title: string;
  description?: string | null;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  tags: string[];
  completed: boolean;
  subtasks: Subtask[];
}


