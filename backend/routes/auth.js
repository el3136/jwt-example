const express = require("express");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} = require("../utils/token");

const router = express.Router();

const users = [];
const refreshTokens = [];

router.post("/signup", (req, res) => {
  const { username, password } = req.body;

  const user = {
    id: Date.now(),
    username,
    password,
    role: "user",
  };

  users.push(user);

  res.json({ message: "User created" });
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = users.find(
    (u) => u.username === username && u.password === password,
  );

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const accessToken = generateAccessToken({
    userId: user.id,
    role: user.role,
  });

  const refreshToken = generateRefreshToken({
    userId: user.id,
  });

  refreshTokens.push(refreshToken);

  res.json({ accessToken, refreshToken });
});

router.post("/refresh", (req, res) => {
  const { token } = req.body;

  if (!refreshTokens.includes(token)) {
    return res.status(403).json({ message: "Invalid refresh token" });
  }

  try {
    const decoded = verifyToken(token);

    const newAccessToken = generateAccessToken({
      userId: decoded.userId,
    });

    res.json({ accessToken: newAccessToken });
  } catch {
    res.status(403).json({ message: "Expired refresh token" });
  }
});

router.post("/logout", (req, res) => {
  const { token } = req.body;

  const index = refreshTokens.indexOf(token);
  if (index > -1) {
    refreshTokens.splice(index, 1);
  }

  res.json({ message: "Logged out" });
});

module.exports = router;