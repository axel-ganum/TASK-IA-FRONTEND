import { TaskItem } from './TaskItem';
import { useTasks } from '../hooks/useTasks';

export function TaskList() {
  const { tasks, isLoading, isError, summarize } = useTasks();

  const handleSummarize = async () => {
    const result = await summarize.mutateAsync();
    alert(`🧾 Resumen general:\n${result.summary}`);
  };

  if (isLoading) return <p>Cargando tareas...</p>;
  if (isError) return <p>Error al cargar tareas.</p>;
  if (!tasks?.length) return <p>No hay tareas todavía.</p>;

  return (
    <div className="space-y-4">
      <button
        onClick={handleSummarize}
        disabled={summarize.isPending}
        className="bg-indigo-600 text-white px-3 py-1 rounded-md text-sm"
      >
        {summarize.isPending ? 'Resumiendo...' : 'Resumir todas las tareas con IA'}
      </button>

      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  );
}

