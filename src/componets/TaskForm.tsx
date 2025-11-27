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
    <div className="card bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-5 border-b border-gray-100 bg-gray-50">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Nueva Tarea con IA</h3>
          {onClose && (
            <button 
              type="button" 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Cerrar</span>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Describe la tarea y la IA te ayudará a crearla con el formato adecuado.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-5 space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Título <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título de la tarea"
            className="input"
            required
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Descripción
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Añade detalles sobre la tarea..."
            className="input min-h-[100px]"
            rows={3}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prioridad
            </label>
            <div className="flex space-x-2">
              <button
                type="button"
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  priority === 'high' 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setPriority('high')}
              >
                Alta
              </button>
              <button
                type="button"
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  priority === 'medium' 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setPriority('medium')}
              >
                Media
              </button>
              <button
                type="button"
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  priority === 'low' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setPriority('low')}
              >
                Baja
              </button>
            </div>
          </div>
          
        <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Categoría
  </label>

  <div className="flex space-x-2">
    <button
      type="button"
      className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
        category === "personal"
          ? "bg-green-100 text-green-800"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
      onClick={() => setCategory("personal")}
    >
      🏠 Personal
    </button>

    <button
      type="button"
      className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
        category === "trabajo"
          ? "bg-indigo-100 text-indigo-800"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
      onClick={() => setCategory("trabajo")}
    >
      💼 Trabajo
    </button>

    <button
      type="button"
      className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
        category === "estudio"
          ? "bg-yellow-100 text-yellow-800"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
      onClick={() => setCategory("estudio")}
    >
      📚 Estudio
    </button>
  </div>
</div>
          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
              Fecha límite
            </label>
            <input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="input"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost order-2 sm:order-1 w-full sm:w-auto"
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            className="btn btn-primary order-1 sm:order-2 w-full sm:w-auto flex items-center justify-center gap-2"
            disabled={!title.trim() || createTask.isPending}
          >
            {createTask.isPending ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generando...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Generar con IA
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}