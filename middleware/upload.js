const multer = require("multer");
const fs = require("fs");
const path = require("path");
const config = require("../config/env-config");

const uploadDir = path.join(__dirname, `../${config.upload.uploadDir}`);

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) cb(null, uploadDir);
        else cb(new Error("type not image"), false);
    },
    filename: (req, file, cb) => {
        const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
        cb(null, `${Date.now()}-${sanitizedName}`);
    }
});

module.exports = multer({
    storage,
    limits: { fileSize: config.upload.size_file },
    fileFilter: (req, file, cb) => {
        if (config.upload.allowedMimeTypes.includes(file.mimetype))
            cb(null, true);
        else
            cb(new Error("this file type is not allowed"), false);
    }
});