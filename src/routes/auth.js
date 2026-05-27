const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { z } = require("zod");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const registerSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(8).regex(/[A-Z]/).regex(/[0-9]/),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

router.post("/register", async (req, res, next) => {
  try {
    const body = registerSchema.parse(req.body);
    const existing = await prisma.user.findUnique({ where: { email: body.email } });
    if (existing) return res.status(409).json({ success: false, error: "Email already registered" });

    const hash = await bcrypt.hash(body.password, 12);
    const user = await prisma.user.create({
      data: { name: body.name, email: body.email, password: hash, role: "USER" },
      select: { id: true, name: true, email: true, role: true },
    });

    const tokens = await issueTokens(user.id);
    res.status(201).json({ success: true, data: { user, ...tokens } });
  } catch (err) {
    if (err.name === "ZodError") {
      return res.status(400).json({ success: false, error: "Validation error", details: err.errors });
    }
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const body = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email: body.email } });
    if (!user || !(await bcrypt.compare(body.password, user.password))) {
      return res.status(401).json({ success: false, error: "Invalid credentials" });
    }

    const tokens = await issueTokens(user.id);
    res.json({
      success: true,
      data: {
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
        ...tokens,
      },
    });
  } catch (err) {
    if (err.name === "ZodError") {
      return res.status(400).json({ success: false, error: "Validation error", details: err.errors });
    }
    next(err);
  }
});

router.post("/refresh", async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ success: false, error: "Refresh token required" });

    const hashed = crypto.createHash("sha256").update(refreshToken).digest("hex");
    const stored = await prisma.refreshToken.findUnique({ where: { tokenHash: hashed } });

    if (!stored || stored.expiresAt < new Date()) {
      return res.status(403).json({ success: false, error: "Invalid or expired refresh token" });
    }

    // rotate: delete old, issue new
    await prisma.refreshToken.delete({ where: { id: stored.id } });
    const tokens = await issueTokens(stored.userId);
    res.json({ success: true, data: tokens });
  } catch (err) {
    next(err);
  }
});

router.post("/logout", async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (refreshToken) {
      const hashed = crypto.createHash("sha256").update(refreshToken).digest("hex");
      await prisma.refreshToken.deleteMany({ where: { tokenHash: hashed } });
    }
    res.json({ success: true, message: "Logged out successfully" });
  } catch (err) {
    next(err);
  }
});

async function issueTokens(userId) {
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "15m" });

  const raw = crypto.randomBytes(40).toString("hex");
  const hashed = crypto.createHash("sha256").update(raw).digest("hex");
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await prisma.refreshToken.create({ data: { userId, tokenHash: hashed, expiresAt } });

  return { accessToken, refreshToken: raw };
}

module.exports = router;
