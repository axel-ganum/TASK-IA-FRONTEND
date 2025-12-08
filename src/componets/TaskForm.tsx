import { useState } from 'react';
import { useTasks } from '../hooks/useTasks';

type TaskFormProps = {
  onClose?: () => void;
};

export function TaskForm({ onClose }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"high" | "medium" | "low">("medium");
  const [dueDate, setDueDate] = useState("");
  const [category, setCategory] = useState<"personal" | "trabajo" | "estudio">("personal");

  
  const { createTask } = useTasks();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || createTask.isPending) return;
    
    try {
      // Crear un objeto estructurado con los datos de la tarea
      const taskData = {
        title: title,
        description: description || '',
        priority: priority,
        dueDate: dueDate ? new Date(dueDate).toISOString() : null,
        category: category
      };
      
      // Convertir a JSON para enviar al backend
      const prompt = JSON.stringify(taskData);
      
      // Mostrar los datos en consola para depuración
      console.log('Datos enviados a la IA:', taskData);
      
      // Enviar los datos a la IA
      await createTask.mutateAsync(prompt);

      // Reset form solo si la mutación fue exitosa
      setTitle("");
      setDescription("");
      setPriority("medium");
      setDueDate("");
      
      // Cerrar el formulario si se proporciona onClose
      onClose?.();
    } catch (error) {
      console.error("Error al crear la tarea:", error);
      // El error ya se maneja en el hook useTasks
    }
  };

  return (
    <div className="card bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden">
      <div className="p-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Nueva Tarea con IA</h3>
          {onClose && (
            <button 
              type="button" 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-100"
            >
              <span className="sr-only">Cerrar</span>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Describe la tarea y la IA te ayudará a crearla con el formato adecuado.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Título
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="¿Qué necesitas hacer?"
            required
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Descripción (opcional)
          </label>
          <textarea
            id="description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Detalles de la tarea..."
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Prioridad
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  priority === 'high' 
                    ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
                onClick={() => setPriority('high')}
              >
                Alta
              </button>
              <button
                type="button"
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  priority === 'medium' 
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
                onClick={() => setPriority('medium')}
              >
                Media
              </button>
              <button
                type="button"
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  priority === 'low' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
                onClick={() => setPriority('low')}
              >
                Baja
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Categoría
            </label>
            <div className="flex gap-2 flex-wrap">
              <button
                type="button"
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  category === 'personal' 
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
                onClick={() => setCategory('personal')}
              >
                Personal
              </button>
              <button
                type="button"
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  category === 'trabajo' 
                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
                onClick={() => setCategory('trabajo')}
              >
                Trabajo
              </button>
              <button
                type="button"
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  category === 'estudio' 
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
                onClick={() => setCategory('estudio')}
              >
                Estudio
              </button>
            </div>
          </div>
          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Fecha límite (opcional)
            </label>
            <input
              type="date"
              id="dueDate"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-3 pt-2">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            disabled={!title.trim() || createTask.isPending}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {createTask.isPending ? (
              <span>Creando...</span>
            ) : (
              <span>Crear tarea</span>
            )}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}