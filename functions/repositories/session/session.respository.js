const { admin, db } = require("../../config/firebase");
const { FieldValue } = require("firebase-admin/firestore");

class SessionRepository {

    constructor() {
        this.collection = db.collection("sessions");
        this.collect_subscription = db.collection("subscriptions");
    }

    async createSession(data) {
        const session = await this.collection.add(
            {
                tutorId: data.tutorId,
                studentIds: data.studentIds,
                classId: data.classId,
                status: data.status,
                date: data.date,
                startTime: data.startTime,
                endTime: data.endTime,
                durationMinutes: data.durationMinutes,
                createdAt: new Date(),
                updatedAt: new Date(),

            }
        )
        const updatedSnapshot = await session.get();
        return {
            id: updatedSnapshot.id,
            ...updatedSnapshot.data(),
        };
    }


    async startSession(data) {
        const sessionRef = this.collection.doc(data.sessionId);

        console.log("INI DATA :", sessionRef)
        await sessionRef.update({
            tutorId: data.tutorId,
            studentIds: data.studentIds,
            status: data.status,
            startTime: data.startTime,
            endTime: data.endTime,
            durationMinutes: data.durationMinutes,
            updatedAt: FieldValue.serverTimestamp(),
        });

        const updatedSnapshot = await sessionRef.get();

        return {
            id: updatedSnapshot.id,
            ...updatedSnapshot.data(),
        };
    }

    async update(data) {
        const sessionRef = this.collection.doc(data.sessionId);
        await sessionRef.update({
            durationMinutes: data.durationMinutes,
            status: data.status,
            endTime: data.endTime,
            updatedAt: new Date(),
        });

        const updatedSnapshot = await sessionRef.get();
        const sessionget = await this.collection.doc(data.sessionId).get();
        return {
            id: updatedSnapshot.id,
            ...sessionget.data(),
        };
    }

    async getById(sessionId) {
        return await this.collection.doc(sessionId).get();
    }


}

module.exports = new SessionRepository();
