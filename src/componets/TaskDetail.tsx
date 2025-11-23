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
      case 'completed': return 'Completada';
      case 'in-progress': return 'En progreso';
      case 'blocked': return 'Bloqueada';
      default: return 'Pendiente';
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'blocked': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
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
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

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
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center p-4 z-[9999] overflow-y-auto"
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
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl my-8 flex flex-col max-h-[calc(100vh-4rem)] overflow-hidden"
        onClick={e => e.stopPropagation()}
        style={{
          position: 'relative',
          zIndex: 10000,
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{task.title}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusClass(task.status)}`}>
                  {getStatusText(task.status)}
                </span>
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getPriorityClass(task.priority)}`}>
                  {getPriorityText(task.priority)}
                </span>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 transition-colors ml-4"
              aria-label="Cerrar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1" style={{ 
          scrollbarWidth: 'thin',
          WebkitOverflowScrolling: 'touch',
          overflowY: 'auto',
          maxHeight: 'calc(90vh - 150px)' // Ajusta según el tamaño del header y footer
        }}>
          {/* Meta Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="font-medium text-gray-700 mb-1">Fecha de vencimiento</div>
              <div className="flex items-center gap-2 text-gray-600">
                <span>📅</span>
                <span>{formatDate(task.dueDate)}</span>
              </div>
            </div>
            {task.tags?.length > 0 && (
              <div>
                <div className="font-medium text-gray-700 mb-1">Etiquetas</div>
                <div className="flex flex-wrap gap-1">
                  {task.tags.map(tag => (
                    <span 
                      key={tag} 
                      className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full"
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
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Descripción</h3>
              <div className="prose prose-sm max-w-none bg-gray-50 p-4 rounded-lg text-gray-700 whitespace-pre-line" 
                   dangerouslySetInnerHTML={{ __html: safeDescription }} 
              />
            </div>
          )}
          {/* Subtareas */}
          <div className="border-t border-gray-100 pt-4 mt-2">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium text-gray-700">Subtareas</h3>
              {task.subtasks?.length > 0 && (
                <span className="text-xs text-gray-500">
                  {task.subtasks.filter(st => st.completed).length} de {task.subtasks.length} completadas
                </span>
              )}
            </div>
            
            <ul className="space-y-2">
              {task.subtasks && task.subtasks.length > 0 ? (
                task.subtasks.map((subtask: Subtask) => (
                  <li 
                    key={subtask.id}
                    className="flex justify-between items-center p-2 bg-white rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center flex-1 min-w-0">
                      <span className={`mr-2 ${subtask.completed ? 'text-green-500' : 'text-gray-400'}`}>
                        {subtask.completed ? '✅' : '🕓'}
                      </span>
                      <span 
                        className={`text-sm truncate ${
                          subtask.completed ? 'line-through text-gray-400' : 'text-gray-700'
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
                          className="text-xs text-blue-600 hover:underline"
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
                          className="text-xs text-red-600 hover:underline"
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
        <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500 flex-shrink-0">
          <span className="text-xs text-gray-400">ID: {task.id}</span>
          <Button 
            variant="ghost" 
            onClick={onClose}
            className="text-sm"
          >
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  );
} 
