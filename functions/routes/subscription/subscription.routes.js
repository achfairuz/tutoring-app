const express = require("express");
const router = express.Router();

const { onlyStudent } = require("../../middleware/role.middleware");
const SubscriptionController = require("../../controller/subscription/subscription.controller");
const authMiddleware = require("../../middleware/auth.middleware");

router.post(
    "/",
    authMiddleware,
    onlyStudent,
    SubscriptionController.Subscription
);

module.exports = router;