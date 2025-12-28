const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

const TUTOR_EMAILS = ["tutor@mail.com"];

exports.setUserRoles = functions.https.onCall(async (data, context) => {
    if (!context.auth || context.auth.token.role !== "admin") {
        throw new functions.https.HttpsError(
            "permission-denied",
            "Only admin can run this function"
        );
    }

    const listUsers = await admin.auth().listUsers(1000);

    for (const user of listUsers.users) {
        const role = TUTOR_EMAILS.includes(user.email)
            ? "tutor"
            : "student";

        await admin.auth().setCustomUserClaims(user.uid, { role });

        console.log(`Role ${role} set for ${user.email}`);
    }

    return { message: "Roles updated successfully" };
});
