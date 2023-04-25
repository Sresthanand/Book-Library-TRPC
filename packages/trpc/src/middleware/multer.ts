import multer from "multer";
const storage = multer.memoryStorage();

const upload = multer({ storage: storage });
console.log("multer middleware is running");

export default upload;
