// client/components/ProtectedRoute.tsx
'use client';

import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RootState } from '../store';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push('/'); // Redirect to login if not authenticated
    }
  }, [token, router]);

  // Optionally render a loading spinner while checking
  if (!token) return null;

  return <>{children}</>;
}
