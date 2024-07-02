import User from "../models/user.js";
import Institute from "../models/institute.js";
import { checkUserAuthentication } from "../middleware/Auth.js";
import OTP from "../models/otp.js";
import { mailSender } from "../utils/mailSender.js";
export const registerInstituteWithAdmin = async (req, res) => {
  try {
    const {
      admin_name,
      email,
      password,
      institute_name,
      address,
      pincode,
      otp,
    } = req.body;

    const checkUserPresent = await User.findOne({ email });
    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User is already registered",
      });
    }

    const institutePayload = { name: institute_name, address, pincode };

    // Check OTP
    const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
    if (response.length === 0 || otp !== response[0].otp) {
      return res.status(400).json({
        success: false,
        message: "The OTP is not valid",
      });
    }

    const institute = await Institute.create(institutePayload);
    const institute_id = institute._id;

    const userPayload = {
      name: admin_name,
      email,
      password,
      role: "admin",
      institute_id,
    };

    const user = await User.create(userPayload);
    const token = user.getJwtToken();

    res.status(200).json({
      success: true,
      message: "Admin registered successfully",
      token,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(404).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = user.getJwtToken();
    res
      .status(200)
      .json({ success: true, token, message: "User logged in successfully" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    // send institute details along with user
    const institute = await Institute.findById(user.institute_id);
    const data = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      institute: {
        institute_id: institute._id,
        name: institute.name,
        address: institute.address,
        pincode: institute.pincode,
      },
    };
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const registerNewUser = async (req, res) => {
  try {
    const { name, email, password, role, institute_id } = req.body;

    const checkUserPresent = await User.findOne({ email });
    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User is already registered",
      });
    }

    const userPayload = { name, email, password, role, institute_id };
    const user = await User.create(userPayload);
    const emailBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h1 style="color: #333;">Welcome to Our System!</h1>
          <p style="font-size: 16px; color: #555;">
            Dear ${name},
          </p>
          <p style="font-size: 16px; color: #555;">
            You have been successfully registered as a <strong>${role}</strong> in our system. Below are your login details:
          </p>
          <div style="background-color: #f9f9f9; padding: 10px 20px; border-radius: 5px; text-align: center; margin: 20px 0;">
            <p style="font-size: 16px; color: #333;"><strong>Email:</strong> ${email}</p>
            <p style="font-size: 16px; color: #333;"><strong>Password:</strong> ${password}</p>
          </div>
          <p style="font-size: 16px; color: #555;">
            Please keep this information safe and do not share it with anyone.
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
      `;
    const response = await mailSender(email, "User Registration", emailBody);

    res.status(200).json({
      success: true,
      message: `New ${role} user registered successfully`,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};

//get all invigilators
export const getAllInvigilators = async (req, res) => {
  try {
    const institute_id = req.user.institute_id;
    const invigilators = await User.find({ institute_id, role: "invigilator" });
    res.status(200).json({
      success: true,
      data: invigilators,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};




