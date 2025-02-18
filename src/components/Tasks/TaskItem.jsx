import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { format } from 'date-fns';
import { FaTrash, FaGripVertical } from 'react-icons/fa';

export default function TaskItem({ task, onDelete, onToggleComplete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200';
      case 'medium': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200';
      case 'low': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200';
      default: return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200';
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all 
                 border border-gray-100 dark:border-gray-700"
    >
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              className="cursor-grab text-gray-400 hover:text-gray-600 dark:text-gray-500 
                         dark:hover:text-gray-300" 
              {...attributes} 
              {...listeners}
            >
              <FaGripVertical />
            </button>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => onToggleComplete(task.id)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 
                         dark:border-gray-600 rounded transition-colors"
            />
            <div>
              <h3 className={`font-medium ${
                task.completed 
                  ? 'line-through text-gray-500 dark:text-gray-400' 
                  : 'text-gray-900 dark:text-white'
              }`}>
                {task.title}
              </h3>
              {task.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {task.description}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </span>
            {task.dueDate && (
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}
              </span>
            )}
            <button
              onClick={() => onDelete(task.id)}
              className="text-red-600 hover:text-red-800 dark:text-red-400 
                         dark:hover:text-red-300 transition-colors"
            >
              <FaTrash />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}