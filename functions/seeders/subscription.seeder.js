const { admin, db } = require("../config/firebase");

// daftar UID student
const studentIds = [
    "PC3ZG4Q3bXOMitgcqFEdhVaY4XG2",
    "YR9POHjaoJZ1iaSupxRfmuAZDBs2",
    "Fbh2gZ3dvsg50QDq0ukliVU45Vo2",
    "E7LseKrrZ5X4wLSbzV7U9Fe7rL63",
    "vlzGNkgjcFPecndCAVHzJ97gYzL2",
    "2o8BGGWoFgVf0rjAJfnc2Z5vdNo2",
];

// helper: tambah 1 bulan
function addOneMonth(date) {
    const result = new Date(date);
    result.setMonth(result.getMonth() + 1);
    return result;
}

async function seedSubscriptions() {
    const batch = db.batch();
    const collection = db.collection("subscriptions");

    const startDate = new Date();
    const endDate = addOneMonth(startDate);

    studentIds.forEach((studentId) => {
        const ref = collection.doc();

        batch.set(ref, {
            studentId: studentId,          // pakai UID
            startDate: new Date(),
            endDate: new Date(),
            is_active: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    });

    await batch.commit();
    console.log("✅ Subscription seeder berhasil dijalankan");
}

// jalankan
seedSubscriptions()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error("❌ Seeder gagal:", err);
        process.exit(1);
    });
