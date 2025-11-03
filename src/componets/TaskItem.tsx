import type { Task } from '../types/Task';
import { useTasks } from '../hooks/useTasks';

interface Props {
  task: Task;
}

export function TaskItem({ task }: Props) {
  const { update, removeTask, generateSubtasks, analyze, updateSubtaskMutation, deleteSubtaskMutation } = useTasks();

 const handleAnalyze = async () => {
  try {
    const result = await analyze.mutateAsync(task.id); // o con pregunta: task.description
    // parseamos si vino como string JSON
    const parsed = typeof result === 'string' ? JSON.parse(result) : result;

    alert(
      `💡 Insights:\n${parsed.insights}\n\n🧭 Sugerencias:\n${parsed.suggestions}`
    );
  } catch (error) {
    console.error('Error al analizar la tarea:', error);
    alert('No se pudo analizar la tarea. Revisa la consola para más detalles.');
  }
};

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white space-y-2">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg">
          {task.completed ? '✅ ' : '🕓 '}
          {task.title}
        </h3>

        <div className="flex gap-2">
          <button
            onClick={() =>
              update.mutate({ id: task.id, updates: { completed: !task.completed } })
            }
            className="text-sm text-blue-600 hover:underline"
          >
            {task.completed ? 'Marcar pendiente' : 'Marcar completada'}
          </button>

          <button
            onClick={() => removeTask.mutate(task.id)}
            className="text-sm text-red-600 hover:underline"
          >
            Eliminar
          </button>

          <button
            onClick={() => generateSubtasks.mutate(task.id)}
            disabled={generateSubtasks.isPending}
            className="text-sm text-purple-600 hover:underline"
          >
            {generateSubtasks.isPending ? 'Generando subtareas...' : 'Generar subtareas con IA'}
          </button>

          <button
            onClick={handleAnalyze}
            className="text-sm text-green-600 hover:underline"
          >
            Analizar con IA
          </button>
        </div>
      </div>

      {task.description && <p className="text-sm text-gray-600">{task.description}</p>}
      {task.tags?.length > 0 && <p className="text-xs text-gray-500">Etiquetas: {task.tags.join(', ')}</p>}

      {/* Subtareas */}
      {task.subtasks?.length > 0 && (
        <ul className="list-disc pl-6 mt-2 text-sm text-gray-700 space-y-1">
          {task.subtasks.map((sub) => (
            <li key={sub.id} className="flex justify-between items-center">
              <span>
                {sub.completed ? '✅ ' : '🕓 '} {sub.title}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    updateSubtaskMutation.mutate({ subtaskId: sub.id, updates: { completed: !sub.completed } })
                  }
                  className="text-xs text-blue-600 hover:underline"
                >
                  {sub.completed ? 'Marcar pendiente' : 'Marcar completada'}
                </button>

                <button
                  onClick={() => deleteSubtaskMutation.mutate(sub.id)}
                  className="text-xs text-red-600 hover:underline"
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

