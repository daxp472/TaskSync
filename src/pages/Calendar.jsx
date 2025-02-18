import { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isSameDay } from 'date-fns';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import MainLayout from '../components/Layout/MainLayout';

export default function Calendar() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    fetchTasks();
  }, [user, currentDate]);

  const fetchTasks = async () => {
    if (!user) return;
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    
    const q = query(
      collection(db, 'tasks'),
      where('userId', '==', user.uid),
      where('dueDate', '>=', start.toISOString()),
      where('dueDate', '<=', end.toISOString())
    );

    const querySnapshot = await getDocs(q);
    const taskList = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setTasks(taskList);
  };

  const days = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate)
  });

  const getTasksForDay = (date) => {
    return tasks.filter(task => 
      isSameDay(new Date(task.dueDate), date)
    );
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {format(currentDate, 'MMMM yyyy')}
          </h1>
          <div className="space-x-4">
            <button
              onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Today
            </button>
            <button
              onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
          
          {days.map(day => {
            const dayTasks = getTasksForDay(day);
            return (
              <div
                key={day.toISOString()}
                className={`min-h-[120px] p-2 border rounded-lg ${
                  isToday(day) ? 'bg-primary-50 border-primary-500' : 'bg-white border-gray-200'
                }`}
              >
                <div className="text-right text-sm text-gray-500 mb-2">
                  {format(day, 'd')}
                </div>
                <div className="space-y-1">
                  {dayTasks.map(task => (
                    <div
                      key={task.id}
                      className={`text-xs p-1 rounded ${
                        task.priority === 'high' ? 'bg-red-100 text-red-800' :
                        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}
                    >
                      {task.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
}