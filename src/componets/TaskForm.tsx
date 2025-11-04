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
     <div className="p-6 bg-white border border-indigo-100 rounded-2xl shadow-md transition hover:shadow-lg">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="📝 Describí la tarea que querés crear con IA..."
        className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
        rows={3}
      />
      <button
        onClick={handleSubmit}
        disabled={!message.trim() || createTask.isPending}
        className="w-full py-2.5 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
      >
        {createTask.isPending ? "Creando..." : "✨ Crear tarea con IA"}
      </button>
    </div>
  );
}