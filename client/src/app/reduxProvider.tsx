'use client';

import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
// import { loadUserFromStorage } from './store/authSlice';
import { useAppDispatch } from './store/hooks';
import { Toaster } from 'react-hot-toast';

export default function ReduxWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      {/* <Init /> */}
      <Toaster position="top-right" />
      {children}
    </Provider>
  );
}

// function Init() {
//   const dispatch = useAppDispatch();

//   useEffect(() => {
//     dispatch(loadUserFromStorage());
//   }, [dispatch]);

//   return null;
// }
