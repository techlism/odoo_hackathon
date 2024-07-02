import { Router } from "express";
import { createPaperWithFileUpload,downloadDecryptedPaper,updatePaperWithFileUpload,updatePaperDetails,getAllPapers,getPapersOfExaminer,getPapersOfInvigilator } from "../controllers/paperController.js";
import { checkUserAuthentication } from "../middleware/Auth.js";

const router = Router();

// Routes
router.post("/create-paper",checkUserAuthentication, createPaperWithFileUpload);
router.get("/download-paper/:encryptedFileName/:paper_id",checkUserAuthentication, downloadDecryptedPaper);
router.put("/update-paper/:paper_id",checkUserAuthentication, updatePaperWithFileUpload);
router.put("/update-paper-details/:paper_id",checkUserAuthentication, updatePaperDetails);
router.get("/papers",checkUserAuthentication, getAllPapers);
router.get("/papers-of-examiner",checkUserAuthentication, getPapersOfExaminer);
router.get("/papers-of-invigilator",checkUserAuthentication, getPapersOfInvigilator);
export default router;