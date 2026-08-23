const jwt = require("jsonwebtoken");

function signToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

module.exports = signToken;
