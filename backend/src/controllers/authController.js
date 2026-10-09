import { User, Store } from '../models/index.js';
import { generateToken } from '../middleware/auth.js';
import {
  validateName,
  validateEmail,
  validatePassword,
  validateAddress,
} from '../utils/validators.js';

export const register = async (req, res) => {
  try {
    const { name, email, password, address } = req.body;

    // Validate inputs per PDF requirements
    const nameCheck = validateName(name);
    if (!nameCheck.valid) return res.status(400).json({ message: nameCheck.message });

    const emailCheck = validateEmail(email);
    if (!emailCheck.valid) return res.status(400).json({ message: emailCheck.message });

    const passwordCheck = validatePassword(password);
    if (!passwordCheck.valid) return res.status(400).json({ message: passwordCheck.message });

    const addressCheck = validateAddress(address);
    if (!addressCheck.valid) return res.status(400).json({ message: addressCheck.message });

    // Check if user already exists
    const existing = await User.findOne({ where: { email: email.trim().toLowerCase() } });
    if (existing) {
      return res.status(400).json({ message: 'A user with this email address already exists' });
    }

    // Normal users register through the registration page
    const user = await User.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      address: address.trim(),
      role: 'normal',
    });

    const token = generateToken(user);

    return res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: error.message || 'Error registering user' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({
      where: { email: email.trim().toLowerCase() },
      include: [{ model: Store, as: 'ownedStore' }],
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isValid = await user.validPassword(password);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user);

    return res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role,
        ownedStore: user.ownedStore || null,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Error logging in' });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    const passwordCheck = validatePassword(newPassword);
    if (!passwordCheck.valid) {
      return res.status(400).json({ message: passwordCheck.message });
    }

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isValid = await user.validPassword(currentPassword);
    if (!isValid) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    return res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Password update error:', error);
    return res.status(500).json({ message: 'Error updating password' });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Store, as: 'ownedStore' }],
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({ user });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching user profile' });
  }
};
