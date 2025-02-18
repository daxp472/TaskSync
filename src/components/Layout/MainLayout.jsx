import Sidebar from './Sidebar';
import ThemeToggle from './ThemeToggle';

export default function MainLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-end mb-6">
            <ThemeToggle />
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}