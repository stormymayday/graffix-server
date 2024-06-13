import multer from "multer";

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        // callback(null, "public/uploads");
        callback(null, "public/uploads/");
    },
    filename: (req, file, callback) => {
        const fileName = file.originalname;
        callback(null, fileName);
    },
});

const fileUpload = multer({ storage });

export default fileUpload;
