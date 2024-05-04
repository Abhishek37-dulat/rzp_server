import express from "express";
import PaymentController from "../controller/paymentController";
import AuthMiddleWare from "../middleware/userauth";

const router = express.Router();

router.get("/premium", AuthMiddleWare.auth, PaymentController.purchase);
router.post(
  "/updatepremium",
  AuthMiddleWare.auth,
  PaymentController.updatePurchase
);
router.post(
  "/updatepremiumfailed",
  AuthMiddleWare.auth,
  PaymentController.updatePurchaseFailed
);

export default router;
