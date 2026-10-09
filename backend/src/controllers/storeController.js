import { Op, fn, col, literal } from 'sequelize';
import { Store, Rating, User } from '../models/index.js';
import { validateRating } from '../utils/validators.js';

// Get stores for Normal User or Public viewing
export const getAllStores = async (req, res) => {
  try {
    const { search, sortBy = 'name', sortOrder = 'ASC' } = req.query;
    const currentUserId = req.user ? req.user.id : null;

    let whereClause = {};
    if (search && search.trim()) {
      const q = `%${search.trim()}%`;
      whereClause = {
        [Op.or]: [
          { name: { [Op.like]: q } },
          { address: { [Op.like]: q } },
        ],
      };
    }

    // Fetch stores with their ratings
    const stores = await Store.findAll({
      where: whereClause,
      include: [
        {
          model: Rating,
          as: 'ratings',
          attributes: ['id', 'userId', 'rating', 'updatedAt'],
        },
      ],
    });

    // Format response to include overall rating and current user's submitted rating
    const formatted = stores.map((store) => {
      const ratings = store.ratings || [];
      const totalRatings = ratings.length;
      const averageRating = totalRatings > 0
        ? Number((ratings.reduce((acc, curr) => acc + curr.rating, 0) / totalRatings).toFixed(1))
        : 0;

      let userRating = null;
      if (currentUserId) {
        const found = ratings.find((r) => r.userId === currentUserId);
        if (found) {
          userRating = found.rating;
        }
      }

      return {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        ownerId: store.ownerId,
        overallRating: averageRating,
        totalRatings,
        userRating,
        createdAt: store.createdAt,
      };
    });

    // Apply sorting in-memory if needed for overallRating or string fields
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

    return res.json({ stores: formatted });
  } catch (error) {
    console.error('Error fetching stores:', error);
    return res.status(500).json({ message: 'Error fetching stores' });
  }
};

// Normal User submits or modifies their rating (1 to 5)
export const submitOrUpdateRating = async (req, res) => {
  try {
    const { storeId } = req.params;
    const { rating } = req.body;
    const userId = req.user.id;

    const ratingCheck = validateRating(rating);
    if (!ratingCheck.valid) {
      return res.status(400).json({ message: ratingCheck.message });
    }

    const store = await Store.findByPk(storeId);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    // Check if user already submitted rating
    let userRating = await Rating.findOne({
      where: { userId, storeId },
    });

    let isModified = false;
    if (userRating) {
      userRating.rating = Number(rating);
      await userRating.save();
      isModified = true;
    } else {
      userRating = await Rating.create({
        userId,
        storeId,
        rating: Number(rating),
      });
    }

    // Calculate new overall rating
    const ratings = await Rating.findAll({ where: { storeId } });
    const totalRatings = ratings.length;
    const averageRating = totalRatings > 0
      ? Number((ratings.reduce((acc, curr) => acc + curr.rating, 0) / totalRatings).toFixed(1))
      : 0;

    return res.json({
      message: isModified ? 'Rating updated successfully' : 'Rating submitted successfully',
      rating: userRating.rating,
      overallRating: averageRating,
      totalRatings,
    });
  } catch (error) {
    console.error('Error submitting rating:', error);
    return res.status(500).json({ message: 'Error submitting rating' });
  }
};

// Store Owner Dashboard data
export const getOwnerStoreDashboard = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { sortBy = 'date', sortOrder = 'DESC' } = req.query;

    const store = await Store.findOne({
      where: { ownerId },
      include: [
        {
          model: Rating,
          as: 'ratings',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'name', 'email', 'address'],
            },
          ],
        },
      ],
    });

    if (!store) {
      return res.status(404).json({ message: 'No store found assigned to your account' });
    }

    const ratingsList = (store.ratings || []).map((r) => ({
      id: r.id,
      rating: r.rating,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      user: r.user ? {
        id: r.user.id,
        name: r.user.name,
        email: r.user.email,
        address: r.user.address,
      } : { name: 'Unknown User', email: 'N/A' },
    }));

    const totalRatings = ratingsList.length;
    const averageRating = totalRatings > 0
      ? Number((ratingsList.reduce((acc, curr) => acc + curr.rating, 0) / totalRatings).toFixed(1))
      : 0;

    // Sort submissions list
    const order = sortOrder.toUpperCase() === 'ASC' ? 1 : -1;
    ratingsList.sort((a, b) => {
      if (sortBy === 'rating') {
        return (a.rating - b.rating) * order;
      }
      if (sortBy === 'name') {
        return (a.user.name || '').localeCompare(b.user.name || '') * order;
      }
      if (sortBy === 'email') {
        return (a.user.email || '').localeCompare(b.user.email || '') * order;
      }
      return (new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()) * order;
    });

    return res.json({
      store: {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        averageRating,
        totalRatings,
      },
      ratings: ratingsList,
    });
  } catch (error) {
    console.error('Error fetching store owner dashboard:', error);
    return res.status(500).json({ message: 'Error fetching dashboard data' });
  }
};
