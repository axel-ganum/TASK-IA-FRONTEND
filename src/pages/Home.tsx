import { TaskForm } from '../componets/TaskForm';
import { TaskList } from '../componets/TaskList';

export function Home() {
  return (
    <main className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center">🧠 Task IA</h1>
      <TaskForm />
      <TaskList />
    </main>
  );
}
