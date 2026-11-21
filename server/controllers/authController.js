const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET } = require('../middleware/auth');

// Generate JWT Helper
function createToken(user) {
  return jwt.sign(
    { 
      id: user._id.toString(), 
      email: user.email, 
      role: user.role,
      name: user.name 
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// User Registration
async function register(req, res, next) {
  try {
    const { name, email, password, role, campusId, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required fields.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.'
      });
    }

    // Check if user already exists
    const normalizedEmail = email.toLowerCase().trim();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists.'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Default role is student unless explicitly admin
    const userRole = role === 'admin' ? 'admin' : 'student';

    const newUser = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: userRole,
      campusId: campusId || '',
      phone: phone || '',
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name.trim())}`
    });

    const token = createToken(newUser);

    return res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      token,
      user: {
        id: newUser._id.toString(),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        campusId: newUser.campusId,
        avatar: newUser.avatar
      }
    });
  } catch (err) {
    next(err);
  }
}

// User Login
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials.'
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials.'
      });
    }

    const token = createToken(user);

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        campusId: user.campusId,
        avatar: user.avatar
      }
    });
  } catch (err) {
    next(err);
  }
}

// Get Current User Profile
async function getMe(req, res, next) {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found.'
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        campusId: user.campusId,
        phone: user.phone,
        avatar: user.avatar
      }
    });
  } catch (err) {
    next(err);
  }
}

// Quick Demo Login (for viva/evaluation convenience)
async function demoLogin(req, res, next) {
  try {
    const role = req.params.role === 'admin' ? 'admin' : 'student';
    if (role === 'admin' && process.env.ENABLE_DEMO_ADMIN !== 'true') {
  return res.status(403).json({ success: false, message: 'Demo admin login is disabled. Use your admin credentials.' });
}
    const email = role === 'admin' ? 'admin@saiuniversity.edu.in' : 'student@saiuniversity.edu.in';

    let user = await User.findOne({ email });
    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('Password123!', salt);
      user = await User.create({
        name: role === 'admin' ? 'Campus Admin' : 'Sai Student',
        email,
        password: hashedPassword,
        role,
        campusId: role === 'admin' ? 'SAI-ADM-01' : 'SAI-2026-CS42',
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${role === 'admin' ? 'Admin' : 'Student'}`
      });
    }

    const token = createToken(user);

    return res.status(200).json({
      success: true,
      message: `Signed in as Demo ${role.toUpperCase()}`,
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        campusId: user.campusId,
        avatar: user.avatar
      }
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  register,
  login,
  getMe,
  demoLogin
};
