const express = require("express");
const pushSubscriptionController = require("../controllers/pushSubscriptionController");
const authMiddleware = require("../middleware/authMiddleware");
const { validationMiddleware, schemas } = require("../middleware/validationMiddleware");

const router = express.Router();

router.use(authMiddleware.verifyToken);


router.post(
  "/",
  validationMiddleware.validateRequest(schemas.pushSubscriptionSchema),
  pushSubscriptionController.createSubscription,
);
router.get("/patient/:patientId", pushSubscriptionController.getSubscriptionsByPatient);

module.exports = router;