import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Task } from '../types/Task';
import {
  getTasks,
  createTaskWithAI,
  deleteTask,
  updateTask,
  generateSubtasksForTask
} from '../api/tasks';

export function useTasks() {
  const queryClient = useQueryClient();

  // 1️⃣ Traer todas las tareas
  const { data: tasks, isLoading, isError } = useQuery<Task[]>({
    queryKey: ['tasks'],
    queryFn: getTasks,
  });

  // 2️⃣ Crear tarea con IA
  const createTask = useMutation({
    mutationFn: createTaskWithAI,
    onSuccess: () => {
      // Refresca la lista de tareas automáticamente
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  // 3️⃣ Eliminar tarea
  const removeTask = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  // 4️⃣ Actualizar tarea (por ejemplo marcar completada)
  const update = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Task> }) =>
      updateTask(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

   const generateSubtasks = useMutation({
    mutationFn: generateSubtasksForTask,
    onSuccess: () => {
      // Refrescamos la lista al generar subtareas
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  return {
    tasks,
    isLoading,
    isError,
    createTask,
    removeTask,
    update,
    generateSubtasks
  };
}
