import axios from 'axios';
import type { Task } from '../types/Task';



const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

/* -------------------------------------------------------------------------- */
/* 🟢 TAREAS PRINCIPALES */
/* -------------------------------------------------------------------------- */

// Obtener todas las tareas
export const getTasks = async (): Promise<Task[]> => {
  const { data } = await axios.get<Task[]>(`${API_URL}/tasks`);
  return data;
};

// Obtener una tarea por ID
export const getTaskById = async (id: string): Promise<Task> => {
  const { data } = await axios.get<Task>(`${API_URL}/tasks/${id}`);
  return data;
};

// Crear tarea con IA (usa mensaje libre)
export const createTaskWithAI = async (message: string): Promise<Task> => {
  const { data } = await axios.post<Task>(`${API_URL}/tasks/ai`, { message });
  return data;
};

// Actualizar tarea (por ejemplo marcar como completada)
export const updateTask = async (
  id: string,
  updates: Partial<Task>
): Promise<Task> => {
  const { data } = await axios.patch<Task>(`${API_URL}/tasks/${id}`, updates);
  return data;
};

// Eliminar tarea
export const deleteTask = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/tasks/${id}`);
};

/* -------------------------------------------------------------------------- */
/* 🤖 FUNCIONALIDADES CON IA */
/* -------------------------------------------------------------------------- */

// Analizar una tarea con IA
export const analyzeTaskWithAI = async (
  question: string
): Promise<{ insights: string; suggestions: string }> => {
  const { data } = await axios.post(`${API_URL}/tasks/analyze`, { question });
  return data;
};


// Generar subtareas automáticas con IA
export const generateSubtasksForTask = async (id: string): Promise<Task> => {
  const { data } = await axios.post<Task>(`${API_URL}/tasks/${id}/subtasks`);
  return data;
};

// Resumir todas las tareas con IA
export const summarizeTasks = async (): Promise<{
  success: boolean;
  summary: string;
}> => {
  const { data } = await axios.post(`${API_URL}/tasks/summarize`);
  return data;
};
