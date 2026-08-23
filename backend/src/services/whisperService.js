/*const fs = require("fs");
const OpenAI = require("openai");

const client = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 120000,
  maxRetries: 2
 });

async function transcribeAudio(filePath) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  const response = await client.audio.transcriptions.create({
    file: fs.createReadStream(filePath),
    model: "whisper-1"
  });

  return response.text;
}

module.exports = { transcribeAudio };*/
/*async function transcribeAudio(filePath) {
  return `
This is a sample meeting transcript for testing Recaply.

The team discussed the project development progress.

The backend API is nearly complete.

The team decided to finish frontend integration by Friday.

John will complete the backend testing.

Sarah will prepare the project documentation by Friday.

The team will review the final project before submission.
`;
}

module.exports = { transcribeAudio };*/


/*const fs = require("fs");
const path = require("path");
const { execFile } = require("child_process");
const { promisify } = require("util");

const execFileAsync = promisify(execFile);

const WHISPER_EXE =
  "D:\\Recaply\\whisper\\whisper-cpp-win32-x64-cpu.exe";

const WHISPER_MODEL =
  "D:\\Recaply\\whisper\\models\\ggml-base.en.bin";

async function transcribeAudio(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Audio file not found: ${filePath}`);
  }

  if (!fs.existsSync(WHISPER_EXE)) {
    throw new Error(`Whisper executable not found: ${WHISPER_EXE}`);
  }

  if (!fs.existsSync(WHISPER_MODEL)) {
    throw new Error(`Whisper model not found: ${WHISPER_MODEL}`);
  }

  const outputDir = path.dirname(filePath);
  const baseName = path.basename(filePath, path.extname(filePath));

  const wavPath = path.join(outputDir, `${baseName}.wav`);
  const transcriptBase = path.join(outputDir, `${baseName}-transcript`);

  console.log("Converting audio to WAV...");

  await execFileAsync("ffmpeg", [
    "-y",
    "-i", filePath,
    "-ar", "16000",
    "-ac", "1",
    "-c:a", "pcm_s16le",
    wavPath
  ]);

  console.log("Running local Whisper transcription...");

  await execFileAsync(WHISPER_EXE, [
    "-m", WHISPER_MODEL,
    "-f", wavPath,
    "-l", "en",
    "-nt",
    "-otxt",
    "-of", transcriptBase
  ]);

  const transcriptPath = `${transcriptBase}.txt`;

  if (!fs.existsSync(transcriptPath)) {
    throw new Error("Whisper did not generate a transcript file");
  }

  const transcript = fs.readFileSync(transcriptPath, "utf8").trim();

  if (!transcript) {
    throw new Error("Whisper returned an empty transcript");
  }

  return transcript;
}

module.exports = { transcribeAudio };*/

const fs = require("fs");
const path = require("path");
const { execFile } = require("child_process");
const { promisify } = require("util");

const execFileAsync = promisify(execFile);

const WHISPER_EXE =
  "D:\\Recaply\\whisper\\whisper-cpp-win32-x64-cpu.exe";

const FFMPEG_EXE =
  "D:\\ffmpeg\\ffmpeg-9.0.1-essentials_build\\bin\\ffmpeg.exe";

const WHISPER_MODEL =
  "D:\\Recaply\\whisper\\models\\ggml-base.en.bin";

async function transcribeAudio(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Audio file not found: ${filePath}`);
  }

  if (!fs.existsSync(FFMPEG_EXE)) {
    throw new Error(`FFmpeg executable not found: ${FFMPEG_EXE}`);
  }

  if (!fs.existsSync(WHISPER_EXE)) {
    throw new Error(`Whisper executable not found: ${WHISPER_EXE}`);
  }

  if (!fs.existsSync(WHISPER_MODEL)) {
    throw new Error(`Whisper model not found: ${WHISPER_MODEL}`);
  }

  const outputDir = path.dirname(filePath);
  const baseName = path.basename(filePath, path.extname(filePath));

  const wavPath = path.join(outputDir, `${baseName}.wav`);
  const transcriptBase = path.join(outputDir, `${baseName}-transcript`);

  console.log("Converting audio to WAV...");

  await execFileAsync(FFMPEG_EXE, [
    "-y",
    "-i", filePath,
    "-ar", "16000",
    "-ac", "1",
    "-c:a", "pcm_s16le",
    wavPath
  ]);

  console.log("Running local Whisper transcription...");

  await execFileAsync(WHISPER_EXE, [
    "-m", WHISPER_MODEL,
    "-f", wavPath,
    "-l", "en",
    "-nt",
    "-otxt",
    "-of", transcriptBase
  ]);

  const transcriptPath = `${transcriptBase}.txt`;

  if (!fs.existsSync(transcriptPath)) {
    throw new Error("Whisper did not generate a transcript file");
  }

  const transcript = fs.readFileSync(transcriptPath, "utf8").trim();

  if (!transcript) {
    throw new Error("Whisper returned an empty transcript");
  }

  return transcript;
}

module.exports = { transcribeAudio };