import mongoose from "mongoose";

const { Schema } = mongoose;

const instituteSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    pincode: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Institute = mongoose.model("Institute", instituteSchema);

export default Institute;
