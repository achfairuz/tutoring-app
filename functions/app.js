const express = require("express");
const app = express();

const sessionRoutes = require("./routes/session/session.routes")
const authRoutes = require("./routes/Auth/auth.routes")
const subscriptionRoutes = require("./routes/subscription/subscription.routes")

app.use("/sessions", sessionRoutes);
app.use("/auth", authRoutes);
app.use("/subscriptions", subscriptionRoutes);

module.exports = app;