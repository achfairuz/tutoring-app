const express = require("express");
const { login } = require("../../controller/Auth/login.controller");
const rateLimit = require("../../middleware/rate_limit_middleware");

const router = express.Router();

router.post("/login", login);

module.exports = router;
