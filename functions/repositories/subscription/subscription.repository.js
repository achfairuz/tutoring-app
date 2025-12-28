const { admin, db } = require("../../config/firebase");

class SubscriptionRepository {
    constructor() {
        this.collection = db.collection("subscriptions");
    }

    async create(studentId, startDate, endDate) {

        const snapshot = await this.collection
            .where("studentId", "==", studentId)
            .limit(1)
            .get();

        if (snapshot.empty) {
            const docRef = await this.collection.add({
                studentId,
                startDate,
                endDate,
                is_active: true,

            });

            return {
                id: docRef.id,
                studentId,
                startDate,
                endDate,
                is_active: true,
            };
        }

        const doc = snapshot.docs[0];
        const existing = doc.data();

        if (existing.is_active === true) {
            throw new Error("Subscription is still active");
        }


        await doc.ref.update({
            startDate,
            endDate,
            is_active: true,

        });

        return {
            id: doc.id,
            studentId,
            startDate,
            endDate,
            is_active: true,
        };
    }

    async getSubscription(studentId) {
        const snapshot = await this.collection
            .where("studentId", "==", studentId)
            .limit(1)
            .get();

        if (snapshot.empty) {
            throw new Error("Subscription not found");
        }

        const doc = snapshot.docs[0];
        const existing = doc.data();

        if (existing.is_active === false) {
            throw new Error("Subscription is not active");
        }

        return {
            id: doc.id,
            studentId,
            startDate: existing.startDate,
            endDate: existing.endDate,
            is_active: existing.is_active,
        };
    }

    async getSubscriptionByStudentId(studentId) {
        const snapshot = await this.collection
            .where("studentId", "==", studentId)
            .limit(1)
            .get();

        if (snapshot.empty) {
            return null;
        }

        const doc = snapshot.docs[0];
        return {
            id: doc.id,
            ...doc.data(),
        };
    }
}

module.exports = new SubscriptionRepository();
