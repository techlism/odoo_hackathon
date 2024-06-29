import express from 'express';
import multer from 'multer';
import fileUpload from 'express-fileupload';
import Paper from "../models/paper.js";
import fs from 'fs';
import path from 'path';


// Set up multer for file handling
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // specify the directory to save uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`); // specify the filename
  },
});

const upload = multer({ 
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB file size limit
}).single('paper');

// Endpoint to handle paper creation with file upload
export const createPaperWithFileUpload = (req, res) =>{

  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ success: false, message: err.message });
    } else if (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
    createPaper(req, res);
  });
}

export const createPaper = async (req, res) => {
  try {
    const { paper_name, paper_code, institute_id, examiner_id, invigilators, access_time_start, access_time_end } = req.body;
    const paperFile = req.file;

    // Assuming you want to store the file path in the database
    const paperUrl = path.join('uploads', "randomfile");

    const paper = await Paper.create({
      paper_name,
      paper_code,
      institute_id,
      examiner_id,
      invigilators, // assuming invigilators is a comma-separated string
      papers: [{ paper_url: paperUrl }],
      access_time_start,
      access_time_end,
    });

    res.status(200).json({
      success: true,
      message: "Paper created successfully",
      paper,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};



