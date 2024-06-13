// V1 - Start
// import multer from "multer";

// const storage = multer.diskStorage({
//     destination: (req, file, callback) => {
//         // callback(null, "public/uploads");
//         callback(null, "public/uploads/");
//     },
//     filename: (req, file, callback) => {
//         const fileName = file.originalname;
//         callback(null, fileName);
//     },
// });

// const fileUpload = multer({ storage });

// export default fileUpload;
// V1 - End

// Data Parser approach
import multer from "multer";
import DataParser from "datauri/parser.js";
import path from "path";

const storage = multer.memoryStorage();

const fileUpload = multer({ storage });

const parser = new DataParser();

export const formatImage = (file) => {
    const fileExtension = path.extname(file.originalname).toString();
    return parser.format(fileExtension, file.buffer).content;
};

export default fileUpload;
