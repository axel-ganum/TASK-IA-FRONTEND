import { useTasks } from '../hooks/useTasks';

export function TaskList() {
  const { tasks, isLoading, isError, removeTask, update } = useTasks();
  
  if (isLoading) return <p className="text-center text-gray-500">Cargando tareas...</p>;
  if (isError) return <p className="text-center text-red-500">Error al cargar tareas.</p>;
 if (!tasks?.length) return <p className="text-center text-gray-400">No hay tareas todavía.</p>;

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="border rounded-lg p-4 shadow-sm bg-white hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold text-gray-800">
              {task.completed ? '✅ ' : '🕓 '}
              {task.title}
            </h3>

            <div className="flex gap-2">
              <button
                onClick={() => removeTask.mutate(task.id)}
                className="text-sm text-red-600 hover:underline"
              >
                Eliminar
              </button>
              <button
                onClick={() =>
                  update.mutate({
                    id: task.id,
                    updates: { completed: !task.completed },
                  })
                }
                className="text-sm text-blue-600 hover:underline"
              >
                {task.completed ? 'Marcar pendiente' : 'Marcar completada'}
              </button>
            </div>
          </div>

          {task.description && (
            <p className="mt-2 text-gray-600 text-sm">{task.description}</p>
          )}

          {task.tags && task.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {task.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
