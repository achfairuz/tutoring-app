// const mockAuth = (req, res, next) => {
//     const randomId = Math.random().toString(36).substring(2, 9);
//     req.user = {
//         id: `tutor${randomId}`,
//         role: "tutor",
//     };
//     next();
// }

// module.exports = mockAuth;
const { admin } = require("../config/firebase");

module.exports = async function authMiddleware(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const token = authHeader.split(" ")[1];

        const decoded = await admin.auth().verifyIdToken(token);

        const emailPrefix = decoded.email.split("@")[0];

        const role = emailPrefix.startsWith("tutor")
            ? "tutor"
            : "student";


        req.user = {
            uid: decoded.uid,
            email: decoded.email,
            role,
        };
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token", error: error.message });
    }
};