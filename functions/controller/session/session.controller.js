const SessionServices = require("../../services/session.services");
class SessionController {
    SessionStart = async (req, res) => {
        const tutorId = req.user.uid;
        const sessionId = req.params.sessionId;
        const { studentIds } = req.body;
        try {
            const session = await SessionServices.startSession(tutorId, studentIds, sessionId);
            return res.status(201).json({ message: "Session started successfully", data: session });
        } catch (error) {
            return res.status(500).json({ message: "Failed to start session", error: error.message });
        }
    }

    SessionEnd = async (req, res) => {
        const { sessionId } = req.params;
        try {
            const session = await SessionServices.endSession(sessionId);
            return res.status(200).json({ message: "Session ended successfully", data: session });
        } catch (error) {
            return res.status(500).json({ message: "Failed to end session", error: error.message });
        }
    }

    CreateSession = async (req, res) => {
        const tutorId = req.user.uid;
        const { classId, date } = req.body;
        try {
            const session = await SessionServices.storeSession(tutorId, classId, date);
            return res.status(201).json({ message: "Session created successfully", data: session });
        } catch (error) {
            return res.status(500).json({ message: "Failed to create session", error: error.message });
        }
    }
}

module.exports = new SessionController();