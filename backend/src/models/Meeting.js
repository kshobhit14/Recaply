const mongoose = require("mongoose");

const actionItemSchema = new mongoose.Schema(
  {
    task: String,
    assignee: String,
    deadline: String
  },
  { _id: false }
);

const meetingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    originalFile: String,
    transcript: { type: String, default: "" },
    summary: { type: String, default: "" },
    keyPoints: [String],
    decisions: [String],
    actionItems: [actionItemSchema],
    status: {
      type: String,
      enum: ["processing", "completed", "failed"],
      default: "processing"
    },
    error: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Meeting", meetingSchema);
