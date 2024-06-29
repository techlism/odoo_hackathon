import { Router } from "express";
import { createPaperWithFileUpload,downloadDecryptedPaper } from "../controllers/paperController.js";
import { checkUserAuthentication } from "../middleware/Auth.js";

const router = Router();

// Routes
router.post("/create-paper",checkUserAuthentication, createPaperWithFileUpload);
router.get("/download-paper",checkUserAuthentication, downloadDecryptedPaper);
export default router;