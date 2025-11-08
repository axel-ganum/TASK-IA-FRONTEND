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
     <div className="p-5 border border-gray-200 rounded-2xl bg-white shadow-sm hover:shadow-md transition-all duration-300 space-y-3 text-gray-800">
      {/* Encabezado */}
      <div className="flex justify-between items-start">
        <h3 className="font-semibold text-lg text-gray-900 leading-snug tracking-tight">
          {task.completed ? "✅" : "🕓"} {task.title}
        </h3>

        <div className="flex flex-wrap gap-2 text-sm font-medium">
          <Button
            variant="link"
            color="blue"
            onClick={() =>
              update.mutate({ id: task.id, updates: { completed: !task.completed } })
            }
          >
            {task.completed ? "Marcar pendiente" : "Marcar completada"}
          </Button>

          <Button variant="link" color="red" onClick={() => removeTask.mutate(task.id)}>
            Eliminar
          </Button>

          <Button
            variant="link"
            color="green"
            onClick={() => generateSubtasks.mutate(task.id)}
            disabled={generateSubtasks.isPending}
          >
            {generateSubtasks.isPending ? "Generando..." : "🟢 Subtareas con IA"}
          </Button>

          <Button variant="link" color="purple" onClick={handleAnalyze}>
            🔮 Analizar con IA
          </Button>
        </div>
      </div>

      {/* Descripción */}
      {task.description && (
        <p className="text-sm text-gray-600 leading-relaxed">{task.description}</p>
      )}

      {/* Tags */}
      {task.tags?.length > 0 && (
        <p className="text-xs text-gray-500">🏷️ {task.tags.join(", ")}</p>
      )}

      {/* Subtareas */}
      {task.subtasks?.length > 0 && (
        <ul className="list-disc pl-5 mt-2 text-sm text-gray-700 space-y-1">
          {task.subtasks.map((sub) => (
            <li key={sub.id} className="flex justify-between items-center">
              <span>
                {sub.completed ? "✅" : "🕓"} {sub.title}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    updateSubtaskMutation.mutate({
                      subtaskId: sub.id,
                      updates: { completed: !sub.completed },
                    })
                  }
                  className="text-xs text-blue-600 hover:underline"
                >
                  {sub.completed ? "Pendiente" : "Completada"}
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

      {/* Modal de análisis IA */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg font-[Manrope]">
          <DialogHeader>
            <div className="text-lg font-bold text-indigo-700">
              <DialogTitle>
                💡 Análisis de la tarea
              </DialogTitle>
            </div>
          </DialogHeader>

          {analysis ? (
            <div className="space-y-5 text-[15px] leading-relaxed text-gray-800">
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

