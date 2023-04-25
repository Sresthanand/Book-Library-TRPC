const multer = require("multer");
const storage = multer.memoryStorage();

const upload = multer({ storage: storage });
console.log("multer middleware is running");

module.exports = upload;
