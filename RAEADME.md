# Tutoring Session Backend API

This backend API is developed to manage a **tutoring session system** between tutors and students, equipped with **security, wallet, transaction, and unit testing features**.  
The system ensures that **only valid tutors** can conduct sessions and receive payments according to predefined rules.

---

## 📌 Task Background

### Implement the API and Security Features

You are requested to implement the backend API that handles several key features of this application:

1. API to Start a Tutoring Session  
   An endpoint that allows a tutor to start a tutoring session with a student.

2. API to End a Tutoring Session  
   An endpoint to mark the session as completed and verify the tutor’s attendance.

3. Security Verification  
   Ensure that only valid tutors can trigger the system to add a 50 thousand payment to their wallet after the session is completed.  
   Ensure that only valid tutors can access and modify their session data.

4. Wallet and Payment Features  
   After the session ends, if the session duration meets the requirements (45 minutes), the tutor will be credited 50 thousand.  
   Every balance change must be logged as a transaction.

---

## 🎯 System Objectives

- Manage tutoring sessions in a structured manner
- Ensure tutor validation and system security
- Automate tutor payments based on session duration
- Provide transparent transaction history

---

## 🧩 Main Features

### 1. Tutoring Session Management
- Tutors can create tutoring sessions
- Tutors can start tutoring sessions
- Tutors can end tutoring sessions
- The system records session start and end times
- The system automatically calculates session duration

### 2. Security & Authorization
- Authentication using JWT and Firebase Auth
- Role-based authorization (`tutor`)
- Tutors can only access their own sessions
- Sensitive endpoints are protected by authentication middleware

### 3. Tutor Wallet
- Each tutor has a personal wallet
- Wallet balance can only be modified by the system
- Balance is automatically credited after a valid session

### 4. Payment System
- Tutors receive **Rp50,000** if the session duration is **≥ 45 minutes**
- No payment is given if the duration does not meet the requirement
- Payments are processed atomically (transaction-safe)

### 5. Transaction History
- Every balance change is recorded
- Transaction data includes:
  - Tutor ID
  - Amount
  - Transaction type
  - Description
  - Timestamp

### 6. Subscription
- Students must subscribe before creating a tutoring session
- Subscription duration is **1 month**
- Students cannot create sessions after the subscription expires
- Students can repurchase subscriptions

---

## 🔐 Security Rules

- Only users with the **tutor** role can:
  - Create sessions
  - Start sessions
  - End sessions
  - Receive wallet payments
- Tutors cannot modify sessions belonging to other tutors
- Invalid or expired tokens are rejected
- All sensitive endpoints are protected by authentication middleware

---

## ⏱ Payment Rules

| Session Duration | Payment Status |
|-----------------|---------------|
| < 45 minutes | ❌ Not Paid |
| ≥ 45 minutes | ✅ Rp50,000 |

---

## 🗂 Data Structure (Example)

### Session
- id
- tutorId
- studentId
- startTime
- endTime
- duration
- durationMinutes
- status
- createdAt

### Wallet
- tutorId
- balance
- updatedAt

### Transaction
- id
- tutorId
- sessionId
- amount
- description
- createdAt

### Subscription
- id
- userId
- startDate
- endDate
- isActive
- createdAt

---

## 🧪 Unit Testing

Testing is implemented to ensure that each service behaves as expected.

### Test Scenarios

#### ✅ Valid Cases
- Tutor starts a session with a valid token
- Tutor ends a session with a duration ≥ 45 minutes
- Tutor wallet balance is increased
- Transaction is successfully recorded

#### ❌ Invalid Cases
- Non-tutor users access tutor-only endpoints
- Tutors attempt to end sessions owned by other tutors
- Session duration is less than 45 minutes
- Student does not have an active subscription
- Student subscription has expired

---

## 🔐 Tutor Validation for Payment

To ensure that **only valid tutors** receive the **Rp50,000 payment**, the system applies the following steps:

1. The payment function is triggered **only after the session status is `completed`**
2. The system verifies that:
   - The request initiator is a **tutor**
   - The `tutorId` in the session matches the authenticated user UID
3. Session duration is calculated:
   - Duration < 45 minutes → no payment
   - Duration ≥ 45 minutes → payment of **Rp50,000** is processed
4. Each session can only be paid **once**

---

## ⚠️ Error Handling
- Data not found
- Validation errors
- Invalid or expired tokens
- Data update failures
- Spam or excessive requests

---

## 🛡️ Cloud Function Security (Abuse Prevention)

To prevent unauthorized parties from triggering wallet balance updates, the system enforces multiple security layers:

### 1. Mandatory Authentication (JWT / Firebase Auth)
- Cloud Functions only accept requests with valid authentication tokens
- Tokens are verified using Firebase Admin SDK

### 2. Role-Based Authorization
- User roles are validated from the `users` collection
- Only users with the **tutor** role are permitted

### 3. Data Ownership Validation
- Tutors can only end their own sessions
- Tutors cannot trigger payments for sessions they do not own

### 4. Server-Side Execution Only
- Wallet balance updates **cannot be triggered directly from the client**
- All payment logic is executed server-side

### 5. Atomic Transactions
- Wallet updates and transaction logs are executed within **Firestore Transactions**
- If any step fails, the entire operation is rolled back

---

## ⚠️ Additional Protections

- Rate limiting for sensitive endpoints
- Rejection of invalid session requests
- Time validation to prevent duration manipulation

---

## ✅ Conclusion

With this design:
- Tutors cannot manipulate wallet balances
- Clients cannot directly increase balances
- Payments occur only when all conditions are met
- All balance changes are securely logged

---

## 🛠 Tools & Technologies

- Backend: Express.js
- Database: Firestore
- Authentication: JWT
- Testing: Postman

---

## 📦 How to Run

### 1. Install Dependencies
Ensure Node.js and npm are installed, then run:

```bash
npm install
firebase init
firebase emulators:start
node functions/seeders/subscription.seeder.js

### 2. Testing
http://127.0.0.1:5001/portofolio-9f886/us-central1/api/


### 3. Import file tutoring-app.postman_collection.json to postman (noted)
