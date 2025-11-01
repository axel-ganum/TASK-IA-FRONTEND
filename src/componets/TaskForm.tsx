import { useState } from 'react';
import { useTasks } from '../hooks/useTasks';

export function TaskForm() {
  const [message, setMessage] = useState("");
  const { createTask } = useTasks();

  const handleSubmit = () => {
    if (!message.trim()) return;
    createTask.mutate(message);
    setMessage("");
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50 mb-4">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Describí la tarea que querés crear con IA..."
        className="w-full p-2 border rounded-md mb-2"
      />
      <button
        onClick={handleSubmit}
        disabled={!message.trim() || createTask.isPending}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        {createTask.isPending ? "Creando..." : "Crear tarea con IA"}
      </button>
    </div>
  );
}