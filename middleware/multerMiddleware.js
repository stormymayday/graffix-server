// import multer from "multer";

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         // callback(null, "public/uploads");
//         cb(null, "public/uploads/");
//     },
//     filename: (req, file, cb) => {
//         const fileName = file.originalname;
//         cb(null, fileName);
//     },
// });

// const fileUpload = multer({ storage });

// export default fileUpload;

import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Convert import.meta.url to a file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure the upload directory exists
const uploadDir = path.join(__dirname, "..", "public/uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname;
        cb(null, fileName);
    },
});

const fileUpload = multer({ storage });

export default fileUpload;
