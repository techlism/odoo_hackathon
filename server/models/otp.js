// models/otpModel.js
import mongoose from 'mongoose';
import { mailSender } from '../utils/mailSender.js';

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 5, // The document will be automatically deleted after 5 minutes of its creation time
  },
});

// Define a function to send emails
async function sendVerificationEmail(email, otp) {
  try {
    const mailResponse = await mailSender(
      email,
      "Verify Your Email Address",
      `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h1 style="color: #333;">Email Verification</h1>
          <p style="font-size: 16px; color: #555;">
            Dear user,
          </p>
          <p style="font-size: 16px; color: #555;">
            Thank you for registering with us. To complete your registration, please verify your email address by entering the OTP code provided below on the verification page.
          </p>
          <div style="background-color: #f9f9f9; padding: 10px 20px; border-radius: 5px; text-align: center; margin: 20px 0;">
            <p style="font-size: 20px; font-weight: bold; color: #333;">${otp}</p>
          </div>
          <p style="font-size: 16px; color: #555;">
            If you did not initiate this request, please ignore this email. For any assistance, feel free to contact our support team.
          </p>
          <p style="font-size: 16px; color: #555;">
            Best regards,<br/>
            The Team
          </p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="font-size: 12px; color: #999; text-align: center;">
            This is an automated message. Please do not reply to this email.
          </p>
        </div>
      `
    );
    console.log("Email sent successfully: ", mailResponse);
  } catch (error) {
    console.log("Error occurred while sending email: ", error);
    throw error;
  }
}

otpSchema.pre("save", async function (next) {
  console.log("New document saved to the database");
  // Only send an email when a new document is created
  if (this.isNew) {
    await sendVerificationEmail(this.email, this.otp);
  }
  next();
});

const OTP = mongoose.model("OTP", otpSchema);

export default OTP;
