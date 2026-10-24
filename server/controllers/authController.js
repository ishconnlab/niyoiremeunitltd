import asyncHandler from 'express-async-handler';
import Admin from '../models/Admin.js';
import jwt from 'jsonwebtoken';

// @desc    Register admin (first time setup only)
// @route   POST /api/auth/register
// @access  Public
export const registerAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const adminExists = await Admin.findOne({ email });

  if (adminExists) {
    res.status(400);
    throw new Error('Admin already exists');
  }

  const admin = await Admin.create({
    email,
    password,
    role: 'super_admin',
  });

  if (admin) {
    res.status(201).json({
      _id: admin._id,
      email: admin.email,
      role: admin.role,
      token: getSignedJwtToken(admin),
    });
  } else {
    res.status(400);
    throw new Error('Invalid admin data');
  }
});

// @desc    Login admin
// @route   POST /api/auth/login
// @access  Public
export const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email }).select('+password');

  if (!admin) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  const isMatch = await admin.matchPassword(password);

  if (!isMatch) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  sendTokenResponse(admin, 200, res);
});

// @desc    Get current logged in admin
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.admin.id);
  res.status(200).json({ success: true, data: admin });
});

// @desc    Logout admin / clear cookie
// @route   GET /api/auth/logout
// @access  Private
export const logoutAdmin = asyncHandler(async (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ success: true, data: {} });
});

// Get token from model, create cookie and send response
const sendTokenResponse = (admin, statusCode, res) => {
  const token = admin.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + parseInt(process.env.JWT_EXPIRE, 10) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
    admin: {
      _id: admin._id,
      email: admin.email,
      role: admin.role,
    },
  });
};

const getSignedJwtToken = (admin) => {
  return jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};
