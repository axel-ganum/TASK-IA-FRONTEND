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
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-gray-700 dark:text-gray-200">Subtareas</h3>
                {task.subtasks?.length > 0 && (
                  <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-200">
                    {task.subtasks.filter(st => st.completed).length} de {task.subtasks.length}
                  </span>
                )}
              </div>
              
              {task.subtasks?.length > 0 && (
                <div className="flex items-center">
                  <div className={`h-2 flex-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden`}>
                    <div 
                      className="h-full bg-indigo-500 transition-all duration-300"
                      style={{
                        width: task.subtasks.length > 0 
                          ? `${(task.subtasks.filter(st => st.completed).length / task.subtasks.length) * 100}%`
                          : '0%'
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
              {task.subtasks && task.subtasks.length > 0 ? (
                <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                  {task.subtasks.map((subtask: Subtask) => (
                    <li key={subtask.id} className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <div className="flex items-start gap-3 group">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleSubtask?.(subtask.id, !subtask.completed);
                          }}
                          className="flex-shrink-0 mt-0.5"
                          aria-label={subtask.completed ? 'Marcar como pendiente' : 'Marcar como completada'}
                        >
                          <span className={`inline-flex items-center justify-center w-5 h-5 rounded border ${
                            subtask.completed 
                              ? 'bg-green-100 border-green-300 text-green-600 dark:bg-green-900/50 dark:border-green-700 dark:text-green-400'
                              : 'bg-white border-gray-300 dark:bg-gray-700 dark:border-gray-600 group-hover:border-indigo-400 dark:group-hover:border-indigo-400 transition-colors'
                          }`}>
                            {subtask.completed && '✓'}
                          </span>
                        </button>
                        
                        <div className="flex-1 min-w-0">
                          <span 
                            className={`text-sm ${
                              subtask.completed 
                                ? 'line-through text-gray-400 dark:text-gray-500' 
                                : 'text-gray-700 dark:text-gray-200 font-medium'
                            }`}
                            title={subtask.title}
                          >
                            {subtask.title}
                          </span>
                        </div>
                        
                        {onDeleteSubtask && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (window.confirm('¿Estás seguro de eliminar esta subtarea?')) {
                                onDeleteSubtask(subtask.id);
                              }
                            }}
                            className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-all"
                            aria-label="Eliminar subtarea"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-4 text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No hay subtareas. Usa el botón "Generar subtareas" para crearlas automáticamente.
                  </p>
                </div>
              )}
            </div>
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
