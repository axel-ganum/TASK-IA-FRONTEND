import { TaskItem } from './TaskItem';
import { useTasks } from '../hooks/useTasks';
import { toast } from 'react-toastify';
import { useState } from 'react';

export function TaskList() {
  const { tasks, isLoading, isError, summarize } = useTasks();
  const [summaryModalOpen, setSummaryModalOpen] = useState(false);
const [summaryText, setSummaryText] = useState("");


  const handleSummarize = async () => {
  try {
    const result = await summarize.mutateAsync();
    console.log("🧠 Resultado del resumen:", result);

    const summary =
      result?.summary ||
      result?.result ||
      result?.message ||
      JSON.stringify(result, null, 2);

    setSummaryText(summary);
    setSummaryModalOpen(true);
  } catch (error) {
    console.error("Error al resumir tareas:", error);
    toast.error("Error al resumir tareas");
  }
};


  if (isLoading)
    return <p className="text-center text-gray-500">Cargando tareas...</p>;
  if (isError)
    return <p className="text-center text-red-500">Error al cargar tareas.</p>;
  if (!tasks?.length)
    return <p className="text-center text-gray-400">No hay tareas todavía.</p>;

  return (
    <div
      className="
        relative z-0 min-h-screen py-10
        bg-gradient-to-br from-white via-indigo-50/30 to-purple-50/40
        overflow-visible
      "
    >
      {/* Fondo con patrón sutil */}
      <svg
        className="absolute inset-0 w-full h-full opacity-5 pointer-events-none z-0"
        xmlns="http://www.w3.org/2000/svg"
      >
        <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
          <rect
            width="100"
            height="100"
            fill="none"
            stroke="#4f46e5"
            strokeWidth="0.5"
          />
        </pattern>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      <div className="relative z-[2] max-w-6xl mx-auto space-y-12">
        {/* Botón principal IA */}
        <div className="flex justify-center">
          <button
            onClick={handleSummarize}
            disabled={summarize.isPending}
            className="
              bg-gradient-to-r from-indigo-600 to-purple-600 
              text-white px-8 py-3 rounded-2xl font-semibold 
              shadow-md hover:shadow-lg hover:opacity-90 
              transition-all duration-300
            "
          >
            {summarize.isPending
              ? "🧠 Resumiendo..."
              : "Resumir todas las tareas con IA"}
          </button>
        </div>

        {/* Grid de tareas */}
        <div
          className="
            grid gap-8 
            sm:grid-cols-2 lg:grid-cols-3 
            justify-items-center px-4
          "
        >
          {tasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>
      </div>
      {summaryModalOpen && (
   <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[999]">
    <div className="bg-white rounded-2xl shadow-xl p-6 max-w-2xl w-full mx-4">
      <h2 className="text-xl font-semibold mb-4">🧾 Resumen de tareas</h2>
      <pre className="whitespace-pre-wrap text-gray-700 max-h-[70vh] overflow-y-auto">
        {summaryText}
      </pre>
      <div className="mt-6 flex justify-end">
        <button
          onClick={() => setSummaryModalOpen(false)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          Cerrar
        </button>
      </div>
    </div>
  </div>
 )}

    </div>
    
  );
}


