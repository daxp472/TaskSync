import { useState } from 'react';
import { format } from 'date-fns';

export default function TaskForm({ onSubmit }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit({
      title,
      description,
      priority,
      dueDate: new Date(dueDate).toISOString(),
    });

    // Reset form
    setTitle('');
    setDescription('');
    setPriority('medium');
    setDueDate(format(new Date(), 'yyyy-MM-dd'));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm mb-6 
                                            border border-gray-100 dark:border-gray-700">
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Task Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 
                     shadow-sm focus:border-primary-500 focus:ring-primary-500
                     dark:bg-gray-700 dark:text-white"
            placeholder="Enter task title..."
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 
                     shadow-sm focus:border-primary-500 focus:ring-primary-500
                     dark:bg-gray-700 dark:text-white"
            placeholder="Enter task description..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Priority
            </label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 
                       shadow-sm focus:border-primary-500 focus:ring-primary-500
                       dark:bg-gray-700 dark:text-white"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>

          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Due Date
            </label>
            <input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 
                       shadow-sm focus:border-primary-500 focus:ring-primary-500
                       dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 
                   transition-colors dark:bg-primary-500 dark:hover:bg-primary-600"
        >
          Add Task
        </button>
      </div>
    </form>
  );
}