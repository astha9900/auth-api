const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const { authenticate, requireRole } = require("../middleware/authenticate");

const prisma = new PrismaClient();

// Admin: list all users
router.get("/", authenticate, requireRole("ADMIN"), async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    });
    res.json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
});

// Get own profile or admin can get any
router.get("/:id", authenticate, async (req, res, next) => {
  try {
    if (req.params.id !== req.user.id && req.user.role !== "ADMIN") {
      return res.status(403).json({ success: false, error: "Forbidden" });
    }
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
    if (!user) return res.status(404).json({ success: false, error: "User not found" });
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
});

// Update own profile
router.patch("/:id", authenticate, async (req, res, next) => {
  try {
    if (req.params.id !== req.user.id && req.user.role !== "ADMIN") {
      return res.status(403).json({ success: false, error: "Forbidden" });
    }
    const { name } = req.body;
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { name },
      select: { id: true, name: true, email: true, role: true },
    });
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
});

// Admin: delete user
router.delete("/:id", authenticate, requireRole("ADMIN"), async (req, res, next) => {
  try {
    await prisma.user.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
