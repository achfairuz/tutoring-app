const { admin, db } = require("../../config/firebase");

const { FieldValue } = require("firebase-admin/firestore");
const transactionRepository = require("../transaction/transaction.repository");

class WalletRepository {
    constructor() {
        this.collection = db.collection("wallets");
    }

    async getByUserId(userId) {
        const walletRef = this.collection.doc(userId);
        let snapshot = await walletRef.get();


        if (!snapshot.exists) {
            await walletRef.set({
                userId,
                balance: 0,
                createdAt: FieldValue.serverTimestamp(),
                updatedAt: FieldValue.serverTimestamp(),
            });

            snapshot = await walletRef.get();
        }

        return {
            userId: snapshot.id,
            ...snapshot.data(),
        };
    }



    async addBalance(userId, amount, sessionId) {
        const walletRef = this.collection.doc(userId);

        await db.runTransaction(async (tx) => {
            const snapshot = await tx.get(walletRef);

            if (!snapshot.exists) {
                tx.set(walletRef, {
                    userId,
                    balance: amount,
                    createdAt: FieldValue.serverTimestamp(),
                    updatedAt: FieldValue.serverTimestamp(),
                });
            } else {
                tx.update(walletRef, {
                    balance: FieldValue.increment(amount),
                    updatedAt: FieldValue.serverTimestamp(),
                });
            }

            // ✅ TRANSACTION LOG SELALU DIBUAT
            transactionRepository.create(tx, {
                userId,
                sessionId,
                amount,
                description: "Session completed payment",
            });
        });

        return true;
    }


}

module.exports = new WalletRepository();
