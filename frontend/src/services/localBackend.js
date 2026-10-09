// Robust client-side persistent database for Vercel / Cloud / Mobile deployment
// Stores state in localStorage with full schema relationships and pre-seeded demo data

const STORAGE_KEYS = {
  USERS: 'srp_users_v1',
  STORES: 'srp_stores_v1',
  RATINGS: 'srp_ratings_v1',
  CURRENT_USER: 'srp_current_user_v1',
};

// Initial realistic seed data matching PDF specifications
const SEED_USERS = [
  {
    id: 'u-admin-1',
    name: 'System Administrator User Account', // 33 chars
    email: 'admin@storerating.com',
    password: 'Admin@123',
    address: 'Suite 100, 742 Evergreen Terrace, Springfield, OR',
    role: 'admin',
    createdAt: '2026-01-15T08:00:00Z',
  },
  {
    id: 'u-owner-1',
    name: 'Michael Christopher Davies III', // 32 chars
    email: 'michael.davies@stores.com',
    password: 'Owner@123',
    address: '450 North Michigan Avenue, Chicago, IL 60611',
    role: 'owner',
    createdAt: '2026-01-20T09:30:00Z',
  },
  {
    id: 'u-owner-2',
    name: 'Katherine Elizabeth Smith Watson', // 33 chars
    email: 'katherine.smith@stores.com',
    password: 'Owner@123',
    address: '880 Market Street, San Francisco, CA 94102',
    role: 'owner',
    createdAt: '2026-02-01T10:15:00Z',
  },
  {
    id: 'u-normal-1',
    name: 'Johnathan Alexander Doe Senior', // 31 chars
    email: 'johnathan.doe@example.com',
    password: 'User@123',
    address: '123 Pleasant Valley Road, Austin, TX 78701',
    role: 'normal',
    createdAt: '2026-02-10T11:20:00Z',
  },
  {
    id: 'u-normal-2',
    name: 'Eleanor Samantha Vance Johnson', // 32 chars
    email: 'eleanor.vance@example.com',
    password: 'User@123',
    address: '567 Maple Blossom Avenue, Seattle, WA 98101',
    role: 'normal',
    createdAt: '2026-02-15T14:40:00Z',
  },
  {
    id: 'u-normal-3',
    name: 'Robert Benjamin Franklin Junior', // 32 chars
    email: 'robert.franklin@example.com',
    password: 'User@123',
    address: '789 Chestnut Ridge Blvd, Denver, CO 80202',
    role: 'normal',
    createdAt: '2026-02-20T16:05:00Z',
  },
];

const SEED_STORES = [
  {
    id: 's-store-1',
    name: 'Artisan Coffee Roasters & Bakery',
    email: 'contact@artisancoffee.com',
    address: '450 North Michigan Avenue, Chicago, IL 60611',
    ownerId: 'u-owner-1',
    createdAt: '2026-01-21T10:00:00Z',
  },
  {
    id: 's-store-2',
    name: 'Bay Area Organic Grocery Mart',
    email: 'hello@bayareagrocery.com',
    address: '880 Market Street, San Francisco, CA 94102',
    ownerId: 'u-owner-2',
    createdAt: '2026-02-02T11:00:00Z',
  },
  {
    id: 's-store-3',
    name: 'Downtown Tech Gadgets & Books',
    email: 'support@downtowntech.com',
    address: '1010 Silicon Boulevard, San Jose, CA 95110',
    ownerId: null,
    createdAt: '2026-02-05T12:00:00Z',
  },
];

