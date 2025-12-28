const onlyTutor = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    if (req.user.role !== "tutor") {
        return res.status(403).json({ message: "Forbidden: tutor only access" });
    }
    next();
}

const onlyStudent = (req, res, next) => {
    console.log("INI User ", req.user);
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    if (req.user.role !== "student") {
        return res.status(403).json({ message: "Forbidden: student only access" });
    }
    next();
}

module.exports = {
    onlyTutor,
    onlyStudent
}