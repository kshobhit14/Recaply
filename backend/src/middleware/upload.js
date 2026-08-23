const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "../../uploads");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  }
});

const allowed = new Set([
  "audio/mpeg", "audio/wav", "audio/x-wav", "audio/mp4",
  "audio/m4a", "audio/x-m4a", "video/mp4"
]);

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (_, file, cb) => {
    if (!allowed.has(file.mimetype)) return cb(new Error("Unsupported audio format"));
    cb(null, true);
  }
});

module.exports = upload;
