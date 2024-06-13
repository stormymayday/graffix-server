// V1 - Start (Disk Storage Approach)
// import multer from "multer";

// const storage = multer.diskStorage({
//     destination: (req, file, callback) => {
//         // callback(null, "public/uploads");
//     },
//     filename: (req, file, callback) => {
//         const fileName = file.originalname;
//         callback(null, fileName);
//     },
// });

// const fileUpload = multer({ storage });

// export default fileUpload;
// V1 - End

// Memory Storage Approach
// Saving image as a buffer (datauri package)
import multer from "multer";
import DataParser from "datauri/parser.js";
import path from "path";

const storage = multer.memoryStorage();
const fileUpload = multer({ storage });

const parser = new DataParser();

export const formatImage = (file) => {
    // console.log(file);

    // Grabbing the file extension (requires 'path' module)
    const fileExtension = path.extname(file.originalname).toString();

    // For Cloudinary
    return parser.format(fileExtension, file.buffer).content;
};

export default fileUpload;
