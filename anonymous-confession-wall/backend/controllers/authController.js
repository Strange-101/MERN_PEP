import generateToken from '../utils/generateToken.js';
import User from '../models/User.js';

export const googleCallback = (req, res) => {
  // Passport passes the authenticated user in req.user
  generateToken(res, req.user._id);
  res.redirect(`${process.env.CLIENT_URL}/`); // Redirect to frontend home
};

export const getMe = async (req, res) => {
  res.status(200).json(req.user);
};

export const logout = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

export const updateProfile = async (req, res) => {
  try {
    const { secretIdentity } = req.body;
    
    // Check if the identity is already taken by someone else
    const existingUser = await User.findOne({ secretIdentity });
    if (existingUser && existingUser._id.toString() !== req.user._id.toString()) {
      return res.status(400).json({ message: 'This secret identity is already taken!' });
    }

    const user = await User.findById(req.user._id);
    user.secretIdentity = secretIdentity;
    await user.save();

    res.status(200).json(user);
  } catch (error) {
    // Handle Mongoose validation or unique constraint errors
    if (error.code === 11000) {
      return res.status(400).json({ message: 'This secret identity is already taken!' });
    }
    res.status(500).json({ message: error.message });
  }
};