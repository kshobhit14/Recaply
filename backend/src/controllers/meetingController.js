const fs = require("fs");
const Meeting = require("../models/Meeting");
const { transcribeAudio } = require("../services/whisperService");
const { summarizeTranscript } = require("../services/llmService");

async function listMeetings(req, res) {
  const meetings = await Meeting.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .select("-transcript");
  res.json(meetings);
}

async function getMeeting(req, res) {
  const meeting = await Meeting.findOne({ _id: req.params.id, user: req.user._id });
  if (!meeting) return res.status(404).json({ message: "Meeting not found" });
  res.json(meeting);
}

async function uploadMeeting(req, res) {
  if (!req.file) return res.status(400).json({ message: "Audio file is required" });

  const title = req.body.title || req.file.originalname.replace(/\.[^/.]+$/, "");
  const meeting = await Meeting.create({
    user: req.user._id,
    title,
    originalFile: req.file.originalname,
    status: "processing"
  });

  try {
    const transcript = await transcribeAudio(req.file.path);
    const ai = await summarizeTranscript(transcript);

    meeting.transcript = transcript;
    meeting.summary = ai.summary || "";
    meeting.keyPoints = ai.keyPoints || [];
    meeting.decisions = ai.decisions || [];
    meeting.actionItems = ai.actionItems || [];
    meeting.status = "completed";
    await meeting.save();

    //fs.unlink(req.file.path, () => {});
    res.status(201).json(meeting);
  } catch (error) {
    console.error("Meeting processing error:", error);
    console.error("Error details:", {
        message: error.message,
        name: error.name,
        status: error.status,
        code: error.code
    });
    meeting.status = "failed";
    meeting.error = error.message;
    await meeting.save();
    //fs.unlink(req.file.path, () => {});
    res.status(500).json({ message: error.message, meetingId: meeting._id });
  }
}

async function deleteMeeting(req, res) {
  const meeting = await Meeting.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!meeting) return res.status(404).json({ message: "Meeting not found" });
  res.json({ message: "Meeting deleted" });
}

module.exports = { listMeetings, getMeeting, uploadMeeting, deleteMeeting };
