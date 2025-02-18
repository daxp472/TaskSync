import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import MainLayout from '../components/Layout/MainLayout';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function Analytics() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, [user]);

  const fetchTasks = async () => {
    if (!user) return;
    const q = query(collection(db, 'tasks'), where('userId', '==', user.uid));
    const querySnapshot = await getDocs(q);
    const taskList = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setTasks(taskList);
    setLoading(false);
  };

  const priorityData = {
    labels: ['High', 'Medium', 'Low'],
    datasets: [{
      data: [
        tasks.filter(t => t.priority === 'high').length,
        tasks.filter(t => t.priority === 'medium').length,
        tasks.filter(t => t.priority === 'low').length,
      ],
      backgroundColor: [
        'rgba(239, 68, 68, 0.5)',
        'rgba(234, 179, 8, 0.5)',
        'rgba(34, 197, 94, 0.5)',
      ],
      borderColor: [
        'rgb(239, 68, 68)',
        'rgb(234, 179, 8)',
        'rgb(34, 197, 94)',
      ],
      borderWidth: 1,
    }],
  };

  const statusData = {
    labels: ['Completed', 'Pending'],
    datasets: [{
      data: [
        tasks.filter(t => t.completed).length,
        tasks.filter(t => !t.completed).length,
      ],
      backgroundColor: [
        'rgba(34, 197, 94, 0.5)',
        'rgba(100, 116, 139, 0.5)',
      ],
      borderColor: [
        'rgb(34, 197, 94)',
        'rgb(100, 116, 139)',
      ],
      borderWidth: 1,
    }],
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-full">
          <p className="text-gray-500">Loading analytics...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Task Analytics</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Tasks by Priority</h2>
            <div className="h-64">
              <Doughnut
                data={priorityData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Task Status</h2>
            <div className="h-64">
              <Doughnut
                data={statusData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm md:col-span-2">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Task Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-primary-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-primary-900">Total Tasks</h3>
                <p className="text-3xl font-bold text-primary-600">{tasks.length}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-green-900">Completed</h3>
                <p className="text-3xl font-bold text-green-600">
                  {tasks.filter(t => t.completed).length}
                </p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-yellow-900">Pending</h3>
                <p className="text-3xl font-bold text-yellow-600">
                  {tasks.filter(t => !t.completed).length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}