import { Op } from 'sequelize';
import { User, Store, Rating } from '../models/index.js';
import {
  validateName,
  validateEmail,
  validatePassword,
  validateAddress,
} from '../utils/validators.js';

// Admin Dashboard stats
export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalStores = await Store.count();
    const totalRatings = await Rating.count();

    return res.json({
      totalUsers,
      totalStores,
      totalRatings,
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return res.status(500).json({ message: 'Error fetching stats' });
  }
};

// Admin add new user
export const addUser = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    const nameCheck = validateName(name);
    if (!nameCheck.valid) return res.status(400).json({ message: nameCheck.message });

    const emailCheck = validateEmail(email);
    if (!emailCheck.valid) return res.status(400).json({ message: emailCheck.message });

    const passwordCheck = validatePassword(password);
    if (!passwordCheck.valid) return res.status(400).json({ message: passwordCheck.message });

    const addressCheck = validateAddress(address);
    if (!addressCheck.valid) return res.status(400).json({ message: addressCheck.message });

    const allowedRoles = ['admin', 'normal', 'owner'];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role specified' });
    }

    const existing = await User.findOne({ where: { email: email.trim().toLowerCase() } });
    if (existing) {
      return res.status(400).json({ message: 'A user with this email already exists' });
    }

    const user = await User.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      address: address.trim(),
      role,
    });

    return res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Error adding user:', error);
    return res.status(500).json({ message: error.message || 'Error creating user' });
  }
};

// Admin add new store
export const addStore = async (req, res) => {
  try {
    const { name, email, address, ownerId } = req.body;

    if (!name || name.trim().length === 0 || name.trim().length > 60) {
      return res.status(400).json({ message: 'Store name is required (max 60 characters)' });
    }

    const emailCheck = validateEmail(email);
    if (!emailCheck.valid) return res.status(400).json({ message: emailCheck.message });

    const addressCheck = validateAddress(address);
    if (!addressCheck.valid) return res.status(400).json({ message: addressCheck.message });

    const existingStore = await Store.findOne({ where: { email: email.trim().toLowerCase() } });
    if (existingStore) {
      return res.status(400).json({ message: 'A store with this email already exists' });
    }

    let assignedOwnerId = null;
    if (ownerId) {
      const owner = await User.findByPk(ownerId);
      if (!owner) {
        return res.status(400).json({ message: 'Selected owner user does not exist' });
      }
      assignedOwnerId = owner.id;
    }

    const store = await Store.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      address: address.trim(),
      ownerId: assignedOwnerId,
    });

    return res.status(201).json({
      message: 'Store created successfully',
      store,
    });
  } catch (error) {
    console.error('Error adding store:', error);
    return res.status(500).json({ message: error.message || 'Error creating store' });
  }
};

// Admin view list of all users with filters and sorting
// If the user is a Store Owner, their Rating should also be displayed
export const getUsersList = async (req, res) => {
  try {
    const { name, email, address, role, sortBy = 'name', sortOrder = 'ASC' } = req.query;

    const whereClause = {};
    if (name && name.trim()) {
      whereClause.name = { [Op.like]: `%${name.trim()}%` };
    }
    if (email && email.trim()) {
      whereClause.email = { [Op.like]: `%${email.trim()}%` };
    }
    if (address && address.trim()) {
      whereClause.address = { [Op.like]: `%${address.trim()}%` };
    }
    if (role && role.trim()) {
      whereClause.role = role.trim();
    }

    const users = await User.findAll({
      where: whereClause,
      attributes: ['id', 'name', 'email', 'address', 'role', 'createdAt'],
      include: [
        {
          model: Store,
          as: 'ownedStore',
          include: [
            {
              model: Rating,
              as: 'ratings',
              attributes: ['rating'],
            },
          ],
        },
      ],
    });

    const formatted = users.map((u) => {
      let storeRating = null;
      let storeName = null;
      if (u.role === 'owner' && u.ownedStore) {
        storeName = u.ownedStore.name;
        const ratings = u.ownedStore.ratings || [];
        storeRating = ratings.length > 0
          ? Number((ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length).toFixed(1))
          : 0;
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

    return res.json({ users: formatted });
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ message: 'Error fetching users' });
  }
};

// Admin view list of stores with ratings, filters, sorting
export const getStoresList = async (req, res) => {
  try {
    const { name, email, address, sortBy = 'name', sortOrder = 'ASC' } = req.query;

    const whereClause = {};
    if (name && name.trim()) {
      whereClause.name = { [Op.like]: `%${name.trim()}%` };
    }
    if (email && email.trim()) {
      whereClause.email = { [Op.like]: `%${email.trim()}%` };
    }
    if (address && address.trim()) {
      whereClause.address = { [Op.like]: `%${address.trim()}%` };
    }

    const stores = await Store.findAll({
      where: whereClause,
      include: [
        {
          model: Rating,
          as: 'ratings',
          attributes: ['rating'],
        },
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    const formatted = stores.map((s) => {
      const ratings = s.ratings || [];
      const totalRatings = ratings.length;
      const rating = totalRatings > 0
        ? Number((ratings.reduce((acc, curr) => acc + curr.rating, 0) / totalRatings).toFixed(1))
        : 0;

      return {
        id: s.id,
        name: s.name,
        email: s.email,
        address: s.address,
        rating,
        totalRatings,
        owner: s.owner ? { id: s.owner.id, name: s.owner.name, email: s.owner.email } : null,
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

    return res.json({ stores: formatted });
  } catch (error) {
    console.error('Error fetching admin stores:', error);
    return res.status(500).json({ message: 'Error fetching stores' });
  }
};
