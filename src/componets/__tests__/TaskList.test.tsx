import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TaskList } from '../TaskList';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';

// Mock the useTasks hook
const mockTasks = [
  {
    id: '1',
    title: 'Tarea de prueba 1',
    description: 'Descripción de prueba 1',
    completed: false,
    priority: 'medium',
    category: 'trabajo',
    dueDate: '2025-12-31T00:00:00.000Z',
    status: 'pending',
    tags: ['importante'],
    createdAt: '2025-01-01T00:00:00.000Z'
  },
  {
    id: '2',
    title: 'Tarea completada',
    description: 'Esta tarea ya está completada',
    completed: true,
    priority: 'high',
    category: 'personal',
    dueDate: '2025-12-31T00:00:00.000Z',
    status: 'completed',
    tags: ['urgente'],
    createdAt: '2025-01-01T00:00:00.000Z'
  },
  {
    id: '3',
    title: 'Otra tarea',
    description: 'Otra descripción',
    completed: false,
    priority: 'low',
    category: 'estudio',
    dueDate: '2025-12-31T00:00:00.000Z',
    status: 'pending',
    tags: ['estudio'],
    createdAt: '2025-01-01T00:00:00.000Z'
  }
];

const mockUseTasks = jest.fn(() => ({
  tasks: mockTasks,
  isLoading: false,
  isError: false,
  summarize: {
    mutateAsync: jest.fn().mockResolvedValue({
      summary: 'Resumen de prueba generado por IA',
      insights: 'Insights de prueba',
      suggestions: 'Sugerencias de prueba'
    }),
    isPending: false
  },
  analyze: {
    mutateAsync: jest.fn().mockResolvedValue({}),
    isPending: false
  }
}));

jest.mock('../../hooks/useTasks', () => ({
  useTasks: () => mockUseTasks()
}));

