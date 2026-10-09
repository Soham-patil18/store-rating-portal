import React, { useState, useEffect } from 'react';
import {
  Store,
  Star,
  Users,
  MapPin,
  Mail,
  ArrowUpDown,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { api } from '../services/api';
import { StarRating } from '../components/StarRating';

export const OwnerDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Table Sorting
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('DESC');

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.getOwnerDashboard({ sortBy, sortOrder });
      setData(res);
    } catch (err) {
      setError(err.message || 'Failed to load store owner dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [sortBy, sortOrder]);

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortBy(field);
      setSortOrder('ASC');
    }
  };

  if (loading && !data) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-3xl p-8 border border-slate-200/80 animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 rounded-lg w-1/3"></div>
          <div className="h-4 bg-slate-100 rounded-lg w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-3xl p-8 border border-red-200 text-center space-y-3">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <h2 className="text-xl font-bold text-slate-800">Store Not Found</h2>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            {error}. An administrator must assign a store to your account before you can view store metrics.
          </p>
        </div>
      </div>
    );
  }

  const { store, ratings } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Store Header Card */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
            <Store className="w-3.5 h-3.5" />
            <span>Store Owner Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {store.name}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>{store.email}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{store.address}</span>
            </div>
          </div>
        </div>

        {/* Rating Metrics Highlight */}
        <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 self-start md:self-auto">
          <div className="text-right">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Average Rating
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-3xl font-black text-slate-900">
                {store.averageRating.toFixed(1)}
              </span>
              <span className="text-xs text-slate-400 font-semibold">/ 5.0</span>
            </div>
            <StarRating value={store.averageRating} readonly size="sm" />
          </div>

          <div className="w-px h-12 bg-slate-200 mx-2"></div>

          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Total Reviews
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-3xl font-black text-slate-900">
                {store.totalRatings}
              </span>
              <Users className="w-4 h-4 text-slate-400" />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Submitted ratings</p>
          </div>
        </div>
      </div>

      {/* Customer Ratings Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Customer Rating Submissions ({ratings.length})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Detailed breakdown of all users who have submitted ratings for your store
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/60 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
              <tr>
                <th
                  onClick={() => toggleSort('name')}
                  className="px-6 py-4 cursor-pointer hover:text-slate-800 transition select-none"
                >
                  <div className="flex items-center gap-1.5">
                    <span>User Name</span>
                    <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                    {sortBy === 'name' && (
                      <span className="text-[10px] text-amber-600 font-extrabold">{sortOrder}</span>
                    )}
                  </div>
                </th>

                <th
                  onClick={() => toggleSort('email')}
                  className="px-6 py-4 cursor-pointer hover:text-slate-800 transition select-none"
                >
                  <div className="flex items-center gap-1.5">
                    <span>User Email</span>
                    <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                    {sortBy === 'email' && (
                      <span className="text-[10px] text-amber-600 font-extrabold">{sortOrder}</span>
                    )}
                  </div>
                </th>

                <th
                  onClick={() => toggleSort('rating')}
                  className="px-6 py-4 cursor-pointer hover:text-slate-800 transition select-none"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Submitted Rating</span>
                    <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                    {sortBy === 'rating' && (
                      <span className="text-[10px] text-amber-600 font-extrabold">{sortOrder}</span>
                    )}
                  </div>
                </th>

                <th
                  onClick={() => toggleSort('date')}
                  className="px-6 py-4 cursor-pointer hover:text-slate-800 transition select-none"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Submission Date</span>
                    <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                    {sortBy === 'date' && (
                      <span className="text-[10px] text-amber-600 font-extrabold">{sortOrder}</span>
                    )}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ratings.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                    No customers have submitted ratings for your store yet.
                  </td>
                </tr>
              ) : (
                ratings.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      {r.user.name}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {r.user.email}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <StarRating value={r.rating} readonly size="sm" />
                        <span className="font-bold text-slate-800 text-xs">
                          {r.rating} / 5
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{new Date(r.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
