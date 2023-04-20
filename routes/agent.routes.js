const router = require("express").Router();
const agentController = require("../controllers/agent.controllers");
const { validateToken } = require("../middlewares/validateAuth");

router.post(
  "/createSite",
  validateToken,
  agentController.createAgentSite
);
router.get(
  "/getSite",
  validateToken,
  agentController.getAgentSite
)

module.exports = router;
