import React, { useState, useEffect } from 'react';
import {
  Search,
  MapPin,
  Star,
  Sparkles,
  Check,
  AlertCircle,
  Building,
  Edit3,
} from 'lucide-react';
import { api } from '../services/api';
import { StarRating } from '../components/StarRating';

export const UserDashboard = () => {
  const [stores, setStores] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [ratingLoading, setRatingLoading] = useState(null);
  const [successToast, setSuccessToast] = useState('');
  const [errorToast, setErrorToast] = useState('');

  // Selected store for modal rating submission/modification
  const [activeStoreToRate, setActiveStoreToRate] = useState(null);
  const [selectedScore, setSelectedScore] = useState(5);

  const fetchStores = async () => {
    try {
      setLoading(true);
      const data = await api.getStores({ search: searchTerm });
      setStores(data.stores || []);
    } catch (err) {
      console.error('Error fetching stores:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchStores();
    }, 250);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const handleRateSubmit = async (storeId, score) => {
    try {
      setRatingLoading(storeId);
      setErrorToast('');
      setSuccessToast('');

      const res = await api.submitRating(storeId, score);

      // Update store in state
      setStores((prev) =>
        prev.map((s) => {
          if (s.id === storeId) {
            return {
              ...s,
              overallRating: res.overallRating,
              totalRatings: res.totalRatings,
              userRating: res.rating,
            };
          }
          return s;
        })
      );

      setSuccessToast(res.message || 'Rating submitted successfully!');
      setActiveStoreToRate(null);
      setTimeout(() => setSuccessToast(''), 3000);
    } catch (err) {
      setErrorToast(err.message || 'Failed to submit rating');
      setTimeout(() => setErrorToast(''), 3000);
    } finally {
      setRatingLoading(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Search Section */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 rounded-3xl p-8 sm:p-10 text-white shadow-xl shadow-blue-500/10">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Customer Rating Portal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
            Discover & Rate Registered Stores
          </h1>
          <p className="text-blue-100 text-sm sm:text-base mt-2">
            Browse verified stores, share your genuine feedback (1 to 5 stars), and modify your ratings at any time.
          </p>

          {/* Search Box by Name and Address */}
          <div className="mt-6 flex items-center bg-white rounded-2xl p-1.5 shadow-lg max-w-xl text-slate-800">
            <Search className="w-5 h-5 text-slate-400 ml-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search stores by name or address..."
              className="w-full px-3 py-2 text-sm bg-transparent border-none focus:outline-none"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="text-xs text-slate-400 hover:text-slate-600 px-2 font-medium"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Toast notifications */}
      {successToast && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-sm text-emerald-800 animate-fade-in shadow-sm">
          <Check className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-medium">{successToast}</span>
        </div>
      )}

      {errorToast && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-sm text-red-800 animate-fade-in shadow-sm">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span className="font-medium">{errorToast}</span>
        </div>
      )}

      {/* Stores Directory Listing */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">
            Registered Stores ({stores.length})
          </h2>
          {searchTerm && (
            <p className="text-xs text-slate-500">
              Showing search results for "<span className="font-semibold text-slate-700">{searchTerm}</span>"
            </p>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm animate-pulse h-52" />
            ))}
          </div>
        ) : stores.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80">
            <Building className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-700">No stores found</h3>
            <p className="text-xs text-slate-500 mt-1">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map((store) => {
              const hasRated = store.userRating !== null && store.userRating !== undefined;

              return (
                <div
                  key={store.id}
                  className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-bold text-slate-900 text-lg leading-snug">
                        {store.name}
                      </h3>
                      <div className="shrink-0 flex items-center gap-1 bg-amber-50 border border-amber-200/80 px-2 py-1 rounded-xl">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-xs font-bold text-amber-900">
                          {store.overallRating ? store.overallRating.toFixed(1) : '0.0'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 text-xs text-slate-500">
                      <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-slate-400" />
                      <p className="line-clamp-2">{store.address}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs text-slate-400 font-medium">
                        {store.totalRatings} customer rating{store.totalRatings === 1 ? '' : 's'}
                      </span>
                      <StarRating value={store.overallRating} readonly size="sm" />
                    </div>
                  </div>

                  {/* User's Submitted Rating & Action */}
                  <div className="mt-5 pt-4 border-t border-slate-100 bg-slate-50/70 -mx-6 -mb-6 p-5 rounded-b-2xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          Your Rating
                        </span>
                        {hasRated ? (
                          <div className="flex items-center gap-1.5 mt-1">
                            <div className="flex items-center text-amber-500">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star
                                  key={s}
                                  className={`w-3.5 h-3.5 ${
                                    s <= store.userRating
                                      ? 'fill-amber-400 text-amber-400'
                                      : 'fill-slate-200 text-slate-200'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs font-bold text-slate-800">
                              {store.userRating} / 5
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 italic mt-0.5 block">
                            Not rated yet
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => {
                          setActiveStoreToRate(store);
                          setSelectedScore(store.userRating || 5);
                        }}
                        disabled={ratingLoading === store.id}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition ${
                          hasRated
                            ? 'text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200'
                            : 'text-white bg-blue-600 hover:bg-blue-700 shadow-xs'
                        }`}
                      >
                        {hasRated ? (
                          <>
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Modify Rating</span>
                          </>
                        ) : (
                          <>
                            <Star className="w-3.5 h-3.5 fill-white" />
                            <span>Submit Rating</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* RATING MODAL (Submit / Modify 1 to 5) */}
      {activeStoreToRate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl border border-slate-100 p-6 text-center space-y-5">
            <div>
              <span className="inline-block px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 mb-2">
                {activeStoreToRate.userRating ? 'Modify Your Rating' : 'Submit Rating'}
              </span>
              <h3 className="text-lg font-black text-slate-900 leading-snug">
                {activeStoreToRate.name}
              </h3>
              <p className="text-xs text-slate-500 mt-1 truncate">
                {activeStoreToRate.address}
              </p>
            </div>

            <div className="py-2">
              <p className="text-xs font-semibold text-slate-600 mb-2">
                Select your rating score (1 to 5 stars):
              </p>
              <div className="flex justify-center">
                <StarRating
                  value={selectedScore}
                  onChange={(val) => setSelectedScore(val)}
                  size="lg"
                />
              </div>
              <p className="text-sm font-bold text-amber-500 mt-2">
                {selectedScore} Star{selectedScore > 1 ? 's' : ''}
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setActiveStoreToRate(null)}
                className="flex-1 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleRateSubmit(activeStoreToRate.id, selectedScore)}
                disabled={ratingLoading === activeStoreToRate.id}
                className="flex-1 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20"
              >
                {ratingLoading === activeStoreToRate.id ? 'Saving...' : 'Confirm Rating'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
