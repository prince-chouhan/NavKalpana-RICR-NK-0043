import User from '../models/User.js';
import jwt from 'jsonwebtoken';

export const registerUser = async (name, email, password) => {
  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('User already exists');
  }
  
  // Create new user
  const user = new User({
    name,
    email,
    password_hash: password
  });
  
  await user.save();
  
  // Generate JWT token
  const token = jwt.sign({ user_id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
  
  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email
    },
    token
  };
};

export const loginUser = async (email, password) => {
  // Find user by email
  const user = await User.findOne({ email }).select('+password_hash');
  
  if (!user) {
    throw new Error('Invalid credentials');
  }
  
  // Compare passwords
  const isPasswordValid = await user.comparePassword(password);
  
  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }
  
  // Generate JWT token
  const token = jwt.sign({ user_id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
  
  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email
    },
    token
  };
};

export const getUserById = async (user_id) => {
  const user = await User.findById(user_id);
  
  if (!user) {
    throw new Error('User not found');
  }
  
  return user;
};
