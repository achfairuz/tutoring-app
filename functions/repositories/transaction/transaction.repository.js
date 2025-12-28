const { db } = require("../../config/firebase");
const { FieldValue } = require("firebase-admin/firestore");

class TransactionRepository {
    constructor() {
        this.collection = db.collection("transactions");
    }

    create(tx, data) {
        const ref = this.collection.doc();
        tx.set(ref, {
            ...data,
            createdAt: FieldValue.serverTimestamp(),
        });
    }
}

module.exports = new TransactionRepository();
