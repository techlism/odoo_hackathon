import mongoose from "mongoose";

const { Schema } = mongoose;

const versionSchema = new Schema({
  paper_url: {
    type: String,
    required: true,
  },
  upload_time: {
    type: Date,
    default: Date.now,
  },
});

const paperSchema = new Schema(
  {
    paper_name: {
      type: String,
      required: true,
    },
    paper_code: {
      type: String,
      required: true,
    },
    institute_id: {
      type: Schema.Types.ObjectId,
      ref: "Institute",
      required: true,
    },
    examiner_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    invigilators: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      required: true,
    },
    papers: [versionSchema],
    access_time_start: {
      type: Date,
      required: true,
    },
    access_time_end: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const Paper = mongoose.model("Paper", paperSchema);
export default Paper;
