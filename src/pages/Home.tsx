import { useState } from 'react';
import { TaskForm } from '../componets/TaskForm';
import { TaskList } from '../componets/TaskList';
import { Moon, Sun } from 'lucide-react';

interface HomeProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export function Home({ darkMode, onToggleDarkMode }: HomeProps) {
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [section, setSection] = useState<'all' | 'today' | 'upcoming' | 'completed'| 'trabajo' | 'personal' | 'estudio'>('all');


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="sidebar fixed top-0 left-0 h-full z-50 bg-white dark:bg-gray-800 shadow">
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-2 mb-1">
                <span className="bg-indigo-100 dark:bg-indigo-900 p-2 rounded-lg">📝</span>
                Task IA
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Organiza tus tareas con IA</p>
            </div>
            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        <nav className="space-y-1">
        <button
  onClick={() => setSection('all')}
  className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3
    ${section === 'all' 
      ? 'bg-indigo-50 text-indigo-700 font-medium dark:bg-indigo-700 dark:text-indigo-100' 
      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'}
  `}
>
  <svg
    className="w-5 h-5 text-indigo-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 6h14M5 12h14M5 18h14"
    />
  </svg>
  Todas las tareas
</button>

{/* HOY */}
<button
  onClick={() => setSection('today')}
  className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3
    ${section === 'today' 
      ? 'bg-red-50 text-red-700 font-medium dark:bg-red-700 dark:text-red-100' 
      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'}
  `}
>
  <svg
    className="w-5 h-5 text-red-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
  Hoy
</button>

{/* COMPLETADAS */}
<button
  onClick={() => setSection('completed')}
  className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3
    ${section === 'completed' 
      ? 'bg-green-50 text-green-700 font-medium dark:bg-green-700 dark:text-green-100' 
      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'}
  `}
>
  <svg
    className="w-5 h-5 text-green-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 13l4 4L19 7"
    />
  </svg>
  Completadas
</button>

        </nav>

        <div className="mt-8">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-4">
    Categorías
  </h3>

  <div className="space-y-1">

    {/* TRABAJO */}
    <button
      onClick={() => setSection('trabajo')}
      className={`w-full text-left px-4 py-2 text-sm rounded-lg flex items-center gap-2
    ${section === 'trabajo' 
      ? 'bg-indigo-50 text-indigo-700 font-medium dark:bg-indigo-700 dark:text-indigo-100' 
      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'}
      `}
    >
      <span className="w-3 h-3 rounded-full bg-indigo-500 dark:bg-indigo-300"></span>
      Trabajo
    </button>

    {/* PERSONAL */}
    <button
      onClick={() => setSection('personal')}
      className={`w-full text-left px-4 py-2 text-sm rounded-lg flex items-center gap-2
    ${section === 'personal' 
      ? 'bg-green-50 text-green-700 font-medium dark:bg-green-700 dark:text-green-100' 
      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'}
      `}
    >
      <span className="w-3 h-3 rounded-full bg-green-500 dark:bg-green-300"></span>
      Personal
    </button>

    {/* ESTUDIO */}
    <button
      onClick={() => setSection('estudio')}
      className={`w-full text-left px-4 py-2 text-sm rounded-lg flex items-center gap-2
    ${section === 'estudio' 
      ? 'bg-yellow-50 text-yellow-700 font-medium dark:bg-yellow-700 dark:text-yellow-100' 
      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'}
      `}
    >
      <span className="w-3 h-3 rounded-full bg-yellow-500 dark:bg-yellow-30"></span>
      Estudio
    </button>

  </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="main-content relative z-0 ml-64 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-200">
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <header className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6 border border-gray-100 dark:border-gray-700 transition-colors duration-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Mis Tareas</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Gestiona y organiza tus tareas diarias</p>
              </div>
              <button 
                onClick={() => setShowTaskForm(!showTaskForm)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium
                  transition-colors duration-200 w-full sm:w-auto justify-center
                  dark:bg-indigo-700 dark:hover:bg-indigo-600 dark:text-white"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Nueva Tarea
              </button>
            </div>
          </header>

          <div className="mt-6">
            {showTaskForm && (
              <div className="fade-in mb-6">
                <TaskForm onClose={() => setShowTaskForm(false)} />
              </div>
            )}
            
            <div className="w-full">
              <TaskList filter={section} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
