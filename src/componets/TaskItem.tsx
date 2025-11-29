

import { useState } from 'react';
import { toast } from 'react-toastify';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Task } from '../types/Task';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../utils/dialog";
import { Button } from "../utils/button";
import { useTasks } from '../hooks/useTasks';

interface Props {
  task: Task;
}

export function TaskItem({ task }: Props) {
  const {
    update,
    removeTask,
    generateSubtasks,
    analyze,
    updateSubtaskMutation,
    deleteSubtaskMutation,
  } = useTasks();

  // Modal análisis IA
  const [openAnalysis, setOpenAnalysis] = useState(false);

  // Modal descripción completa
  const [openDescription, setOpenDescription] = useState(false);

  const [analysis, setAnalysis] = useState<{ insights?: string; suggestions?: string }>({});

  const handleAnalyze = async () => {
    try {
      const result = await analyze.mutateAsync(task.id);
      let content = typeof result === 'string' ? result : JSON.stringify(result);

      const match = content.match(/```json([\s\S]*?)```/);
      if (match) content = match[1].trim();

      let parsed = null;

      for (let i = 0; i < 3; i++) {
        try {
          parsed = JSON.parse(content);
          break;
        } catch {
          content = content
            .replace(/^"|"$/g, '')
            .replace(/\\n/g, '\n')
            .replace(/\\"/g, '"')
            .replace(/\\\\/g, '\\')
            .trim();
        }
      }

      if (!parsed) {
        const jsonBlock = content.match(/\{[^]*\}/);
        if (jsonBlock) {
          try {
            parsed = JSON.parse(jsonBlock[0]);
          } catch {}
        }
      }

      if (!parsed || typeof parsed !== 'object') {
        parsed = {
          insights: content,
          suggestions: 'No se pudo formatear correctamente el análisis.',
        };
      }

      setAnalysis({
        insights: parsed.insights?.replace(/\\n/g, '\n'),
        suggestions: parsed.suggestions?.replace(/\\n/g, '\n'),
      });

      setOpenAnalysis(true);
    } catch (error) {
      console.error('❌ Error al analizar la tarea:', error);
      toast.error('Error al analizar la tarea');
    }
  };

  const priority = (task.priority || "").toString().trim().toLowerCase();

const priorityLabel =
  priority === "high" || priority === "urgent" || priority === "alta"
    ? "🔥 Alta"
    : priority === "medium" || priority === "media"
    ? "⚠️ Media"
    : "🐢 Baja";

const priorityColor =
  priority === "high" || priority === "urgent" || priority === "alta"
    ? "bg-red-100 text-red-800"
    : priority === "medium" || priority === "media"
    ? "bg-yellow-100 text-yellow-800"
    : "bg-green-100 text-green-800";


  return (
    <div
      className="
        flex flex-col space-y-2
        bg-white border border-gray-200
        rounded-xl shadow-none hover:shadow-sm hover:-translate-y-[2px]
        transition-all duration-200 ease-out
        text-gray-800 overflow-hidden p-4 w-full max-w-sm
      "
    >
      {/* ENCABEZADO */}
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-base text-gray-900 leading-snug line-clamp-2">
          {task.completed ? "✅" : "🕓"} {task.title}
        </h3>

        <div className="flex flex-wrap gap-1 text-xs font-medium">
          <Button
            variant="link"
            onClick={() => update.mutate({ id: task.id, updates: { completed: !task.completed } })}
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

      {/* ESTADO Y PRIORIDAD */}
      <div className="flex items-center gap-2 mb-2 text-sm">
      <span
    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
      task.completed
        ? "bg-green-100 text-green-800"
        : "bg-gray-100 text-gray-800"
    }`}
  >
    {task.completed ? "✓ Completada" : "📝 Pendiente"}
  </span>

  {/* Prioridad */}
  <span
    className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityColor}`}
  >
    {priorityLabel}
  </span>

  {/* Categoría */}
  {task.category && (
    <span
      className={`
        px-2 py-0.5 rounded-full text-xs font-medium
        ${
          task.category === "trabajo"
            ? "bg-indigo-100 text-indigo-800"
            : task.category === "personal"
            ? "bg-green-100 text-green-800"
            : task.category === "estudio"
            ? "bg-yellow-100 text-yellow-800"
            : "bg-gray-100 text-gray-700"
        }
      `}
    >
      {task.category === "trabajo" && "💼 Trabajo"}
      {task.category === "personal" && "🏠 Personal"}
      {task.category === "estudio" && "📚 Estudio"}
    </span>
  )}

  {/* Fecha */}
  {task.dueDate && (
    <span className="text-xs text-gray-500">
      📅{" "}
      {new Date(task.dueDate).toLocaleDateString("es-ES", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })}
    </span>
  )}
      </div>

  {/* DESCRIPCIÓN RESUMIDA */}
{task.description && (
  <p className="text-sm text-gray-700 line-clamp-3 mb-2">
    {task.description}
  </p>
)}

