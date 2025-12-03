import { TaskItem } from './TaskItem';
import { useTasks } from '../hooks/useTasks';
import { toast } from 'react-toastify';
import ReactMarkdown from "react-markdown";
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@radix-ui/react-dialog';
import { DialogHeader } from '../utils/dialog';
import remarkGfm from 'remark-gfm';
import { Button } from '../utils/button';

export function TaskList({ filter }: { filter: 'all' | 'today' | 'upcoming' | 'completed' | 'trabajo' | 'personal' | 'estudio' }) {
  const { tasks, isLoading, isError, summarize } = useTasks();
  const [summaryModalOpen, setSummaryModalOpen] = useState(false);
  const [summaryText, setSummaryText] = useState("");
  const [activeTab, setActiveTab] = useState<'all' | 'completed' | 'pending'>('all');
  const [searchQuery, setSearchQuery] = useState('');


// Filtrar tareas según la pestaña activa + filtro del sidebar
const filteredBySection = tasks?.filter(task => {
  if (!task) return false;

  if (filter === 'completed') return task.completed;
  if (filter === 'today') {
    return new Date(task.createdAt).toDateString() === new Date().toDateString();
  }
  if (filter === 'upcoming') {
    return new Date(task.createdAt) > new Date();
  }

   // --- Filtros por categoría ---
  if (filter === 'trabajo') return task.category === 'trabajo';
  if (filter === 'personal') return task.category === 'personal';
  if (filter === 'estudio') return task.category === 'estudio';

  return true; // 'all'
}) || [];

// Filtrar tareas según la pestaña activa + búsqueda + sección
const filteredTasks = filteredBySection.filter(task => {
  if (!task) return false;

  const matchesTab =
    activeTab === 'all' ||
    (activeTab === 'completed' && task.completed) ||
    (activeTab === 'pending' && !task.completed);

  const matchesSearch =
    task.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (task.description &&
      task.description.toLowerCase().includes(searchQuery.toLowerCase()));

  return matchesTab && matchesSearch;
});





  const handleSummarize = async () => {
    try {
      const result = await summarize.mutateAsync();
      console.log("🧠 Resultado del resumen:", result);

      const summary =
        result?.summary ||
        result?.result ||
        result?.message ||
        JSON.stringify(result, null, 2);

      setSummaryText(summary);
      setSummaryModalOpen(true);
    } catch (error) {
      console.error("Error al resumir tareas:", error);
      toast.error("Error al resumir tareas");
    }
  };



  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  if (isError) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">
              Error al cargar las tareas. Por favor, intenta recargar la página.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!tasks?.length) {
    return (
      <div className="text-center py-12">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No hay tareas</h3>
        <p className="mt-1 text-sm text-gray-500">
          Comienza creando una nueva tarea para organizar tu día.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Filtros y búsqueda */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        {/* Pestañas */}
        <div className="flex rounded-lg bg-gray-100 p-1">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'all' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Todas
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'pending' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Pendientes
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'completed' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Completadas
          </button>
        </div>

        {/* Búsqueda */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Buscar tareas..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Contador de tareas */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">
          {filteredTasks.length} {filteredTasks.length === 1 ? 'tarea' : 'tareas'} {activeTab !== 'all' ? activeTab === 'completed' ? 'completadas' : 'pendientes' : ''}
        </p>
        
        <button
          onClick={handleSummarize}
          disabled={summarize.isPending}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {summarize.isPending ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analizando...
            </>
          ) : (
            'Resumen con IA'
          )}
        </button>
      </div>

      {/* Lista de tareas */}
      {filteredTasks.length > 0 ? (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {filteredTasks.map((task) => (
    <TaskItem key={task.id} task={task} />
  ))}
</div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron tareas</h3>
          <p className="mt-1 text-sm text-gray-500">
            Intenta con otros términos de búsqueda o crea una nueva tarea.
          </p>
        </div>
      )}

    
     {/* MODAL: RESUMEN IA */}
<Dialog open={summaryModalOpen} onOpenChange={setSummaryModalOpen}>
  <DialogContent className="fixed z-[9999]
       w-[90vw] max-w-2xl
       max-h-[90vh]
       flex flex-col
       p-0
       overflow-hidden">

    <DialogHeader className="px-6 pt-6 pb-4 border-b">
      <DialogTitle className="text-xl font-semibold text-gray-900">
        Resumen de tareas
      </DialogTitle>
      <DialogDescription className="text-gray-600">
        Resumen generado por IA
      </DialogDescription>
    </DialogHeader>

    <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
      <div className="bg-indigo-50/50 p-5 rounded-lg border border-indigo-100">
        <h4 className="flex items-center gap-2 text-lg font-medium text-indigo-800 mb-3">
          <span className="text-xl">📄</span> Resumen
        </h4>

        <div className="prose prose-sm max-w-none text-gray-700">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {summaryText || 'No se pudo generar un resumen.'}
          </ReactMarkdown>
        </div>
      </div>
    </div>

    <div className="px-6 py-4 border-t bg-gray-50 flex justify-end space-x-3">
      <Button 
        variant="outline" 
        onClick={() => setSummaryModalOpen(false)}
        className="px-4"
      >
        Cerrar
      </Button>
    </div>

  </DialogContent>
</Dialog>

    </div>
  );
}
