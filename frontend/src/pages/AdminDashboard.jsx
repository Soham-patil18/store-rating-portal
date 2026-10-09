import React, { useState, useEffect } from 'react';
import {
  Users,
  Store,
  Star,
  Plus,
  Search,
  ArrowUpDown,
  Filter,
  ShieldCheck,
  UserCheck,
  UserPlus,
  Store as StoreIcon,
  X,
  AlertCircle,
  Check,
} from 'lucide-react';
import { api } from '../services/api';
import { StarRating } from '../components/StarRating';

export const AdminDashboard = () => {
  // Tabs: 'stores' | 'users'
  const [activeTab, setActiveTab] = useState('stores');

  // Stats
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });

  // Stores Data & Filters
  const [stores, setStores] = useState([]);
  const [storeFilter, setStoreFilter] = useState({ name: '', email: '', address: '' });
  const [storeSort, setStoreSort] = useState({ sortBy: 'name', sortOrder: 'ASC' });

  // Users Data & Filters
  const [users, setUsers] = useState([]);
  const [userFilter, setUserFilter] = useState({ name: '', email: '', address: '', role: '' });
  const [userSort, setUserSort] = useState({ sortBy: 'name', sortOrder: 'ASC' });

  // Modals
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isAddStoreOpen, setIsAddStoreOpen] = useState(false);

  // Add User Form State
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    role: 'normal',
  });
  const [userFormError, setUserFormError] = useState('');
  const [userFormSuccess, setUserFormSuccess] = useState('');

  // Add Store Form State
  const [newStore, setNewStore] = useState({
    name: '',
    email: '',
    address: '',
    ownerId: '',
  });
  const [storeFormError, setStoreFormError] = useState('');
  const [storeFormSuccess, setStoreFormSuccess] = useState('');

  // Fetch initial stats
  const fetchStats = async () => {
    try {
      const data = await api.getAdminStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    }
  };

  // Fetch Stores
  const fetchStores = async () => {
    try {
      const params = {
        name: storeFilter.name,
        email: storeFilter.email,
        address: storeFilter.address,
        sortBy: storeSort.sortBy,
        sortOrder: storeSort.sortOrder,
      };
      const data = await api.adminGetStores(params);
      setStores(data.stores || []);
    } catch (err) {
      console.error('Failed to load stores:', err);
    }
  };

  // Fetch Users
  const fetchUsers = async () => {
    try {
      const params = {
        name: userFilter.name,
        email: userFilter.email,
        address: userFilter.address,
        role: userFilter.role,
        sortBy: userSort.sortBy,
        sortOrder: userSort.sortOrder,
      };
      const data = await api.adminGetUsers(params);
      setUsers(data.users || []);
    } catch (err) {
      console.error('Failed to load users:', err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchStores();
  }, [storeFilter, storeSort]);

  useEffect(() => {
    fetchUsers();
  }, [userFilter, userSort]);

  // Handle Sort Toggle
  const toggleStoreSort = (field) => {
    setStoreSort((prev) => ({
      sortBy: field,
      sortOrder: prev.sortBy === field && prev.sortOrder === 'ASC' ? 'DESC' : 'ASC',
    }));
  };

  const toggleUserSort = (field) => {
    setUserSort((prev) => ({
      sortBy: field,
      sortOrder: prev.sortBy === field && prev.sortOrder === 'ASC' ? 'DESC' : 'ASC',
    }));
  };

  // Handle Add User
  const handleAddUserSubmit = async (e) => {
    e.preventDefault();
    setUserFormError('');
    setUserFormSuccess('');

    // Validations
    if (newUser.name.trim().length < 20 || newUser.name.trim().length > 60) {
      setUserFormError('Name must be between 20 and 60 characters');
      return;
    }
    if (newUser.address.trim().length > 400) {
      setUserFormError('Address cannot exceed 400 characters');
      return;
    }
    if (newUser.password.length < 8 || newUser.password.length > 16) {
      setUserFormError('Password must be between 8 and 16 characters');
      return;
    }
    if (!/[A-Z]/.test(newUser.password)) {
      setUserFormError('Password must include at least one uppercase letter');
      return;
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newUser.password)) {
      setUserFormError('Password must include at least one special character');
      return;
    }

    try {
      await api.adminAddUser(newUser);
      setUserFormSuccess('User added successfully!');
      fetchUsers();
      fetchStats();
      setTimeout(() => {
        setIsAddUserOpen(false);
        setNewUser({ name: '', email: '', password: '', address: '', role: 'normal' });
        setUserFormSuccess('');
      }, 1200);
    } catch (err) {
      setUserFormError(err.message || 'Failed to add user');
    }
  };

  // Handle Add Store
  const handleAddStoreSubmit = async (e) => {
    e.preventDefault();
    setStoreFormError('');
    setStoreFormSuccess('');

    if (!newStore.name.trim()) {
      setStoreFormError('Store name is required');
      return;
    }
    if (newStore.address.trim().length > 400) {
      setStoreFormError('Address cannot exceed 400 characters');
      return;
    }

    try {
      await api.adminAddStore(newStore);
      setStoreFormSuccess('Store added successfully!');
      fetchStores();
      fetchStats();
      setTimeout(() => {
        setIsAddStoreOpen(false);
        setNewStore({ name: '', email: '', address: '', ownerId: '' });
        setStoreFormSuccess('');
      }, 1200);
    } catch (err) {
      setStoreFormError(err.message || 'Failed to add store');
    }
  };

  const storeOwnersList = users.filter((u) => u.role === 'owner');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Welcome & Actions Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            System Administrator Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage registered stores, platform users, and review real-time platform statistics
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddStoreOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm shadow-blue-500/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Store</span>
          </button>
          <button
            onClick={() => setIsAddUserOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-sm shadow-purple-500/20 transition"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add User</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Users</p>
            <p className="text-3xl font-black text-slate-900 mt-1">{stats.totalUsers}</p>
            <p className="text-xs text-slate-500 mt-1">Admin, Normal, & Store Owners</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Stores</p>
            <p className="text-3xl font-black text-slate-900 mt-1">{stats.totalStores}</p>
            <p className="text-xs text-slate-500 mt-1">Registered retail partners</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Store className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Submitted Ratings</p>
            <p className="text-3xl font-black text-slate-900 mt-1">{stats.totalRatings}</p>
            <p className="text-xs text-slate-500 mt-1">Customer verified reviews (1-5★)</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
            <Star className="w-6 h-6 fill-amber-400" />
          </div>
        </div>
      </div>

      {/* Tabs Controller */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('stores')}
            className={`py-3 px-1 border-b-2 font-bold text-sm flex items-center gap-2 transition ${
              activeTab === 'stores'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Stores Directory ({stores.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`py-3 px-1 border-b-2 font-bold text-sm flex items-center gap-2 transition ${
              activeTab === 'users'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Users & Store Owners ({users.length})</span>
          </button>
        </nav>
      </div>

      {/* Tab 1: STORES TABLE */}
      {activeTab === 'stores' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          {/* Filters Bar */}
          <div className="p-4 bg-slate-50 border-b border-slate-200/80 flex flex-wrap gap-3 items-center">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 mr-2">
              <Filter className="w-4 h-4" />
              <span>Filters:</span>
            </div>

            <div className="relative min-w-[160px] flex-1">
              <input
                type="text"
                placeholder="Filter by Name..."
                value={storeFilter.name}
                onChange={(e) => setStoreFilter({ ...storeFilter, name: e.target.value })}
                className="w-full pl-3 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="relative min-w-[160px] flex-1">
              <input
                type="text"
                placeholder="Filter by Email..."
                value={storeFilter.email}
                onChange={(e) => setStoreFilter({ ...storeFilter, email: e.target.value })}
                className="w-full pl-3 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="relative min-w-[160px] flex-1">
              <input
                type="text"
                placeholder="Filter by Address..."
                value={storeFilter.address}
                onChange={(e) => setStoreFilter({ ...storeFilter, address: e.target.value })}
                className="w-full pl-3 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {(storeFilter.name || storeFilter.email || storeFilter.address) && (
              <button
                onClick={() => setStoreFilter({ name: '', email: '', address: '' })}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold px-2 py-1"
              >
                Reset Filters
              </button>
            )}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50/50 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                <tr>
                  <th
                    onClick={() => toggleStoreSort('name')}
                    className="px-6 py-4 cursor-pointer hover:text-slate-800 transition select-none"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Store Name</span>
                      <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                      {storeSort.sortBy === 'name' && (
                        <span className="text-[10px] text-blue-600 font-extrabold">{storeSort.sortOrder}</span>
                      )}
                    </div>
                  </th>
                  <th
                    onClick={() => toggleStoreSort('email')}
                    className="px-6 py-4 cursor-pointer hover:text-slate-800 transition select-none"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Email</span>
                      <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                      {storeSort.sortBy === 'email' && (
                        <span className="text-[10px] text-blue-600 font-extrabold">{storeSort.sortOrder}</span>
                      )}
                    </div>
                  </th>
                  <th
                    onClick={() => toggleStoreSort('address')}
                    className="px-6 py-4 cursor-pointer hover:text-slate-800 transition select-none"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Address</span>
                      <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                      {storeSort.sortBy === 'address' && (
                        <span className="text-[10px] text-blue-600 font-extrabold">{storeSort.sortOrder}</span>
                      )}
                    </div>
                  </th>
                  <th
                    onClick={() => toggleStoreSort('rating')}
                    className="px-6 py-4 cursor-pointer hover:text-slate-800 transition select-none"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Overall Rating</span>
                      <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                      {storeSort.sortBy === 'rating' && (
                        <span className="text-[10px] text-blue-600 font-extrabold">{storeSort.sortOrder}</span>
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-4">Assigned Owner</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stores.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                      No stores found matching the filters
                    </td>
                  </tr>
                ) : (
                  stores.map((store) => (
                    <tr key={store.id} className="hover:bg-slate-50/70 transition">
                      <td className="px-6 py-4 font-semibold text-slate-900">{store.name}</td>
                      <td className="px-6 py-4 text-slate-600">{store.email}</td>
                      <td className="px-6 py-4 text-slate-600 max-w-xs truncate" title={store.address}>
                        {store.address}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <StarRating value={store.rating} readonly size="sm" />
                          <span className="font-bold text-slate-800">
                            {store.rating ? store.rating.toFixed(1) : '0.0'}
                          </span>
                          <span className="text-xs text-slate-400">({store.totalRatings} ratings)</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-slate-600">
                        {store.owner ? store.owner.name : <span className="text-slate-400 italic">None assigned</span>}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: USERS TABLE */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          {/* Filters Bar */}
          <div className="p-4 bg-slate-50 border-b border-slate-200/80 flex flex-wrap gap-3 items-center">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 mr-2">
              <Filter className="w-4 h-4" />
              <span>Filters:</span>
            </div>

            <div className="relative min-w-[140px] flex-1">
              <input
                type="text"
                placeholder="Filter by Name..."
                value={userFilter.name}
                onChange={(e) => setUserFilter({ ...userFilter, name: e.target.value })}
                className="w-full pl-3 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>

            <div className="relative min-w-[140px] flex-1">
              <input
                type="text"
                placeholder="Filter by Email..."
                value={userFilter.email}
                onChange={(e) => setUserFilter({ ...userFilter, email: e.target.value })}
                className="w-full pl-3 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>

            <div className="relative min-w-[140px] flex-1">
              <input
                type="text"
                placeholder="Filter by Address..."
                value={userFilter.address}
                onChange={(e) => setUserFilter({ ...userFilter, address: e.target.value })}
                className="w-full pl-3 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>

            <div className="min-w-[130px]">
              <select
                value={userFilter.role}
                onChange={(e) => setUserFilter({ ...userFilter, role: e.target.value })}
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500"
              >
                <option value="">All Roles</option>
                <option value="admin">System Administrator</option>
                <option value="normal">Normal User</option>
                <option value="owner">Store Owner</option>
              </select>
            </div>

            {(userFilter.name || userFilter.email || userFilter.address || userFilter.role) && (
              <button
                onClick={() => setUserFilter({ name: '', email: '', address: '', role: '' })}
                className="text-xs text-purple-600 hover:text-purple-800 font-semibold px-2 py-1"
              >
                Reset Filters
              </button>
            )}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50/50 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                <tr>
                  <th
                    onClick={() => toggleUserSort('name')}
                    className="px-6 py-4 cursor-pointer hover:text-slate-800 transition select-none"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Name</span>
                      <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                      {userSort.sortBy === 'name' && (
                        <span className="text-[10px] text-purple-600 font-extrabold">{userSort.sortOrder}</span>
                      )}
                    </div>
                  </th>
                  <th
                    onClick={() => toggleUserSort('email')}
                    className="px-6 py-4 cursor-pointer hover:text-slate-800 transition select-none"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Email</span>
                      <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                      {userSort.sortBy === 'email' && (
                        <span className="text-[10px] text-purple-600 font-extrabold">{userSort.sortOrder}</span>
                      )}
                    </div>
                  </th>
                  <th
                    onClick={() => toggleUserSort('address')}
                    className="px-6 py-4 cursor-pointer hover:text-slate-800 transition select-none"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Address</span>
                      <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                      {userSort.sortBy === 'address' && (
                        <span className="text-[10px] text-purple-600 font-extrabold">{userSort.sortOrder}</span>
                      )}
                    </div>
                  </th>
                  <th
                    onClick={() => toggleUserSort('role')}
                    className="px-6 py-4 cursor-pointer hover:text-slate-800 transition select-none"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Role</span>
                      <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                      {userSort.sortBy === 'role' && (
                        <span className="text-[10px] text-purple-600 font-extrabold">{userSort.sortOrder}</span>
                      )}
                    </div>
                  </th>
                  <th
                    onClick={() => toggleUserSort('rating')}
                    className="px-6 py-4 cursor-pointer hover:text-slate-800 transition select-none"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Store Owner Rating</span>
                      <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                      {userSort.sortBy === 'rating' && (
                        <span className="text-[10px] text-purple-600 font-extrabold">{userSort.sortOrder}</span>
                      )}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                      No users found matching the filters
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/70 transition">
                      <td className="px-6 py-4 font-semibold text-slate-900">{u.name}</td>
                      <td className="px-6 py-4 text-slate-600">{u.email}</td>
                      <td className="px-6 py-4 text-slate-600 max-w-xs truncate" title={u.address}>
                        {u.address}
                      </td>
                      <td className="px-6 py-4">
                        {u.role === 'admin' && (
                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                            Admin
                          </span>
                        )}
                        {u.role === 'owner' && (
                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
                            Store Owner
                          </span>
                        )}
                        {u.role === 'normal' && (
                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                            Normal User
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {u.role === 'owner' ? (
                          u.storeRating !== null ? (
                            <div className="flex items-center gap-1.5">
                              <StarRating value={u.storeRating} readonly size="sm" />
                              <span className="font-bold text-slate-800 text-xs">
                                {u.storeRating.toFixed(1)}★
                              </span>
                              <span className="text-[11px] text-slate-400">({u.storeName})</span>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400 italic">No store assigned</span>
                          )
                        ) : (
                          <span className="text-xs text-slate-300">—</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: ADD STORE */}
      {isAddStoreOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-100">
              <div className="flex items-center gap-2 font-semibold text-slate-800">
                <StoreIcon className="w-5 h-5 text-blue-600" />
                <span>Add New Store</span>
              </div>
              <button
                onClick={() => setIsAddStoreOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddStoreSubmit} className="p-6 space-y-4">
              {storeFormError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                  <span>{storeFormError}</span>
                </div>
              )}
              {storeFormSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 flex items-start gap-2">
                  <Check className="w-4 h-4 shrink-0 text-emerald-500" />
                  <span>{storeFormSuccess}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                  Store Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sunset Boulevard Bakery (max 60 chars)"
                  value={newStore.name}
                  onChange={(e) => setNewStore({ ...newStore, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                  Store Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="store@example.com"
                  value={newStore.email}
                  onChange={(e) => setNewStore({ ...newStore, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                  Store Address
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Store location address (max 400 chars)"
                  value={newStore.address}
                  onChange={(e) => setNewStore({ ...newStore, address: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                  Assign Store Owner (Optional)
                </label>
                <select
                  value={newStore.ownerId}
                  onChange={(e) => setNewStore({ ...newStore, ownerId: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-white"
                >
                  <option value="">-- No Owner Assigned Yet --</option>
                  {storeOwnersList.map((owner) => (
                    <option key={owner.id} value={owner.id}>
                      {owner.name} ({owner.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddStoreOpen(false)}
                  className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm"
                >
                  Create Store
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD USER */}
      {isAddUserOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-100">
              <div className="flex items-center gap-2 font-semibold text-slate-800">
                <UserPlus className="w-5 h-5 text-purple-600" />
                <span>Add New User</span>
              </div>
              <button
                onClick={() => setIsAddUserOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddUserSubmit} className="p-6 space-y-4">
              {userFormError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                  <span>{userFormError}</span>
                </div>
              )}
              {userFormSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 flex items-start gap-2">
                  <Check className="w-4 h-4 shrink-0 text-emerald-500" />
                  <span>{userFormSuccess}</span>
                </div>
              )}

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-slate-600 uppercase">
                    Full Name
                  </label>
                  <span className="text-[11px] text-slate-400">20-60 chars</span>
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. Christopher Alexander Davis Senior"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="user@example.com"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                  Role
                </label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 bg-white"
                >
                  <option value="normal">Normal User</option>
                  <option value="owner">Store Owner</option>
                  <option value="admin">System Administrator</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="8-16 chars, 1 uppercase, 1 special symbol"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                  Address
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Address (max 400 chars)"
                  value={newUser.address}
                  onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddUserOpen(false)}
                  className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-sm"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
