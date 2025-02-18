import { Link, useLocation } from 'react-router-dom';
import { FaTasks, FaCalendarAlt, FaChartBar, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { path: '/', icon: FaTasks, label: 'Tasks' },
    { path: '/calendar', icon: FaCalendarAlt, label: 'Calendar' },
    { path: '/analytics', icon: FaChartBar, label: 'Analytics' },
  ];

  return (
    <div className="w-64 bg-white h-screen fixed left-0 top-0 shadow-lg">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800">TaskSync</h2>
        <p className="text-sm text-gray-600 mt-1">{user?.displayName}</p>
      </div>
      
      <nav className="mt-6">
        {menuItems.map(({ path, icon: Icon, label }) => (
          <Link
            key={path}
            to={path}
            className={`flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 transition-colors ${
              isActive(path) ? 'bg-primary-50 text-primary-600 border-r-4 border-primary-600' : ''
            }`}
          >
            <Icon className="w-5 h-5 mr-3" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="absolute bottom-0 w-full p-6">
        <button
          onClick={logout}
          className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <FaSignOutAlt className="mr-2" />
          Logout
        </button>
      </div>
    </div>
  );
}