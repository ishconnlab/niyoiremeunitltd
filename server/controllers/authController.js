import asyncHandler from 'express-async-handler';
import Admin from '../models/Admin.js';
import Setting from '../models/Setting.js';

/**
 * Get the current registration status.
 * If no admin exists yet, registration is open (first-time setup).
 * Otherwise, it depends on the registrationEnabled setting.
 * @access Public
 */
export const getRegistrationStatus = asyncHandler(async (req, res) => {
  const adminExists = await Admin.exists({});
  if (!adminExists) {
    return res.status(200).json({ success: true, registrationEnabled: process.env.ALLOW_INITIAL_ADMIN_REGISTRATION === 'true' });
  }

  const setting = await Setting.findOne({ key: 'registrationEnabled' });
  const enabled = setting ? setting.value : false;

  res.status(200).json({ success: true, registrationEnabled: enabled });
});

/**
 * Register admin (first time setup only).
 * If no admin exists, registration is open.
 * Otherwise, it requires the registrationEnabled setting to be true.
 * @access Public
 */
export const registerAdmin = asyncHandler(async (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = req.body.password;
  if (!email || typeof password !== 'string' || password.length < 8) {
    res.status(400);
    throw new Error('A valid email and password of at least 8 characters are required');
  }

  const adminExists = await Admin.findOne({ email });

  if (adminExists) {
    res.status(400);
    throw new Error('Admin already exists');
  }

  // If admins already exist, registration must be explicitly enabled
  const anyAdminExists = await Admin.exists({});
  if (!anyAdminExists && process.env.ALLOW_INITIAL_ADMIN_REGISTRATION !== 'true') {
    res.status(403);
    throw new Error('Initial admin setup is disabled. Seed the first administrator before enabling registration.');
  }
  if (anyAdminExists) {
    const setting = await Setting.findOne({ key: 'registrationEnabled' });
    if (!setting || setting.value !== true) {
      res.status(403);
      throw new Error('Admin registration is disabled');
    }
  }

  const admin = await Admin.create({
    email,
    password,
    role: 'super_admin',
  });

  if (admin) {
    sendTokenResponse(admin, 201, res);
  } else {
    res.status(400);
    throw new Error('Invalid admin data');
  }
});

/**
 * Login admin
 * @access Public
 */
export const loginAdmin = asyncHandler(async (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase();
  const { password } = req.body;
  if (!email || typeof password !== 'string' || !password) {
    res.status(400);
    throw new Error('Email and password are required');
  }

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

/**
 * Get current logged in admin
 * @access Private
 */
export const getMe = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.admin.id);
  res.status(200).json({ success: true, data: admin });
});

/**
 * Toggle admin registration on/off.
 * @access Private (admin only)
 */
export const toggleRegistration = asyncHandler(async (req, res) => {
  let setting = await Setting.findOne({ key: 'registrationEnabled' });

  if (!setting) {
    setting = await Setting.create({
      key: 'registrationEnabled',
      value: false,
      description: 'Whether new admin registration is allowed',
    });
  }

  setting.value = !setting.value;
  await setting.save();

  res.status(200).json({
    success: true,
    registrationEnabled: setting.value,
    message: `Admin registration ${setting.value ? 'enabled' : 'disabled'}`,
  });
});

/**
 * Logout admin / clear cookie
 * @access Private
 */
export const logoutAdmin = asyncHandler(async (req, res) => {
  res.clearCookie('token', cookieOptions());
  res.status(200).json({ success: true, data: {} });
});

// Get token from model, create cookie and send response
const sendTokenResponse = (admin, statusCode, res) => {
  const token = admin.getSignedJwtToken();

  const options = { ...cookieOptions(), maxAge: 7 * 24 * 60 * 60 * 1000 };

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    admin: {
      _id: admin._id,
      email: admin.email,
      role: admin.role,
    },
  });
};

const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
});
