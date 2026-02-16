const jwt = require("jsonwebtoken");

const SECRET = "mysecret";

function generateAccessToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: "10s" });
}

function generateRefreshToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: "7d" });
}

function verifyToken(token) {
  return jwt.verify(token, SECRET);
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
};