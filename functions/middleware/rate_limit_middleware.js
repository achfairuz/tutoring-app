const { db } = require("../config/firebase");
const { FieldValue } = require("firebase-admin/firestore");

const RATE_LIMIT = 2;
const RATE_LIMIT_WINDOW = 60 * 1000;

const rateLimit = (endpointKey) => {
    return async (req, res, next) => {
        try {
            const userId = req.user.uid;
            const docId = `${userId}_${endpointKey}`;
            const ref = db.collection("rate_limits").doc(docId);

            const now = Date.now();
            let shouldBlock = false;

            await db.runTransaction(async (tx) => {
                const snap = await tx.get(ref);

                if (!snap.exists) {
                    tx.set(ref, {
                        count: 1,
                        resetAt: now + RATE_LIMIT_WINDOW,
                    });
                    return;
                }

                const data = snap.data();

                if (now > data.resetAt) {
                    tx.update(ref, {
                        count: 1,
                        resetAt: now + RATE_LIMIT_WINDOW,
                    });
                    return;
                }

                if (data.count >= RATE_LIMIT) {
                    shouldBlock = true;
                    return;
                }

                tx.update(ref, {
                    count: FieldValue.increment(1),
                });
            });

            if (shouldBlock) {
                return res.status(429).json({
                    message: "Too many requests. Please try again later.",
                });
            }

            return next();

        } catch (error) {
            console.error("Rate limit error:", error);
            return res.status(500).json({
                message: "Internal server error.",
            });
        }
    };
};

module.exports = rateLimit;
