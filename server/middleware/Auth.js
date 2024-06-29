import pkg from "jsonwebtoken";
const { verify } = pkg;
import User from "../models/user.js";

export const checkUserAuthentication = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this route",
      });
    }

    const decodedData = verify(token, process.env.APPSETTING_JWT_SECRET);
    const user = await User.findById(decodedData.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
