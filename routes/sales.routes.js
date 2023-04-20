const router = require("express").Router();
const salesController = require("../controllers/sales.controllers");
const { validateToken } = require("../middlewares/validateAuth");

router.post(
  "/createSite",
  validateToken,
  salesController.createSalesSite
);

router.get(
  "/getSite",
  validateToken,
  salesController.getSalesSite
);

module.exports = router;
