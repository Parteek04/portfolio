import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Generate Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "default_jwt_secret_key", {
    expiresIn: "30d"
  });
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (user && (await user.comparePassword(password))) {
      res.json({
        success: true,
        token: generateToken(user._id),
        username: user.username
      });
    } else {
      res.status(401);
      throw new Error("Invalid username or password");
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Verify active admin token
// @route   GET /api/auth/verify
// @access  Private
export const verifyToken = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Register a new admin (Only works if no users exist in database)
// @route   POST /api/auth/setup
// @access  Public
export const setupAdmin = async (req, res, next) => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      return res.status(400).json({
        success: false,
        message: "Setup already completed. Please log in using existing credentials."
      });
    }

    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide a username and password"
      });
    }

    const user = await User.create({ username, password });
    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      username: user.username,
      message: "Admin account setup successful!"
    });
  } catch (error) {
    next(error);
  }
};
