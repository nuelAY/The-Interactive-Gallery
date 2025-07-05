'use client';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { logout } from '../store/authSlice';

export default function Navbar() {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-gray-100 shadow">
      <div className="text-xl font-bold">🖼️ Interactive Gallery</div>
      {user && (
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-700">Welcome, {user.name}</span>
          <button
            onClick={() => dispatch(logout())}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
