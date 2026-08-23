const bcrypt = require("bcryptjs");
const User = require("../models/User");
const signToken = require("../utils/token");

async function register(req, res) {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: "Name, email and password are required" });

  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ message: "Email already registered" });

  const hashed = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, password: hashed });

  res.status(201).json({
    token: signToken(user._id),
    user: { id: user._id, name: user.name, email: user.email }
  });
}

async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  res.json({
    token: signToken(user._id),
    user: { id: user._id, name: user.name, email: user.email }
  });
}

module.exports = { register, login };
