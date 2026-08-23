const express = require("express");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");
const {
  listMeetings,
  getMeeting,
  uploadMeeting,
  deleteMeeting
} = require("../controllers/meetingController");

const router = express.Router();

router.use(auth);
router.get("/", listMeetings);
router.post("/upload", upload.single("audio"), uploadMeeting);
router.get("/:id", getMeeting);
router.delete("/:id", deleteMeeting);

module.exports = router;
