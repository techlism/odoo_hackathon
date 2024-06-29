import { Router } from "express";
import { createPaperWithFileUpload } from "../controllers/paperController.js";
import { checkUserAuthentication } from "../middleware/Auth.js";

const router = Router();

// Routes
router.post("/create-paper",checkUserAuthentication, createPaperWithFileUpload);

export default router;