import React, { useState } from 'react';
import { Star, LogOut, KeyRound, User as UserIcon, ShieldCheck, Store as StoreIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ChangePasswordModal } from './ChangePasswordModal';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 border border-purple-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            System Administrator
          </span>
        );
      case 'owner':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 border border-amber-200">
            <StoreIcon className="w-3.5 h-3.5" />
            Store Owner
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">
            <UserIcon className="w-3.5 h-3.5" />
            Normal User
          </span>
        );
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Star className="w-5 h-5 fill-white" />
            </div>
            <div>
              <span className="text-lg font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Store Rating Platform
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                Intern Challenge
              </span>
            </div>
          </div>

          {/* User profile & actions */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-semibold text-slate-800 max-w-[200px] truncate" title={user?.name}>
                {user?.name}
              </span>
              <div className="mt-0.5">
                {getRoleBadge(user?.role)}
              </div>
            </div>

            {/* Change Password button (for normal users and store owners) */}
            <button
              onClick={() => setIsPasswordModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
              title="Change Password"
            >
              <KeyRound className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">Change Password</span>
            </button>

            {/* Logout button */}
            <button
              onClick={logout}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-100 rounded-lg transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </>
  );
};
