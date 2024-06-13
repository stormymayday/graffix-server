import multer from "multer";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // callback(null, "public/uploads");
        cb(null, "public/uploads/");
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname;
        cb(null, fileName);
    },
});

const fileUpload = multer({ storage });

export default fileUpload;
