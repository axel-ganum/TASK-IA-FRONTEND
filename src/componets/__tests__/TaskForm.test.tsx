import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TaskForm } from '../TaskForm';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';

// Mock the useTasks hook
const mockMutateAsync = jest.fn().mockResolvedValue({});
const mockUseTasks = jest.fn(() => ({
  createTask: {
    mutateAsync: mockMutateAsync,
    isPending: false,
  },
}));

jest.mock('../../hooks/useTasks', () => ({
  useTasks: () => mockUseTasks(),
}));

describe('TaskForm', () => {
  const mockOnClose = jest.fn();
  
  const renderComponent = (props = {}) => {
    const queryClient = new QueryClient();
    
    return render(
      <QueryClientProvider client={queryClient}>
        <TaskForm onClose={mockOnClose} {...props} />
      </QueryClientProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the form with all fields', () => {
    renderComponent();
    
    expect(screen.getByLabelText(/título/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/descripción/i)).toBeInTheDocument();
    expect(screen.getByText(/prioridad/i)).toBeInTheDocument();
    expect(screen.getByText(/categoría/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/fecha límite/i)).toBeInTheDocument();
    expect(screen.getByText(/crear tarea/i)).toBeInTheDocument();
  });

  it('allows entering task title and description', () => {
    renderComponent();
    
    const titleInput = screen.getByLabelText(/título/i);
    const descriptionInput = screen.getByLabelText(/descripción/i);
    
    fireEvent.change(titleInput, { target: { value: 'Test Task' } });
    fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });
    
    expect(titleInput).toHaveValue('Test Task');
    expect(descriptionInput).toHaveValue('Test Description');
  });

  it('allows selecting priority', () => {
    renderComponent();
    
    const mediumPriorityButton = screen.getByText('Media');
    const highPriorityButton = screen.getByText('Alta');
    
    // Default should be medium
    expect(mediumPriorityButton).toHaveClass('bg-yellow-100', 'text-yellow-800');
    
    // Change to high priority
    fireEvent.click(highPriorityButton);
    expect(highPriorityButton).toHaveClass('bg-red-100', 'text-red-800');
  });

  it('allows selecting category', () => {
    renderComponent();
    
    const personalButton = screen.getByText('Personal');
    const trabajoButton = screen.getByText('Trabajo');
    
    // Default should be personal
    expect(personalButton).toHaveClass('bg-blue-100', 'text-blue-800');
    
    // Change to trabajo category
    fireEvent.click(trabajoButton);
    expect(trabajoButton).toHaveClass('bg-purple-100', 'text-purple-800');
  });

  it('allows setting a due date', () => {
    renderComponent();
    
    const dueDateInput = screen.getByLabelText(/fecha límite/i);
    const testDate = '2025-12-31';
    
    fireEvent.change(dueDateInput, { target: { value: testDate } });
    
    expect(dueDateInput).toHaveValue(testDate);
  });

  it('submits the form with correct data', async () => {
    renderComponent();
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText(/título/i), { 
      target: { value: 'Test Task' } 
    });
    fireEvent.change(screen.getByLabelText(/descripción/i), { 
      target: { value: 'Test Description' } 
    });
    fireEvent.click(screen.getByText('Alta'));
    fireEvent.click(screen.getByText('Trabajo'));
    fireEvent.change(screen.getByLabelText(/fecha límite/i), { 
      target: { value: '2025-12-31' } 
    });
    
    // Submit the form
    fireEvent.click(screen.getByText(/crear tarea/i));
    
    // Check if the form was submitted with the correct data
    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledTimes(1);
      
      // Get the first argument of the first call
      const submittedData = JSON.parse(mockMutateAsync.mock.calls[0][0]);
      
      expect(submittedData).toMatchObject({
        title: 'Test Task',
        description: 'Test Description',
        priority: 'high',
        category: 'trabajo',
      });
      
      // The date should be converted to ISO string
      expect(submittedData.dueDate).toBe('2025-12-31T00:00:00.000Z');
    });
  });

  it('calls onClose after successful form submission', async () => {
    // Reset the mock to ensure a clean state
    mockMutateAsync.mockClear();
    mockOnClose.mockClear();
    
    // Setup the mock to resolve successfully
    mockMutateAsync.mockResolvedValueOnce({});
    
    renderComponent({ onClose: mockOnClose });
    
    // Fill out required field
    fireEvent.change(screen.getByLabelText(/título/i), { 
      target: { value: 'Test Task' } 
    });
    
    // Submit the form
    fireEvent.click(screen.getByText(/crear tarea/i));
    
    // Wait for the mutation to complete
    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('does not submit the form if title is empty', () => {
    // Reset the mock to ensure a clean state
    mockMutateAsync.mockClear();
    
    renderComponent();
    
    // Submit the form without filling out the title
    fireEvent.click(screen.getByText(/crear tarea/i));
    
    // The form should not be submitted
    expect(mockMutateAsync).not.toHaveBeenCalled();
  });
});
