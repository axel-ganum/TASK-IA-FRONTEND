import type { Task } from '../types/Task';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../utils/dialog";
import { Button } from "../utils/button";

import { useTasks } from '../hooks/useTasks';
import { useState } from 'react';

interface Props {
  task: Task;
}

export function TaskItem({ task }: Props) {
  const { update, removeTask, generateSubtasks, analyze, updateSubtaskMutation, deleteSubtaskMutation } = useTasks();
  const [open, setOpen] = useState(false);
const [analysis, setAnalysis] = useState<{ insights?: string; suggestions?: string }>({});


 
const handleAnalyze = async () => {
  try {
    const result = await analyze.mutateAsync(task.id);
    let content = typeof result === "string" ? result : JSON.stringify(result);

    // 🔹 Si viene envuelto en ```json ... ```
    const match = content.match(/```json([\s\S]*?)```/);
    if (match) content = match[1].trim();

    // 🔹 Intentar parsear limpiando múltiples niveles de escape
    let parsed;
    for (let i = 0; i < 3; i++) {
      try {
        parsed = JSON.parse(content);
        break; // ✅ Si lo logra, salimos del bucle
      } catch {
        // limpiar caracteres escapados y comillas redundantes
        content = content
          .replace(/^"|"$/g, "") // comillas al inicio y fin
          .replace(/\\n/g, "\n")
          .replace(/\\"/g, '"')
          .replace(/\\\\/g, "\\");
      }
    }

    // 🔹 Si no se pudo parsear, mostrar el texto limpio
    if (!parsed) {
      parsed = {
        insights: content,
        suggestions: "No se pudo formatear correctamente el análisis.",
      };
    }

    setAnalysis(parsed);
    setOpen(true);
  } catch (error) {
    console.error("Error al analizar la tarea:", error);
  }
};




  return (

   <div
      className="
        flex flex-col justify-between
        bg-white/70 backdrop-blur-xl border border-white/40
        rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1
        transition-all duration-300 ease-out
        text-gray-800 overflow-hidden p-5 w-full max-w-sm
      "
    >
      {/* Encabezado */}
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-base text-gray-900 leading-snug line-clamp-2">
          {task.completed ? "✅" : "🕓"} {task.title}
        </h3>

        <div className="flex flex-wrap gap-1 text-xs font-medium">
          <Button
            variant="link"
            onClick={() =>
              update.mutate({ id: task.id, updates: { completed: !task.completed } })
            }
            className="text-indigo-600 hover:underline"
          >
            {task.completed ? "Pendiente" : "Completada"}
          </Button>

          <Button
            variant="link"
            onClick={() => removeTask.mutate(task.id)}
            className="text-red-600 hover:underline"
          >
            Eliminar
          </Button>
        </div>
      </div>

      {/* Descripción */}
      {task.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-3">{task.description}</p>
      )}

      {/* Tags */}
      {task.tags?.length > 0 && (
        <div className="text-xs text-gray-500 mb-3">🏷️ {task.tags.join(", ")}</div>
      )}

      {/* Subtareas */}
      {task.subtasks?.length > 0 && (
        <div className="border-t border-gray-100 pt-3 mt-auto">
          <ul className="space-y-1 text-sm text-gray-700">
            {task.subtasks.map((sub) => (
              <li key={sub.id} className="flex justify-between items-center">
                <span className="truncate">
                  {sub.completed ? "✅" : "🕓"} {sub.title}
                </span>
                <div className="flex gap-2 text-xs">
                  <button
                    onClick={() =>
                      updateSubtaskMutation.mutate({
                        subtaskId: sub.id,
                        updates: { completed: !sub.completed },
                      })
                    }
                    className="text-blue-600 hover:underline"
                  >
                    {sub.completed ? "Pendiente" : "Hecho"}
                  </button>
                  <button
                    onClick={() => deleteSubtaskMutation.mutate(sub.id)}
                    className="text-red-600 hover:underline"
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Botones IA */}
      <div className="mt-4 flex justify-end gap-3 text-xs font-medium">
        <Button
          variant="link"
          onClick={() => generateSubtasks.mutate(task.id)}
          disabled={generateSubtasks.isPending}
          className="text-green-600 hover:underline"
        >
          {generateSubtasks.isPending ? "..." : "Subtareas IA"}
        </Button>

        <Button
          variant="link"
          onClick={handleAnalyze}
          disabled={analyze.isPending}
          className="text-purple-600 hover:underline"
        >
          {analyze.isPending ? "Analizando..." : "Analizar"}
        </Button>
      </div>

      {/* Modal de análisis */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <div className="text-indigo-700 text-lg font-bold">
              <DialogTitle>
                💡 Análisis de la tarea
              </DialogTitle>
            </div>
          </DialogHeader>

          {analysis ? (
            <div className="space-y-4 text-[15px] leading-relaxed text-gray-800">
              <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-100">
                <p className="font-semibold text-indigo-700 mb-1">💭 Insights:</p>
                <p className="whitespace-pre-line text-gray-700">
                  {analysis.insights || "No hay insights"}
                </p>
              </div>

              <div className="bg-purple-50 rounded-lg p-3 border border-purple-100">
                <p className="font-semibold text-purple-700 mb-1">🧭 Sugerencias:</p>
                <p className="whitespace-pre-line text-gray-700">
                  {analysis.suggestions || "No hay sugerencias"}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 italic">Analizando con IA...</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

