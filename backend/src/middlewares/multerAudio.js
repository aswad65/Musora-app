
import multer, { memoryStorage } from "multer";

const storage = memoryStorage();

// Accept only audio files
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("audio/")) {
    cb(null, true);
  } else {
    cb(new Error("Only audio files are allowed!"), false);
  }
};

const uploadAudio = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
}).single("audio"); // Expecting a field named "audio"

export default uploadAudio;
