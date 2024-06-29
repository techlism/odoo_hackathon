import { Router } from "express";
import { createPaperWithFileUpload,downloadDecryptedPaper,updatePaperWithFileUpload,updatePaperDetails,getAllPapers,getPapersOfExaminer,getPapersOfInvigilator } from "../controllers/paperController.js";
import { checkUserAuthentication } from "../middleware/Auth.js";

const router = Router();

// Routes
router.post("/create-paper",checkUserAuthentication, createPaperWithFileUpload);
router.get("/download-paper",checkUserAuthentication, downloadDecryptedPaper);
router.put("/update-paper",checkUserAuthentication, updatePaperWithFileUpload);
router.put("/update-paper-details/:paper_id",checkUserAuthentication, updatePaperDetails);
router.get("/papers",checkUserAuthentication, getAllPapers);
router.get("/papers-of-examiner",checkUserAuthentication, getPapersOfExaminer);
export default router;