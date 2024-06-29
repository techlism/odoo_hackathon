import express from "express";
import multer from "multer";
import Paper from "../models/paper.js";
import fs from "fs";
import path from "path";
import { addWatermark } from "../utils/addWatermark.js";
import encryptFile from "../utils/encryptPDF.js";
import decryptFile from "../utils/decryptPDF.js";

// Set up multer for file handling

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}
if (!fs.existsSync("downloads")) {
  fs.mkdirSync("downloads");
}

const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB file size limit
}).single("paper");

// Endpoint to handle paper creation with file upload
export const createPaperWithFileUpload = (req, res) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ success: false, message: err.message });
    } else if (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
    createPaper(req, res);
  });
};

export const createPaper = async (req, res) => {
  try {
    const {
      paper_name,
      paper_code,
      institute_id,
      examiner_id,
      invigilators,
      access_time_start,
      access_time_end,
    } = req.body;
    const paperFile = req.file;

    // Get the byte array of the file
    const fileBytes = paperFile.buffer;

    // Add watermark
    const watermarkedBytes = await addWatermark(fileBytes, "TEST SECURE 2024");

    // Encrypt file with watermark
    const encryptedFileName = `${Date.now()}-${paperFile.originalname}.enc`;
    const encryptedFilePath = path.join("uploads", encryptedFileName);
    encryptFile(watermarkedBytes, encryptedFilePath, "password1234");

    // Save the paper details to the database
    const paper = await Paper.create({
      paper_name,
      paper_code,
      institute_id,
      examiner_id,
      invigilators, // assuming invigilators is a comma-separated string
      papers: [{ paper_url: encryptedFileName }],
      access_time_start,
      access_time_end,
    });

    res.status(200).json({
      success: true,
      message: "Paper created successfully",
      paper,
      encryptedFilePath,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const downloadDecryptedPaper = async (req, res) => {
  const { encryptedFileName, paper_id } = req.body;

  try {
    console.log(encryptedFileName);
    // if paper is not found return
    const paper = await Paper.findById(paper_id);
    if (!paper) {
      return res.status(404).json({
        success: false,
        message: "Paper not found",
      });
    }
    // if not in time range return encrypted file to download
    const currentTime = new Date();
    if (
      currentTime < paper.access_time_start ||
      currentTime > paper.access_time_end
    ) {
      return res.download(encryptedFileName);
    }
    const encryptedFilePath = path.join("uploads", encryptedFileName);
    const decryptedFilePath = path.join(
      "downloads",
      `${Date.now()}-decrypted.pdf`
    );

    // Decrypt the file
    decryptFile(encryptedFilePath, decryptedFilePath, "password1234");

    // Send the decrypted file to the user
    res.download(decryptedFilePath, (err) => {
      if (err) {
        console.log(err.message);
        return res.status(500).json({ success: false, error: err.message });
      }

      // Optionally, delete the decrypted file after sending it to the user
      fs.unlinkSync(decryptedFilePath);
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// function to update paper when again reuploading the paper
// export const updatePaper = async (req, res) => {
  
// };