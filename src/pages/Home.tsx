import { TaskForm } from '../componets/TaskForm';
import { TaskList } from '../componets/TaskList';

// ✅ Home.tsx

export function Home() {
  return (
     <main className="relative min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 overflow-hidden">
      {/* Fondo con patrón sutil */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 pointer-events-none"></div>

      {/* Efecto de luz suave */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-indigo-300/20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-300/30 blur-[150px] rounded-full"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12 space-y-12">
        <header className="flex flex-col sm:flex-row justify-between items-center gap-6">
          <div>
            <h1 className="text-4xl font-extrabold text-indigo-700 tracking-tight drop-shadow-sm">
              🧠 Task IA
            </h1>
            <p className="text-gray-600 text-sm sm:text-base mt-1">
              Organiza, analiza y mejora tus tareas con inteligencia artificial.
            </p>
          </div>

          <button
            className="
              bg-gradient-to-r from-indigo-600 to-purple-600 
              text-white px-6 py-3 rounded-xl font-semibold 
              shadow-md hover:shadow-lg hover:opacity-90 
              transition-all duration-300
            "
          >
            + Nueva Tarea
          </button>
        </header>

        <TaskForm />
        <TaskList />
      </div>
    </main>
  );
}
