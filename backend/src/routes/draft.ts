import { Router } from "express";
import { verifyFirebaseToken } from "../middlewares/verifyFirebaseToken";
import { authorizeRole } from "../middlewares/authorizeRole";
import {
  saveDraft,
  getDraft,
  deleteDraft,
  getSellerDrafts,
} from "../controllers/productDraft";

const router = Router();

// All routes require seller role
router.use(verifyFirebaseToken);
router.use(authorizeRole(["seller"]));

router.post("/save", saveDraft);
router.get("/", getSellerDrafts);
router.get("/:productId", getDraft);
router.delete("/:productId", deleteDraft);

export default router;

