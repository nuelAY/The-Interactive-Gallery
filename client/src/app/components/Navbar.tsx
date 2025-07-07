'use client';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { logout } from '../store/authSlice';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { LogOut } from 'lucide-react';

export default function Navbar() {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
  };

  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="flex justify-between items-center px-6 py-4 shadow-md border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e1e1e]"
    >
      <div className="text-xl text-center font-bold text-gray-900 dark:text-white">
        🖼️ Interactive Gallery
      </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-300 dark:text-gray-300">
            Welcome, <strong>{user?.name}</strong>
          </span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 px-3 py-1.5 rounded text-sm bg-red-500 hover:bg-red-600 text-white transition"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
    </motion.nav>
  );
}
