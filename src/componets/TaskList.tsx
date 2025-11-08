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
      <div className="space-y-8">
      {/* Botón principal IA */}
      <div className="flex justify-center">
        <button
          onClick={handleSummarize}
          disabled={summarize.isPending}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg hover:opacity-90 transition-all duration-300"
        >
          {summarize.isPending ? "🧠 Resumiendo..." : "Resumir todas las tareas con IA"}
        </button>
      </div>

      {/* Grid de tarjetas */}
      <div
        className="
          grid 
          gap-6 
          sm:grid-cols-1 
          md:grid-cols-2 
          lg:grid-cols-3 
          xl:grid-cols-4 
          2xl:grid-cols-5
        "
      >
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}