describe('TaskList', () => {
  const renderComponent = (filter: 'all' | 'today' | 'upcoming' | 'completed' | 'trabajo' | 'personal' | 'estudio' = 'all') => {
    const queryClient = new QueryClient();
    
    return render(
      <QueryClientProvider client={queryClient}>
        <TaskList filter={filter} />
      </QueryClientProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state', async () => {
    mockUseTasks.mockReturnValueOnce({
      tasks: [],
      isLoading: true,
      isError: false,
      summarize: { mutateAsync: jest.fn(), isPending: false },
      analyze: { mutateAsync: jest.fn(), isPending: false }
    });
    
    renderComponent();
    
    // Wait for the loading spinner to appear
    const loadingSpinner = await screen.findByTestId('loading-spinner');
    expect(loadingSpinner).toBeInTheDocument();
    expect(loadingSpinner).toHaveClass('animate-spin');
  });

  it('renders error state', async () => {
    mockUseTasks.mockReturnValueOnce({
      tasks: [],
      isLoading: false,
      isError: true,
      summarize: { mutateAsync: jest.fn(), isPending: false },
      analyze: { mutateAsync: jest.fn(), isPending: false }
    });
    
    renderComponent();
    
    // Wait for the error message to appear
    const errorMessage = await screen.findByText(/error al cargar las tareas/i);
    expect(errorMessage).toBeInTheDocument();
  });

  it('renders empty state', async () => {
    mockUseTasks.mockReturnValueOnce({
      tasks: [],
      isLoading: false,
      isError: false,
      summarize: { mutateAsync: jest.fn(), isPending: false },
      analyze: { mutateAsync: jest.fn(), isPending: false }
    });
    
    renderComponent();
    
    // Wait for the empty state message to appear
    const emptyMessage = await screen.findByText(/no hay tareas/i);
    expect(emptyMessage).toBeInTheDocument();
  });

  it('renders tasks list', async () => {
    renderComponent();
    
    // Wait for the tasks to be rendered
    const task1 = await screen.findByRole('heading', { name: /tarea de prueba 1/i });
    const completedTask = await screen.findByRole('heading', { name: /tarea completada/i });
    const otherTask = await screen.findByRole('heading', { name: /otra tarea/i });
    
    expect(task1).toBeInTheDocument();
    expect(completedTask).toBeInTheDocument();
    expect(otherTask).toBeInTheDocument();
  });

  it('filters tasks by tab', () => {
    renderComponent();
    
    // Initially shows all tasks
    expect(screen.getByText(/tarea de prueba 1/i)).toBeInTheDocument();
    
    // Click on 'Completadas' tab
    fireEvent.click(screen.getByRole('button', { name: /completadas/i }));
    
    // Should only show completed tasks
    const task1 = screen.queryByText(/tarea de prueba 1/i);
    const completedTask = screen.getByRole('heading', { name: /tarea completada/i });
    
    // Check that only the completed task is visible
    if (task1) {
      // If task1 is found, it should not be in the document
      expect(task1).not.toBeInTheDocument();
    }
    
    // The completed task should be visible
    expect(completedTask).toBeInTheDocument();
    
    // Click on 'Pendientes' tab
    fireEvent.click(screen.getByRole('button', { name: /pendientes/i }));
    
    // Should only show pending tasks
    expect(screen.getByText(/tarea de prueba 1/i)).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /tarea completada/i })).not.toBeInTheDocument();
  });

  it('filters tasks by search query', () => {
    renderComponent();
    
    // Type in search input
    const searchInput = screen.getByPlaceholderText('Buscar tareas...');
    fireEvent.change(searchInput, { target: { value: 'completada' } });
    
    // Should only show matching tasks
    const task1 = screen.queryByText(/tarea de prueba 1/i);
    const completedTask = screen.getByRole('heading', { name: /tarea completada/i });
    
    // Check that only the completed task is visible
    if (task1) {
      // If task1 is found, it should not be in the document
      expect(task1).not.toBeInTheDocument();
    }
    
    // The completed task should be visible
    expect(completedTask).toBeInTheDocument();
  });

  it('filters tasks by category when filter prop changes', () => {
    const { rerender } = render(
      <QueryClientProvider client={new QueryClient()}>
        <TaskList filter="trabajo" />
      </QueryClientProvider>
    );
    
    // Should only show work tasks
    expect(screen.getByText(/tarea de prueba 1/i)).toBeInTheDocument();
    expect(screen.queryByText(/tarea completada/i)).not.toBeInTheDocument();
    
    // Change filter to 'personal'
    rerender(
      <QueryClientProvider client={new QueryClient()}>
        <TaskList filter="personal" />
      </QueryClientProvider>
    );
    
    // Should only show personal tasks
    expect(screen.queryByText(/tarea de prueba 1/i)).not.toBeInTheDocument();
    expect(screen.getByText(/tarea completada/i)).toBeInTheDocument();
  });

  it('shows summary modal when clicking summary button', async () => {
    // Mock the summary response
    const mockSummary = {
      summary: 'Resumen de prueba generado por IA',
      insights: 'Insights de prueba',
      suggestions: 'Sugerencias de prueba'
    };
    
    mockUseTasks.mockReturnValueOnce({
      tasks: mockTasks,
      isLoading: false,
      isError: false,
      summarize: {
        mutateAsync: jest.fn().mockResolvedValue(mockSummary),
        isPending: false
      },
      analyze: {
        mutateAsync: jest.fn().mockResolvedValue({}),
        isPending: false
      }
    });
    
    renderComponent();
    
    // Click on summary button
    fireEvent.click(screen.getByText(/resumen con ia/i));
    
    // Wait for the modal to open and check content
    await waitFor(() => {
      expect(screen.getByText(/resumen de tareas/i)).toBeInTheDocument();
      expect(screen.getByText(/resumen generado por ia/i)).toBeInTheDocument();
      expect(screen.getByText(mockSummary.summary)).toBeInTheDocument();
    });
  });

  it('shows no results message when no tasks match search', () => {
    renderComponent();
    
    // Type in search input with non-matching text
    const searchInput = screen.getByPlaceholderText('Buscar tareas...');
    fireEvent.change(searchInput, { target: { value: 'no existe esta tarea' } });
    
    // Should show no results message
    expect(screen.getByText('No se encontraron tareas')).toBeInTheDocument();
  });

  it('displays task count correctly', () => {
    renderComponent();
    
    // Should show total count initially
    expect(screen.getByText(/3 tareas/i)).toBeInTheDocument();
    
    // Click on 'Completadas' tab
    fireEvent.click(screen.getByText(/completadas/i));
    
    // Should show completed count
    expect(screen.getByText(/1 tarea completada/i)).toBeInTheDocument();
    
    // Click on 'Pendientes' tab
    fireEvent.click(screen.getByText(/pendientes/i));
    
    // Should show pending count
    expect(screen.getByText(/2 tareas pendientes/i)).toBeInTheDocument();
  });
});
