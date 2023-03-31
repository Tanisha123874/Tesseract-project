const express = require("express");
const multer = require("multer");
const { createWorker } = require("tesseract.js");
const app = express();

// Set up multer storage and file filter
const storage = multer.memoryStorage();
const upload = multer({ storage: storage, fileFilter: imageFilter });

// Filter function to only accept image files
function imageFilter(req, file, cb) {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("Only image files are allowed!"));
  }
  cb(null, true);
}

// Set up Tesseract.js worker
const worker = createWorker({});

// Function to extract text from image using Tesseract.js
async function extractTextFromImage(imageBuffer) {
  await worker.load();
  await worker.loadLanguage("eng");
  await worker.initialize("eng");
  const {
    data: { text },
  } = await worker.recognize(imageBuffer);
  await worker.terminate();
  return { text };
}

// Route to handle image uploads and return JSON response
app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const json = await extractTextFromImage(req.file.buffer);
    res.json(json);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error processing image." });
  }
});

// Serve the index.html file
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// Start the server
app.listen(6000, () => {
  console.log("Server listening on port 6000");
});
