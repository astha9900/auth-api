const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const { errorHandler } = require("./middleware/errorHandler");
const { logger } = require("./lib/logger");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, error: "Too many attempts, please try again later" },
});

app.get("/", (_, res) => res.json({ name: "Auth API", version: "1.0.0", status: "running" }));
app.get("/health", (_, res) => res.json({ status: "ok", timestamp: new Date().toISOString() }));
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/users", userRoutes);

app.use(errorHandler);

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => logger.info(`Auth API running on port ${PORT}`));
}

module.exports = app;
