import type { Task } from '../types/Task';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useEffect, useState } from 'react';

import type { Components } from 'react-markdown';

type MarkdownComponentProps = {
  node?: any;
  children?: React.ReactNode;
  [key: string]: any;
};

interface CodeComponentProps extends React.HTMLAttributes<HTMLElement> {
  inline?: boolean;
  className?: string;
  node?: any;
  children?: React.ReactNode;
};

interface TaskDetailProps {
  task: Task;
}

export function TaskDetail({ task }: TaskDetailProps) {
  const formatDate = (dateString: string | number | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getStatusEmoji = (status: string) => {
    switch (status) {
      case 'completed':
        return '✅';
      case 'in-progress':
        return '🔄';
      case 'blocked':
        return '⛔';
      default:
        return '📝';
    }
  };

  const getPriorityEmoji = (priority: string) => {
    switch (priority) {
      case 'high':
      case 'urgent':
        return '🔴';
      case 'medium':
        return '🟡';
      default:
        return '🔵';
    }
  };

  const [safeDescription, setSafeDescription] = useState('');
  const [safeNotes, setSafeNotes] = useState('');

  // Sanitize and prepare markdown content
  useEffect(() => {
    const escapeHtml = (text: string) => {
      return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    };

    const processMarkdown = (content: string | null | undefined) => {
      if (!content) return '';
      
      // Ensure content is a string
      let processed = String(content);
      
      // Normalize line endings
      processed = processed.replace(/\r\n/g, '\n');
      
      // Preserve code blocks
      processed = processed.replace(/```([\s\S]*?)```/g, (match) => {
        return match.replace(/\n/g, '\n    ');
      });
      
      // Escape HTML but preserve markdown syntax
      const lines = processed.split('\n');
      let inCodeBlock = false;
      
      const processedLines = lines.map(line => {
        if (line.trim().startsWith('```')) {
          inCodeBlock = !inCodeBlock;
          return line;
        }
        
        if (!inCodeBlock) {
          // Only escape HTML outside of code blocks
          return escapeHtml(line);
        }
        
        return line;
      });
      
      return processedLines.join('\n');
    };

    if (task.description) {
      setSafeDescription(processMarkdown(task.description));
    }

    if (task.notes) {
      setSafeNotes(processMarkdown(task.notes));
    }
  }, [task.description, task.notes]);

  return (
    <div className="task-detail bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-2xl font-bold text-gray-900">{task.title}</h1>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              ID: {task.id}
            </span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
          <div className="flex items-center bg-gray-50 px-3 py-1 rounded-full">
            <span className="mr-2">{getStatusEmoji(task.status)}</span>
            <span className="capitalize font-medium">{task.status.replace(/-/g, ' ')}</span>
          </div>
          <div className="flex items-center bg-gray-50 px-3 py-1 rounded-full">
            <span className="mr-2">{getPriorityEmoji(task.priority)}</span>
            <span className="capitalize font-medium">{task.priority}</span>
          </div>
          <div className="flex items-center bg-gray-50 px-3 py-1 rounded-full">
            <span className="mr-2">📅</span>
            <span>{formatDate(task.dueDate)}</span>
          </div>
        </div>

        {safeDescription && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Descripción</h3>
            <div className="prose max-w-none p-4 bg-gray-50 rounded-lg overflow-auto">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({node, ...props}: MarkdownComponentProps & React.HTMLAttributes<HTMLHeadingElement>) => 
                    <h3 className="text-xl font-bold mt-6 mb-2" {...props} />,
                  h2: ({node, ...props}: MarkdownComponentProps & React.HTMLAttributes<HTMLHeadingElement>) => 
                    <h4 className="text-lg font-semibold mt-5 mb-2" {...props} />,
                  h3: ({node, ...props}: MarkdownComponentProps & React.HTMLAttributes<HTMLHeadingElement>) => 
                    <h5 className="text-base font-medium mt-4 mb-2" {...props} />,
                  p: ({node, ...props}: MarkdownComponentProps & React.HTMLAttributes<HTMLParagraphElement>) => 
                    <p className="mb-4 leading-relaxed" {...props} />,
                  ul: ({node, ...props}: MarkdownComponentProps & React.HTMLAttributes<HTMLUListElement>) => 
                    <ul className="list-disc pl-5 mb-4 space-y-1" {...props} />,
                  ol: ({node, ...props}: MarkdownComponentProps & React.HTMLAttributes<HTMLOListElement>) => 
                    <ol className="list-decimal pl-5 mb-4 space-y-1" {...props} />,
                  li: ({node, ...props}: MarkdownComponentProps & React.LiHTMLAttributes<HTMLLIElement>) => 
                    <li className="mb-1" {...props} />,
                  code: ({node, inline, className, children, ...props}: CodeComponentProps) => {
                    if (inline) {
                      return <code className="bg-gray-100 px-1 rounded text-sm font-mono" {...props}>{children}</code>;
                    }
                    return (
                      <pre className="bg-gray-800 text-gray-100 p-3 rounded overflow-x-auto my-4">
                        <code className={className} {...props}>
                          {children}
                        </code>
                      </pre>
                    );
                  },
                  a: ({node, ...props}: MarkdownComponentProps & React.AnchorHTMLAttributes<HTMLAnchorElement>) => 
                    <a className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
                  blockquote: ({node, ...props}: MarkdownComponentProps & React.BlockquoteHTMLAttributes<HTMLQuoteElement>) => 
                    <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-4" {...props} />,
                  table: ({node, ...props}: MarkdownComponentProps & React.TableHTMLAttributes<HTMLTableElement>) => 
                    <div className="overflow-x-auto"><table className="min-w-full border-collapse my-4" {...props} /></div>,
                  thead: ({node, ...props}: MarkdownComponentProps & React.HTMLAttributes<HTMLTableSectionElement>) => 
                    <thead className="bg-gray-100" {...props} />,
                  th: ({node, ...props}: MarkdownComponentProps & React.ThHTMLAttributes<HTMLTableCellElement>) => 
                    <th className="border p-2 text-left font-semibold" {...props} />,
                  td: ({node, ...props}: MarkdownComponentProps & React.TdHTMLAttributes<HTMLTableCellElement>) => 
                    <td className="border p-2" {...props} />,
                  tr: ({node, ...props}: MarkdownComponentProps & React.HTMLAttributes<HTMLTableRowElement>) => 
                    <tr className="hover:bg-gray-50" {...props} />,
                }}
              >
                {safeDescription}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>

      {task.tags && task.tags.length > 0 && (
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {task.tags.map((tag) => (
              <span 
                key={tag} 
                className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {task.subtasks && task.subtasks.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">Subtareas</h3>
          <div className="space-y-2">
            {task.subtasks.map((subtask) => (
              <div 
                key={subtask.id} 
                className="flex items-start p-3 bg-gray-50 rounded-lg"
              >
                <span className="mr-2">{subtask.completed ? '✅' : '○'}</span>
                <div>
                  <p className="font-medium">{subtask.title}</p>
                  {subtask.description && (
                    <p className="text-sm text-gray-600">{subtask.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {safeNotes && (
        <div className="bg-yellow-50 p-6 rounded-lg border-l-4 border-yellow-400 mt-6">
          <h4 className="font-semibold text-yellow-800 text-lg mb-3">📝 Notas</h4>
          <div className="prose max-w-none text-yellow-800">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({node, ...props}) => <h3 className="text-xl font-bold mt-6 mb-2 text-yellow-900" {...props} />,
                h2: ({node, ...props}) => <h4 className="text-lg font-semibold mt-5 mb-2 text-yellow-900" {...props} />,
                p: ({node, ...props}) => <p className="mb-4 leading-relaxed text-yellow-800" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-4 space-y-1 text-yellow-800" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-4 space-y-1 text-yellow-800" {...props} />,
                li: ({node, ...props}) => <li className="mb-1" {...props} />,
                code: ({node, inline, className, children, ...props}: {node?: any, inline?: boolean, className?: string, children?: React.ReactNode}) => 
                  inline ? 
                  <code className="bg-yellow-100 px-1 rounded text-sm font-mono text-yellow-900" {...props}>{children}</code> :
                  <pre className="bg-gray-800 text-gray-100 p-3 rounded overflow-x-auto my-4"><code className={className} {...props}>{children}</code></pre>,
                a: ({node, ...props}) => <a className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
              }}
            >
              {safeNotes}
            </ReactMarkdown>
          </div>
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-gray-200 text-sm text-gray-500">
        <p>Creada el: {formatDate(task.createdAt)}</p>
        {task.updatedAt && <p>Actualizada el: {formatDate(task.updatedAt)}</p>}
      </div>
    </div>
  );
}
