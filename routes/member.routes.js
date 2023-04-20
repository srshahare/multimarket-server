const router = require("express").Router();
const multer = require('multer');

const memberController = require("../controllers/member.controllers");
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
  memberController.updatePassword
);
router.get(
  "/getMember",
  validateToken,
  memberController.getMember
);
router.post(
    "/updateLogo",
    validateToken,
    upload.single('image'),
    memberController.updateLogo
  )

module.exports = router;
