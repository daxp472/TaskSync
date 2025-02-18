import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/config';
import { collection, addDoc, query, where, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import MainLayout from '../components/Layout/MainLayout';
import TaskForm from '../components/Tasks/TaskForm';
import TaskList from '../components/Tasks/TaskList';

export default function Dashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);

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
    setTasks(taskList.sort((a, b) => a.position - b.position));
  };

  const addTask = async (taskData) => {
    try {
      const taskRef = await addDoc(collection(db, 'tasks'), {
        ...taskData,
        completed: false,
        userId: user.uid,
        position: tasks.length,
        createdAt: new Date().toISOString()
      });

      setTasks([...tasks, {
        id: taskRef.id,
        ...taskData,
        completed: false,
        position: tasks.length
      }]);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await deleteDoc(doc(db, 'tasks', taskId));
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const toggleComplete = async (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    try {
      await updateDoc(doc(db, 'tasks', taskId), {
        completed: !task.completed
      });
      setTasks(tasks.map(t => 
        t.id === taskId ? { ...t, completed: !t.completed } : t
      ));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const updatePositions = async (newTasks) => {
    try {
      await Promise.all(newTasks.map((task, index) =>
        updateDoc(doc(db, 'tasks', task.id), { position: index })
      ));
      setTasks(newTasks);
    } catch (error) {
      console.error('Error updating task positions:', error);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Tasks</h1>
        <TaskForm onSubmit={addTask} />
        <TaskList
          tasks={tasks}
          onDelete={deleteTask}
          onToggleComplete={toggleComplete}
          onUpdatePositions={updatePositions}
        />
      </div>
    </MainLayout>
  );
}