const SEED_RATINGS = [
  {
    id: 'r-1',
    userId: 'u-normal-1',
    storeId: 's-store-1',
    rating: 5,
    createdAt: '2026-02-11T12:00:00Z',
    updatedAt: '2026-02-11T12:00:00Z',
  },
  {
    id: 'r-2',
    userId: 'u-normal-1',
    storeId: 's-store-2',
    rating: 4,
    createdAt: '2026-02-12T13:00:00Z',
    updatedAt: '2026-02-12T13:00:00Z',
  },
  {
    id: 'r-3',
    userId: 'u-normal-2',
    storeId: 's-store-1',
    rating: 4,
    createdAt: '2026-02-16T15:00:00Z',
    updatedAt: '2026-02-16T15:00:00Z',
  },
  {
    id: 'r-4',
    userId: 'u-normal-2',
    storeId: 's-store-2',
    rating: 5,
    createdAt: '2026-02-17T16:00:00Z',
    updatedAt: '2026-02-17T16:00:00Z',
  },
  {
    id: 'r-5',
    userId: 'u-normal-2',
    storeId: 's-store-3',
    rating: 3,
    createdAt: '2026-02-18T17:00:00Z',
    updatedAt: '2026-02-18T17:00:00Z',
  },
  {
    id: 'r-6',
    userId: 'u-normal-3',
    storeId: 's-store-1',
    rating: 5,
    createdAt: '2026-02-21T18:00:00Z',
    updatedAt: '2026-02-21T18:00:00Z',
  },
];

// Helper: initialize storage
const initStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(SEED_USERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.STORES)) {
    localStorage.setItem(STORAGE_KEYS.STORES, JSON.stringify(SEED_STORES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.RATINGS)) {
    localStorage.setItem(STORAGE_KEYS.RATINGS, JSON.stringify(SEED_RATINGS));
  }
};

const getUsers = () => {
  initStorage();
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || [];
  } catch {
    return SEED_USERS;
  }
};

const saveUsers = (users) => {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

const getStores = () => {
  initStorage();
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.STORES)) || [];
  } catch {
    return SEED_STORES;
  }
};

const saveStores = (stores) => {
  localStorage.setItem(STORAGE_KEYS.STORES, JSON.stringify(stores));
};

const getRatings = () => {
  initStorage();
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.RATINGS)) || [];
  } catch {
    return SEED_RATINGS;
  }
};

const saveRatings = (ratings) => {
  localStorage.setItem(STORAGE_KEYS.RATINGS, JSON.stringify(ratings));
};

const getCurrentUser = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  const users = getUsers();
  return users.find((u) => u.id === token) || null;
};

// Form Validations Matching PDF Specification Exactly
export const validateName = (name) => {
  if (!name || typeof name !== 'string') return { valid: false, message: 'Name is required' };
  const trimmed = name.trim();
  if (trimmed.length < 20 || trimmed.length > 60) {
    return { valid: false, message: 'Name must be between 20 and 60 characters' };
  }
  return { valid: true };
};

export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') return { valid: false, message: 'Email is required' };
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email.trim())) {
    return { valid: false, message: 'Please provide a valid email address' };
  }
  return { valid: true };
};

