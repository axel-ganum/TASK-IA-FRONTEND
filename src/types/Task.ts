// src/types/Task.ts
export interface Subtask {
  id: string;
  title: string;
  description?: string | null;
  completed: boolean;
}

export interface Task {
  category: string;
  id: string;
  title: string;
  description?: string | null;
  dueDate: string | number | Date;
  status: 'pending' | 'in-progress' | 'completed' | 'blocked';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  tags: string[];
  completed: boolean;
  subtasks: Subtask[];
  createdAt: string | Date;
  updatedAt?: string | Date;
  notes?: string;
}


