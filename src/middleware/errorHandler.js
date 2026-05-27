const { logger } = require("../lib/logger");

function errorHandler(err, req, res, next) {
  logger.error(`${req.method} ${req.path} — ${err.message}`);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    error: status === 500 ? "Internal Server Error" : err.message,
  });
}

module.exports = { errorHandler };
