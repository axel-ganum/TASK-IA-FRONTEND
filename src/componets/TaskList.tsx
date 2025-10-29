import { useTasks } from '../hooks/useTasks';

export function TaskList() {
  const { tasks, isLoading, isError, removeTask, update } = useTasks();

  if (isLoading) return <p>Cargando tareas...</p>;
  if (isError) return <p>Error al cargar tareas.</p>;

  return (
    <div className="space-y-4">
      {tasks?.map((task) => (
        <div key={task.id}>
          <h3>{task.title}</h3>
          <button onClick={() => removeTask.mutate(task.id)}>Eliminar</button>
          <button
            onClick={() =>
              update.mutate({ id: task.id, updates: { completed: !task.completed } })
            }
          >
            {task.completed ? 'Marcar pendiente' : 'Marcar completada'}
          </button>
        </div>
      ))}
    </div>
  );
}
