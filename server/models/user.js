import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["examiner", "admin", "invigilator"],
      required: true,
    },
    institute_id: {
      type: Schema.Types.ObjectId,
      ref: "Institute",
      required: true,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// creating jsonwebtoken
userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.APPSETTING_JWT_SECRET, {
    expiresIn: process.env.APPSETTING_JWT_EXPIRE,
  });
};

// comparing passwords
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
