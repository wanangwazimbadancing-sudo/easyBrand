import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import SideBar from './nav/SidebarNav';
import MobileBar from './nav/MobileBar';

import FAQ from './pages/FAQ';
import Profile from './pages/Profile';
import Home from './pages/Home';
import MyVideos from './pages/MyVideos';
import BookingFlow from './pages/Booking';
import ContentPlansPage from './pages/admin/ContentPlansPage';
import MessagesPage from './pages/admin/MessagesAdmin';
import BookingsPage from './pages/admin/BookAdmin';
import PagenotFound from './pages/PagenotFound';
import LogInPage from './Auth/LogIn';

const ProtectedRoute = ({ isAdmin, children }) => {
  if (!isAdmin) {
    return <PagenotFound />;
  }

  return children;
};

const App = () => {
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem('happy_zimba_admin') === 'true');

  useEffect(() => {
    const syncAdminState = () => {
      setIsAdmin(localStorage.getItem('happy_zimba_admin') === 'true');
    };

    window.addEventListener('admin-auth-change', syncAdminState);
    return () => window.removeEventListener('admin-auth-change', syncAdminState);
  }, []);

  const handleAdminLogin = () => {
    localStorage.setItem('happy_zimba_admin', 'true');
    localStorage.removeItem('happy_zimba_2fa_code');
    localStorage.removeItem('happy_zimba_2fa_pending');
    setIsAdmin(true);
    window.dispatchEvent(new Event('admin-auth-change'));
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('happy_zimba_admin');
    localStorage.removeItem('happy_zimba_2fa_code');
    localStorage.removeItem('happy_zimba_2fa_pending');
    setIsAdmin(false);
    window.dispatchEvent(new Event('admin-auth-change'));
  };

  return (
    <>
      <div className='fixed flex-col flex md:flex-row-reverse w-[100vw] h-[100dvh] overflow-hidden items-start'>
        <div className='w-full h-full bg-white overflow-y-auto overflow-x-hidden'>
          <Routes>
            <Route index element={<Home />} />
            <Route path="pricing" element={<BookingFlow />} />
            <Route path="content" element={<MyVideos />} />
            <Route path="questions" element={<FAQ />} />
            <Route path="wanangwahappy" element={isAdmin ? <PagenotFound /> : <LogInPage onLogin={handleAdminLogin} />} />
            <Route path="contact" element={<Profile />} />

            <Route
              path="edit"
              element={
                <ProtectedRoute isAdmin={isAdmin}>
                  <ContentPlansPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="messages"
              element={
                <ProtectedRoute isAdmin={isAdmin}>
                  <MessagesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="bookings"
              element={
                <ProtectedRoute isAdmin={isAdmin}>
                  <BookingsPage />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<PagenotFound />} />
          </Routes>
        </div>

        <div>
          <SideBar isAdmin={isAdmin} onLogout={handleAdminLogout} />
          <MobileBar isAdmin={isAdmin} onLogout={handleAdminLogout} />
        </div>
      </div>
    </>
  );
};

export default App;