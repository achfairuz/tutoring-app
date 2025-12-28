const admin = require("firebase-admin");

if (!admin.apps.length) {
    admin.initializeApp({
        projectId: "portofolio-9f886",
    });
}

const db = admin.firestore();

module.exports = { admin, db };
