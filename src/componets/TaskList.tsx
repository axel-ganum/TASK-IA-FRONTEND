import { TaskItem } from './TaskItem';
import { useTasks } from '../hooks/useTasks';
import { toast } from 'react-toastify';

export function TaskList() {
  const { tasks, isLoading, isError, summarize } = useTasks();

  const handleSummarize = async () => {
       try {
      const result = await summarize.mutateAsync();
      toast.success(`🧾 Resumen generado con IA\n${result.summary}`);
    } catch (error) {
      toast.error("Error al resumir tareas");
    }
  };

 if (isLoading) return <p className="text-center text-gray-500">Cargando tareas...</p>;
  if (isError) return <p className="text-center text-red-500">Error al cargar tareas.</p>;
  if (!tasks?.length) return <p className="text-center text-gray-400">No hay tareas todavía.</p>;

  return (
     <div className="space-y-5">
      <div className="flex justify-center">
        <button
          onClick={handleSummarize}
          disabled={summarize.isPending}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2 rounded-lg font-medium shadow hover:opacity-90 transition"
        >
          {summarize.isPending ? "🧠 Resumiendo..." : "Resumir todas las tareas con IA"}
        </button>
      </div>

      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  );
}

