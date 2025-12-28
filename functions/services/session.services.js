const SessionRepository = require("../repositories/session/session.respository");
const subscriptionRepository = require("../repositories/subscription/subscription.repository");
const WalletRepository = require("../repositories/wallet/wallet.repository");

const MAX_STUDENTS = 6;
const MIN_SESSION_DURATION_MINUTES = 45;
const SESSION_PAYMENT = 50000;
const TIME_ZONE = "Asia/Jakarta";

class SessionServices {
    constructor() {
        this.sessionRepository = SessionRepository;
        this.subscriptionRepository = subscriptionRepository;
        this.walletRepository = WalletRepository;
    }

    async storeSession(tutorId, classId, date) {
        const session = await this.sessionRepository.createSession({
            tutorId,
            classId,
            date,
            status: "not-started",
            startTime: null,
            endTime: null,
            studentIds: [],
            durationMinutes: 0,
        });
        return session;
    }

    async startSession(tutorId, studentIds, sessionId) {
        const sessionSnap = await this.sessionRepository.getById(sessionId);
        if (!sessionSnap.exists) throw new Error("Session not found");

        const session = sessionSnap.data();
        if (session.tutorId !== tutorId) {
            throw new Error("You are not authorized to start this session");
        }
        if (session.status !== "not-started") {
            throw new Error("Session is already started");
        }
        if (studentIds.length > MAX_STUDENTS) {
            throw new Error(`Only ${MAX_STUDENTS} students can attend the class.`);
        }

        for (const studentId of studentIds) {
            const subscription = await this.subscriptionRepository.getSubscriptionByStudentId(studentId);
            if (!subscription || subscription.is_active === false) {
                throw new Error(`student ${studentId} Please subscribe first`);
            }
        }
        const today = new Date().toLocaleDateString("en-CA", { timeZone: TIME_ZONE }); // YYYY-MM-DD

        if (session.date !== today) {
            throw new Error("Session date is not today");
        }

        return await this.sessionRepository.startSession(

            {
                sessionId,
                tutorId,
                studentIds,
                status: "started",
                startTime: new Date(),
                endTime: null,
                durationMinutes: 0,
            }
        );
    }

    async endSession(sessionId) {
        const sessionSnap = (await this.sessionRepository.getById(sessionId));
        if (!sessionSnap.exists) throw new Error("Session not found");

        const session = sessionSnap.data();

        if (session.tutorId !== tutorId) {
            throw new Error("You are not authorized to end this session");
        }

        if (session.status !== "started") {
            throw new Error("Session is not started");
        }

        const endTime = new Date();
        const startTime = session.startTime.toDate();

        const durationMinutes =
            Math.floor(
                (endTime.getTime() - startTime.getTime()) / 60000
            );

        const isValid = durationMinutes >= MIN_SESSION_DURATION_MINUTES;



        const sessionUpdated = await this.sessionRepository.update({
            sessionId,
            endTime,
            durationMinutes,
            status: isValid ? "completed" : "invalid",
        });

        if (isValid) {
            await this.walletRepository.addBalance(session.tutorId, SESSION_PAYMENT, sessionId);
        }

        return {
            sessionId,
            tutorId: sessionUpdated.tutorId,
            studentIds: sessionUpdated.studentIds,
            classId: sessionUpdated.classId,
            date: sessionUpdated.date,
            startTime: sessionUpdated.startTime,
            endTime: sessionUpdated.endTime,
            durationMinutes: sessionUpdated.durationMinutes,
            status: sessionUpdated.status,
        };
    }
}

module.exports = new SessionServices();
