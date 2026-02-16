const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/me", authMiddleware, (req, res) => {
  res.json(req.user);
});

module.exports = router;