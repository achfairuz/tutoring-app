const express = require("express");
const authMiddleware = require("../../middleware/auth.middleware");
const { onlyTutor } = require("../../middleware/role.middleware");
const sessionController = require("../../controller/session/session.controller");
const rateLimit = require("../../middleware/rate_limit_middleware");
const router = express.Router();

router.post(
    '/start/:sessionId',
    authMiddleware,
    onlyTutor,
    rateLimit("START_SESSION"),
    sessionController.SessionStart
)

router.post(
    '/end/:sessionId',
    authMiddleware,
    onlyTutor,
    rateLimit("END_SESSION"),
    sessionController.SessionEnd
)
router.post(
    '/create',
    authMiddleware,
    onlyTutor,
    rateLimit("CREATE_SESSION"),
    sessionController.CreateSession
)


module.exports = router;
