const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const swaggerUi = require("swagger-ui-express");
const swaggerDoc = require("../swagger.json");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const { errorHandler } = require("./middleware/errorHandler");
const { logger } = require("./lib/logger");

const app = express();

app.use(helmet());
app.use(express.json());
app.use(morgan("dev"));

// Global rate limit
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// Auth rate limit — stricter
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, error: "Too many attempts, please try again later" },
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/users", userRoutes);

app.get("/health", (_, res) => res.json({ status: "ok", timestamp: new Date().toISOString() }));

app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => logger.info(`Auth API running on port ${PORT}`));

module.exports = app;
