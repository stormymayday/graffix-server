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
