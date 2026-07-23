import multer from "multer";
import path from "path";
import fs from "fs";

// Create uploads folder if it doesn't exist
if (!fs.existsSync("uploads")) {
    fs.mkdirSync("uploads");
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },

    filename: (req, file, cb) => {
        const uniqueName =
            Date.now() + path.extname(file.originalname);

        cb(null, uniqueName);
    },
});

const upload = multer({
    storage,
    limits: {
        fileSize: 100 * 1024 * 1024, // 100 MB
    },
}).single("file");

export default upload;