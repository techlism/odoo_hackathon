import mongoose from "mongoose";
import { Schema } from "mongoose";

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
        enum: ["examiner","admin","invigilator"],
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