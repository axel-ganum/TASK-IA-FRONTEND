import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getTasks,
  createTaskWithAI,
  updateTask,
  deleteTask,
  generateSubtasksForTask,
  summarizeTasks,
  analyzeTaskWithAI,
  deleteSubtask,
  updateSubtask,
} from '../api/tasks';
import type { Task } from '../types/Task';

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
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });

  // 3️⃣ Eliminar tarea
  const removeTask = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });

  // 4️⃣ Actualizar tarea (marcar completada)
  const update = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Task> }) =>
      updateTask(id, updates),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });

  // 5️⃣ Generar subtareas con IA
  const generateSubtasks = useMutation({
    mutationFn: generateSubtasksForTask,
    onSuccess: (updatedTask) => {
      // Reemplazar la tarea actual con la nueva que trae subtasks
      queryClient.setQueryData<Task[]>(['tasks'], (oldTasks) =>
        oldTasks?.map((t) => (t.id === updatedTask.id ? updatedTask : t))
      );
    },
  });

  // 6️⃣ Resumir tareas
  const summarize = useMutation({
    mutationFn: summarizeTasks,
  });

  // 7️⃣ Analizar tarea con IA
  const analyze = useMutation({
    mutationFn: analyzeTaskWithAI,
  });

  const updateSubtaskMutation = useMutation({
  mutationFn: (payload: { id: string; updates: any }) => updateSubtask(payload.id, payload.updates),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
});

const deleteSubtaskMutation = useMutation({
  mutationFn: (id: string) => deleteSubtask(id),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
});


  return {
    tasks,
    isLoading,
    isError,
    createTask,
    removeTask,
    update,
    generateSubtasks,
    summarize,
    analyze,
    updateSubtaskMutation,
    deleteSubtaskMutation,
  };
}

