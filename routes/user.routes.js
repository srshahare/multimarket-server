const router = require("express").Router();
const multer = require('multer');

const userController = require("../controllers/user.controllers");
const { validateToken } = require("../middlewares/validateAuth");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  },
});

const upload = multer({ storage });

router.post(
  "/updatePassword",
  validateToken,
  userController.updatePassword
);

router.get(
  "/downlines",
  validateToken,
  userController.listDownlines
)

router.post(
  "/updateLogo",
  validateToken,
  upload.single('image'),
  userController.updateLogo
)

module.exports = router;
