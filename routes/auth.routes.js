const router = require("express").Router();
const authController = require("../controllers/auth.controllers");
const { validateToken } = require("../middlewares/validateAuth");

router.post("/signup", authController.registerUser)
router.post("/member/signup", authController.registerMember)
router.post("/login", authController.loginUser)
router.post("/member/login", authController.loginMember)
router.post("/validate", validateToken, authController.validate)
router.post("/member/validate", validateToken, authController.validateMember)

module.exports = router;