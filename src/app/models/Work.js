import mongoose from "mongoose";

const WorkSchema = new mongoose.Schema(
  {
    subject: String,
    work: String,
    deadline: String,
    fileUrl: String,
    addedBy: String,
    status: [
      {
        userId: String,
        username: String,
        email: String,
        state: { type: String, default: "not yet started" },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Work || mongoose.model("Work", WorkSchema);
