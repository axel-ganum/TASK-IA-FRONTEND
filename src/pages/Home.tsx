import { TaskForm } from '../componets/TaskForm';
import { TaskList } from '../componets/TaskList';

// ✅ Home.tsx
export function Home() {
  return (
    <main className="max-w-5xl mx-auto p-8 space-y-8 bg-gradient-to-b from-indigo-50 via-white to-purple-50 rounded-2xl shadow-lg min-h-screen border border-indigo-100">
      <h1 className="text-4xl font-extrabold text-center text-indigo-700 drop-shadow-sm">
        🧠 Task IA
      </h1>
      <p className="text-center text-gray-600 text-sm mb-4">
        Organiza, analiza y mejora tus tareas con inteligencia artificial.
      </p>
      <TaskForm />
      <TaskList />
    </main>
  );
}
