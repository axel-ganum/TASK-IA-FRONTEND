import { X } from 'lucide-react';
import { Button } from '../utils/button';
import type { Task, Subtask } from '../types/Task';
import { format } from 'date-fns';
import { es } from 'date-fns/locale/es';
import { useState } from 'react';

interface TaskDetailProps {
  task: Task;
  onClose: () => void;
  onToggleSubtask?: (subtaskId: string, completed: boolean) => void;
  onDeleteSubtask?: (subtaskId: string) => void;
}

export function TaskDetail({ task, onClose, onToggleSubtask, onDeleteSubtask }: TaskDetailProps) {
  const formatDate = (dateString: string | number | Date) => {
    return format(new Date(dateString), "d 'de' MMMM 'de' yyyy", { locale: es });
  };

const getStatusText = (status: string) => {
  switch (status) {
    case "completed":
      return "Completada";
    case "in-progress":
      return "En progreso";
    case "blocked":
      return "Bloqueada";
    default:
      return "Pendiente";
  }
};

const getStatusClass = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    case "in-progress":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    case "blocked":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    case "completed":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    default:
      return "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200";
  }
};


  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'Alta prioridad';
      case 'medium': return 'Media prioridad';
      case 'urgent': return 'Urgente';
      default: return 'Baja prioridad';
    }
  };

  const getPriorityClass = (priority: string) => {
     switch (priority) {
    case "high":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    case "medium":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
    case "low":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    default:
      return "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200"
  };
}

  const [safeDescription] = useState<string>(() => {
    if (!task.description) return '';
    // Simple HTML escape function
    return task.description
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  });

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 dark:bg-black/70 backdrop-blur-sm flex items-start justify-center p-4 z-[9999] overflow-y-auto"
      onClick={handleBackdropClick}
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999
      }}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative border border-gray-200 dark:border-gray-700"
        style={{
          maxHeight: '90vh',
          margin: 'auto',
          position: 'relative',
          scrollbarWidth: 'thin',
          scrollbarColor: '#c7d2fe #f1f1f1',
        }}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
  <div className="flex justify-between items-start">
    <div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
        {task.title}
      </h2>

      <div className="flex items-center gap-2 mt-1">

        {/* Badge de Status */}
        <span
          className={`
            px-2 py-0.5 text-xs font-medium rounded-full
            ${getStatusClass(task.status)}
          `}
        >
          {getStatusText(task.status)}
        </span>

        {/* Badge de Prioridad */}
        <span
          className={`
            px-2 py-0.5 text-xs font-medium rounded-full
            ${getPriorityClass(task.priority)}
          `}
        >
          {getPriorityText(task.priority)}
        </span>
      </div>
    </div>

    <Button 
      variant="ghost"
      onClick={onClose}
      className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 p-2"
      aria-label="Cerrar"
    >
      <X className="h-5 w-5" />
    </Button>
  </div>
</div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Meta Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Fecha de vencimiento</h4>
              <p className="mt-1 text-sm text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <span>📅</span>
                <span>{task.dueDate ? formatDate(task.dueDate) : 'Sin fecha'}</span>
              </p>
            </div>
            {task.tags?.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Etiquetas</h4>
                <div className="flex flex-wrap gap-1">
                  {task.tags.map(tag => (
                    <span 
                      key={tag} 
                      className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full  dark:bg-gray-700 dark:text-gray-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          {task.description && (
            <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: safeDescription }} />
          )}
          {/* Subtareas */}
          <div className="border-t border-gray-100 pt-4 mt-2">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200">Subtareas</h3>
              {task.subtasks?.length > 0 && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {task.subtasks.filter(st => st.completed).length} de {task.subtasks.length} completadas
                </span>
              )}
            </div>
            
            <ul className="space-y-2">
              {task.subtasks && task.subtasks.length > 0 ? (
                task.subtasks.map((subtask: Subtask) => (
                  <li 
                    key={subtask.id}
                    className="flex justify-between items-center p-3 
                      bg-white dark:bg-gray-800/50 
                      border border-gray-100 dark:border-gray-700
                      rounded-lg 
                      hover:bg-gray-50 dark:hover:bg-gray-700/50 
                      transition-colors"
                  >
                    <div className="flex items-center flex-1 min-w-0">
                      <span className={`mr-3 ${subtask.completed ? 'text-green-500 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'}`}>
                        {subtask.completed ? '✓' : '○'}
                      </span>
                      <span 
                        className={`text-sm truncate ${
                          subtask.completed 
                            ? 'line-through text-gray-400 dark:text-gray-400' 
                            : 'text-gray-700 dark:text-gray-100'
                        }`}
                        title={subtask.title}
                      >
                        {subtask.title}
                      </span>
                    </div>
                    <div className="flex gap-2 ml-2">
                      {onToggleSubtask && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleSubtask(subtask.id, !subtask.completed);
                          }}
                          className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                          aria-label={subtask.completed ? 'Marcar como pendiente' : 'Marcar como hecha'}
                        >
                          {subtask.completed ? 'Pendiente' : 'Hecho'}
                        </button>
                      )}
                      {onDeleteSubtask && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm('¿Estás seguro de eliminar esta subtarea?')) {
                              onDeleteSubtask(subtask.id);
                            }
                          }}
                          className="text-xs text-red-600 dark:text-red-400 hover:underline"
                          aria-label="Eliminar subtarea"
                        >
                          Eliminar
                        </button>
                      )}
                    </div>
                  </li>
                ))
              ) : (
                <li className="text-sm text-gray-400 text-center py-2">
                  No hay subtareas. Usa el botón "Generar subtareas" para crearlas automáticamente.
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center z-10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{task.title}</h2>
          <Button 
            variant="ghost"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 p-2"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
} 
