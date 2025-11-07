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
     <div className="p-5 border border-gray-200 rounded-2xl bg-white shadow-sm hover:shadow-md transition space-y-2">
      <div className="flex justify-between items-start">
        <h3 className="font-semibold text-lg text-gray-800">
          {task.completed ? "✅" : "🕓"} {task.title}
        </h3>

        <div className="flex flex-wrap gap-2 text-sm">
          <Button
          variant="link"
          color="blue"
            onClick={() =>
              update.mutate({ id: task.id, updates: { completed: !task.completed } })
            }
           
          >
            {task.completed ? "Marcar pendiente" : "Marcar completada"}
          </Button>

          <Button
           variant="link" color="red"
            onClick={() => removeTask.mutate(task.id)}
            
          >
            Eliminar
          </Button>

          <Button
           variant="link" 
           color="green"
            onClick={() => generateSubtasks.mutate(task.id)}
            disabled={generateSubtasks.isPending}
            
          >
            {generateSubtasks.isPending ? "Generando..." : "Subtareas con IA"}
          </Button>

          <Button
           variant="link"
           color="purple"
          
            onClick={handleAnalyze}
            
          >
            Analizar con IA
          </Button>
        </div>
      </div>

      {task.description && <p className="text-sm text-gray-600">{task.description}</p>}

      {task.tags?.length > 0 && (
        <p className="text-xs text-gray-500">
          🏷️ {task.tags.join(", ")}
        </p>
      )}

      {task.subtasks?.length > 0 && (
        <ul className="list-disc pl-6 mt-2 text-sm text-gray-700 space-y-1">
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
       {/* --- Modal de resultados IA --- */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>💡 Análisis de la tarea</DialogTitle>
          </DialogHeader>

          {analysis ? (
            <div className="space-y-4 text-sm text-gray-700">
              <div>
                <p className="font-semibold text-gray-800">💭 Insights:</p>
                <p className="whitespace-pre-line">{analysis.insights || "No hay insights"}</p>
              </div>

              <div>
                <p className="font-semibold text-gray-800">🧭 Sugerencias:</p>
                <p className="whitespace-pre-line">{analysis.suggestions || "No hay sugerencias"}</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Analizando con IA...</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