export const validatePassword = (password) => {
  if (!password || typeof password !== 'string') return { valid: false, message: 'Password is required' };
  if (password.length < 8 || password.length > 16) {
    return { valid: false, message: 'Password must be between 8 and 16 characters' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must include at least one uppercase letter' };
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return { valid: false, message: 'Password must include at least one special character' };
  }
  return { valid: true };
};

export const validateAddress = (address) => {
  if (!address || typeof address !== 'string') return { valid: false, message: 'Address is required' };
  if (address.trim().length > 400) {
    return { valid: false, message: 'Address must not exceed 400 characters' };
  }
  return { valid: true };
};

export const validateRating = (rating) => {
  const num = Number(rating);
  if (!Number.isInteger(num) || num < 1 || num > 5) {
    return { valid: false, message: 'Rating must be an integer between 1 and 5' };
  }
  return { valid: true };
};

// Local Backend Engine
export const localBackend = {
  // Login
  login: async ({ email, password }) => {
    initStorage();
    const users = getUsers();
    const user = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());

    if (!user || user.password !== password) {
      throw new Error('Invalid email or password');
    }

    const stores = getStores();
    const ownedStore = stores.find((s) => s.ownerId === user.id) || null;

    // Use user.id as token
    return {
      message: 'Login successful',
      token: user.id,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role,
        ownedStore,
      },
    };
  },

  // Register Normal User
  register: async ({ name, email, password, address }) => {
    initStorage();
    const nameCheck = validateName(name);
    if (!nameCheck.valid) throw new Error(nameCheck.message);

    const emailCheck = validateEmail(email);
    if (!emailCheck.valid) throw new Error(emailCheck.message);

    const passwordCheck = validatePassword(password);
    if (!passwordCheck.valid) throw new Error(passwordCheck.message);

    const addressCheck = validateAddress(address);
    if (!addressCheck.valid) throw new Error(addressCheck.message);

    const users = getUsers();
    if (users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())) {
      throw new Error('A user with this email address already exists');
    }

    const newUser = {
      id: `u-${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      address: address.trim(),
      role: 'normal',
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveUsers(users);

    return {
      message: 'Registration successful',
      token: newUser.id,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        address: newUser.address,
        role: newUser.role,
      },
    };
  },

  // Get current user profile
  getMe: async () => {
    const user = getCurrentUser();
    if (!user) throw new Error('Not authenticated');

    const stores = getStores();
    const ownedStore = stores.find((s) => s.ownerId === user.id) || null;

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role,
        ownedStore,
      },
    };
  },

  // Update Password
  updatePassword: async ({ currentPassword, newPassword }) => {
    const user = getCurrentUser();
    if (!user) throw new Error('Not authenticated');

    if (user.password !== currentPassword) {
      throw new Error('Current password is incorrect');
    }

    const pwCheck = validatePassword(newPassword);
    if (!pwCheck.valid) throw new Error(pwCheck.message);

    const users = getUsers();
    const idx = users.findIndex((u) => u.id === user.id);
    if (idx !== -1) {
      users[idx].password = newPassword;
      saveUsers(users);
    }

    return { message: 'Password updated successfully' };
  },

  // Get Stores for Normal Users / Public
  getStores: async ({ search = '', sortBy = 'name', sortOrder = 'ASC' } = {}) => {
    initStorage();
    const user = getCurrentUser();
    const stores = getStores();
    const ratings = getRatings();

    let filtered = stores;
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      filtered = stores.filter(
        (s) => s.name.toLowerCase().includes(q) || s.address.toLowerCase().includes(q)
      );
    }

    const formatted = filtered.map((store) => {
      const storeRatings = ratings.filter((r) => r.storeId === store.id);
      const totalRatings = storeRatings.length;
      const overallRating =
        totalRatings > 0
          ? Number((storeRatings.reduce((acc, r) => acc + r.rating, 0) / totalRatings).toFixed(1))
          : 0;

      let userRating = null;
      if (user) {
        const found = storeRatings.find((r) => r.userId === user.id);
        if (found) userRating = found.rating;
      }

      return {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        ownerId: store.ownerId,
        overallRating,
        totalRatings,
        userRating,
        createdAt: store.createdAt,
      };
    });

    const order = sortOrder.toUpperCase() === 'DESC' ? -1 : 1;
    formatted.sort((a, b) => {
      if (sortBy === 'rating' || sortBy === 'overallRating') {
        return (a.overallRating - b.overallRating) * order;
      }
      if (sortBy === 'address') {
        return a.address.localeCompare(b.address) * order;
      }
      return a.name.localeCompare(b.name) * order;
    });

    return { stores: formatted };
  },

  // Submit or modify rating (1 to 5)
  submitRating: async (storeId, score) => {
    const user = getCurrentUser();
    if (!user) throw new Error('Must be logged in to submit a rating');

    const scoreCheck = validateRating(score);
    if (!scoreCheck.valid) throw new Error(scoreCheck.message);

    const ratings = getRatings();
    const existingIndex = ratings.findIndex((r) => r.userId === user.id && r.storeId === storeId);

    let isModified = false;
    if (existingIndex !== -1) {
      ratings[existingIndex].rating = Number(score);
      ratings[existingIndex].updatedAt = new Date().toISOString();
      isModified = true;
    } else {
      ratings.push({
        id: `r-${Date.now()}`,
        userId: user.id,
        storeId,
        rating: Number(score),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    saveRatings(ratings);

    // Calculate updated metrics
    const storeRatings = ratings.filter((r) => r.storeId === storeId);
    const totalRatings = storeRatings.length;
    const overallRating = Number(
      (storeRatings.reduce((acc, r) => acc + r.rating, 0) / totalRatings).toFixed(1)
    );

    return {
      message: isModified ? 'Rating updated successfully' : 'Rating submitted successfully',
      rating: Number(score),
      overallRating,
      totalRatings,
    };
  },

  // Store Owner Dashboard
  getOwnerDashboard: async ({ sortBy = 'date', sortOrder = 'DESC' } = {}) => {
    const user = getCurrentUser();
    if (!user || user.role !== 'owner') {
      throw new Error('Unauthorized: Store owner access required');
    }

    const stores = getStores();
    const store = stores.find((s) => s.ownerId === user.id);
    if (!store) {
      throw new Error('No store found assigned to your account');
    }

    const ratings = getRatings();
    const users = getUsers();

    const storeRatings = ratings.filter((r) => r.storeId === store.id);
    const ratingsList = storeRatings.map((r) => {
      const u = users.find((usr) => usr.id === r.userId);
      return {
        id: r.id,
        rating: r.rating,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
        user: u
          ? { id: u.id, name: u.name, email: u.email, address: u.address }
          : { name: 'Customer User', email: 'customer@example.com' },
      };
    });

    const totalRatings = ratingsList.length;
    const averageRating =
      totalRatings > 0
        ? Number((ratingsList.reduce((acc, r) => acc + r.rating, 0) / totalRatings).toFixed(1))
        : 0;

    const order = sortOrder.toUpperCase() === 'ASC' ? 1 : -1;
    ratingsList.sort((a, b) => {
      if (sortBy === 'rating') return (a.rating - b.rating) * order;
      if (sortBy === 'name') return (a.user.name || '').localeCompare(b.user.name || '') * order;
      if (sortBy === 'email') return (a.user.email || '').localeCompare(b.user.email || '') * order;
      return (new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()) * order;
    });

    return {
      store: {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        averageRating,
        totalRatings,
      },
      ratings: ratingsList,
    };
  },

  // Admin Dashboard Stats
  getAdminStats: async () => {
    initStorage();
    const users = getUsers();
    const stores = getStores();
    const ratings = getRatings();

    return {
      totalUsers: users.length,
      totalStores: stores.length,
      totalRatings: ratings.length,
    };
  },

  // Admin Add User
  adminAddUser: async ({ name, email, password, address, role }) => {
    const nameCheck = validateName(name);
    if (!nameCheck.valid) throw new Error(nameCheck.message);

    const emailCheck = validateEmail(email);
    if (!emailCheck.valid) throw new Error(emailCheck.message);

    const passwordCheck = validatePassword(password);
    if (!passwordCheck.valid) throw new Error(passwordCheck.message);

    const addressCheck = validateAddress(address);
    if (!addressCheck.valid) throw new Error(addressCheck.message);

    const users = getUsers();
    if (users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())) {
      throw new Error('A user with this email address already exists');
    }

    const newUser = {
      id: `u-${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      address: address.trim(),
      role: role || 'normal',
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveUsers(users);

    return {
      message: 'User created successfully',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        address: newUser.address,
        role: newUser.role,
      },
    };
  },

  // Admin Add Store
  adminAddStore: async ({ name, email, address, ownerId }) => {
    if (!name || !name.trim()) throw new Error('Store name is required');
    if (address && address.trim().length > 400) throw new Error('Address cannot exceed 400 characters');

    const emailCheck = validateEmail(email);
    if (!emailCheck.valid) throw new Error(emailCheck.message);

    const stores = getStores();
    if (stores.some((s) => s.email.toLowerCase() === email.trim().toLowerCase())) {
      throw new Error('A store with this email address already exists');
    }

    const newStore = {
      id: `s-${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      address: address ? address.trim() : '',
      ownerId: ownerId || null,
      createdAt: new Date().toISOString(),
    };

    stores.push(newStore);
    saveStores(stores);

    return {
      message: 'Store created successfully',
      store: newStore,
    };
  },

  // Admin Get Users with Filtering, Sorting & Store Owner Rating
  adminGetUsers: async ({ name = '', email = '', address = '', role = '', sortBy = 'name', sortOrder = 'ASC' } = {}) => {
    initStorage();
    const users = getUsers();
    const stores = getStores();
    const ratings = getRatings();

    let filtered = users;
    if (name && name.trim()) {
      filtered = filtered.filter((u) => u.name.toLowerCase().includes(name.trim().toLowerCase()));
    }
    if (email && email.trim()) {
      filtered = filtered.filter((u) => u.email.toLowerCase().includes(email.trim().toLowerCase()));
    }
    if (address && address.trim()) {
      filtered = filtered.filter((u) => u.address.toLowerCase().includes(address.trim().toLowerCase()));
    }
    if (role && role.trim()) {
      filtered = filtered.filter((u) => u.role === role.trim());
    }

    const formatted = filtered.map((u) => {
      let storeRating = null;
      let storeName = null;
      if (u.role === 'owner') {
        const owned = stores.find((s) => s.ownerId === u.id);
        if (owned) {
          storeName = owned.name;
          const storeRatings = ratings.filter((r) => r.storeId === owned.id);
          storeRating =
            storeRatings.length > 0
              ? Number((storeRatings.reduce((acc, r) => acc + r.rating, 0) / storeRatings.length).toFixed(1))
              : 0;
        }
      }

      return {
        id: u.id,
        name: u.name,
        email: u.email,
        address: u.address,
        role: u.role,
        createdAt: u.createdAt,
        storeRating,
        storeName,
      };
    });

    const order = sortOrder.toUpperCase() === 'DESC' ? -1 : 1;
    formatted.sort((a, b) => {
      if (sortBy === 'role') return a.role.localeCompare(b.role) * order;
      if (sortBy === 'email') return a.email.localeCompare(b.email) * order;
      if (sortBy === 'address') return a.address.localeCompare(b.address) * order;
      if (sortBy === 'rating' || sortBy === 'storeRating') {
        const rA = a.storeRating ?? -1;
        const rB = b.storeRating ?? -1;
        return (rA - rB) * order;
      }
      return a.name.localeCompare(b.name) * order;
    });

    return { users: formatted };
  },

  // Admin Get Stores with Filtering, Sorting & Average Rating
  adminGetStores: async ({ name = '', email = '', address = '', sortBy = 'name', sortOrder = 'ASC' } = {}) => {
    initStorage();
    const stores = getStores();
    const users = getUsers();
    const ratings = getRatings();

    let filtered = stores;
    if (name && name.trim()) {
      filtered = filtered.filter((s) => s.name.toLowerCase().includes(name.trim().toLowerCase()));
    }
    if (email && email.trim()) {
      filtered = filtered.filter((s) => s.email.toLowerCase().includes(email.trim().toLowerCase()));
    }
    if (address && address.trim()) {
      filtered = filtered.filter((s) => s.address.toLowerCase().includes(address.trim().toLowerCase()));
    }

    const formatted = filtered.map((s) => {
      const storeRatings = ratings.filter((r) => r.storeId === s.id);
      const totalRatings = storeRatings.length;
      const rating =
        totalRatings > 0
          ? Number((storeRatings.reduce((acc, r) => acc + r.rating, 0) / totalRatings).toFixed(1))
          : 0;

      const owner = users.find((u) => u.id === s.ownerId);

      return {
        id: s.id,
        name: s.name,
        email: s.email,
        address: s.address,
        rating,
        totalRatings,
        owner: owner ? { id: owner.id, name: owner.name, email: owner.email } : null,
        createdAt: s.createdAt,
      };
    });

    const order = sortOrder.toUpperCase() === 'DESC' ? -1 : 1;
    formatted.sort((a, b) => {
      if (sortBy === 'rating') return (a.rating - b.rating) * order;
      if (sortBy === 'email') return a.email.localeCompare(b.email) * order;
      if (sortBy === 'address') return a.address.localeCompare(b.address) * order;
      return a.name.localeCompare(b.name) * order;
    });

    return { stores: formatted };
  },
};