{/* BOTÓN "VER MÁS" */}
{task.description && task.description.length > 120 && (
  <button
    className="text-sm text-indigo-600 hover:underline mb-3"
    onClick={() => setOpenDescription(true)}
  >
    Ver más →
  </button>
)}


   {/* SUBTAREAS (versión resumida en la tarjeta) */}
{task.subtasks?.length > 0 && (
  <div className="border-t border-gray-100 pt-3">
    <ul className="space-y-1 text-sm text-gray-700">
      {task.subtasks.slice(0, 2).map((sub) => (
        <li
          key={sub.id}
          className="flex justify-between items-center bg-gray-50 px-2 py-1 rounded-md border"
        >
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
          </div>
        </li>
      ))}

      {/* Si hay más de 2 subtareas → mostrar botón */}
      {task.subtasks.length > 2 && (
        <button
          className="text-xs text-gray-500 hover:underline mt-1"
          onClick={() => setOpenDescription(true)}
        >
          Ver todas las subtareas →
        </button>
      )}
    </ul>
  </div>
)}

      {/* BOTONES DE ACCIÓN */}
      <div className="mt-4 flex justify-end gap-3 flex-wrap text-xs font-medium">
        <Button
          variant="link"
          onClick={handleAnalyze}
          disabled={analyze.isPending}
          className="text-purple-600 hover:underline"
        >
          {analyze.isPending ? 'Analizando...' : 'Análisis IA'}
        </Button>
      </div>

     {/* MODAL: DETALLE COMPLETO (descripción + subtareas) */}
<Dialog open={openDescription} onOpenChange={setOpenDescription}>
  <DialogContent className="fixed z-[999999] max-w-lg max-h-[80vh] overflow-y-auto bg-white rounded-xl shadow-xl mt-10">
    <DialogHeader>
      <DialogTitle>{task.title}</DialogTitle>
      <DialogDescription className="text-gray-600">
        Descripción completa y subtareas.
      </DialogDescription>
    </DialogHeader>

    {/* DESCRIPCIÓN */}
    <div className="prose max-w-none text-sm mt-3">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {task.description || "Sin descripción"}
      </ReactMarkdown>
    </div>

    {/* SUBTAREAS COMPLETAS */}
    <div className="mt-5">
      <h3 className="text-sm font-semibold mb-2">Subtareas</h3>

      <ul className="space-y-2">
        {task.subtasks?.map((sub) => (
          <li
            key={sub.id}
            className="flex justify-between items-center bg-gray-50 p-2 rounded-lg border text-sm"
          >
            <span>
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

    {/* CREAR SUBTAREAS */}
   <div className="mt-4 flex justify-end gap-3 flex-wrap text-xs font-medium">
  <Button
    variant="link"
    onClick={() => generateSubtasks.mutate(task.id)}
    className="text-purple-600 hover:underline"
  >
    Generar subtareas con IA
  </Button>
</div>

  </DialogContent>
</Dialog>


      {/* MODAL: ANÁLISIS IA */}
      <Dialog open={openAnalysis} onOpenChange={setOpenAnalysis}>
        <DialogContent className="w-[90vw] max-w-2xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6 pb-4 border-b">
            <DialogTitle className="text-xl font-semibold text-gray-900">
              Análisis de la tarea
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Análisis generado por IA para: <span className="font-medium">{task.title}</span>
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
            <div className="bg-blue-50/50 p-5 rounded-lg border border-blue-100">
              <h4 className="flex items-center gap-2 text-lg font-medium text-blue-800 mb-3">
                <span className="text-xl">🔍</span> Insights
              </h4>
              <div className="prose prose-sm max-w-none text-gray-700">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {analysis.insights || 'No hay insights disponibles'}
                </ReactMarkdown>
              </div>
            </div>

            <div className="bg-purple-50/50 p-5 rounded-lg border border-purple-100">
              <h4 className="flex items-center gap-2 text-lg font-medium text-purple-800 mb-3">
                <span className="text-xl">💡</span> Sugerencias
              </h4>
              <div className="prose prose-sm max-w-none text-gray-700">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {analysis.suggestions || 'No hay sugerencias disponibles'}
                </ReactMarkdown>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 border-t bg-gray-50 flex justify-end space-x-3">
            <Button 
              variant="outline" 
              onClick={() => setOpenAnalysis(false)}
              className="px-4"
            >
              Cerrar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
   
    </div>
  );
}
