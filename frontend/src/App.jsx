import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { UserDashboard } from './pages/UserDashboard';
import { OwnerDashboard } from './pages/OwnerDashboard';

export const App = () => {
  const { user, loading, isAdmin, isNormal, isOwner } = useAuth();
  const [authView, setAuthView] = useState('login'); // 'login' | 'register'

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-semibold text-slate-500">Loading platform...</span>
        </div>
      </div>
    );
  }

  // If not logged in, render Login or Register
  if (!user) {
    if (authView === 'register') {
      return <RegisterPage onNavigateToLogin={() => setAuthView('login')} />;
    }
    return <LoginPage onNavigateToRegister={() => setAuthView('register')} />;
  }

  // If logged in, render according to User Role
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="flex-1 pb-16">
        {isAdmin && <AdminDashboard />}
        {isOwner && <OwnerDashboard />}
        {isNormal && <UserDashboard />}
      </main>
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4">
          <p>© 2026 Store Rating Platform • Built for FullStack Intern Challenge</p>
          <p className="mt-1">Backend: Express.js • Database: PostgreSQL / MySQL / SQLite • Frontend: React.js</p>
        </div>
      </footer>
    </div>
  );
};
