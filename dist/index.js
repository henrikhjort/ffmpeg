"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_s3_1 = require("@aws-sdk/client-s3");
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const child_process_1 = require("child_process"); // Import exec
// Configure your AWS S3 client
const s3Client = new client_s3_1.S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});
const app = (0, express_1.default)();
const upload = (0, multer_1.default)({ dest: 'uploads/' });
app.post('/convert', upload.single('file'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    const file = req.file;
    console.log('File uploaded:', file);
    const targetFormat = 'mp3'; // Adjust as needed
    const outputPath = `converted-${Date.now()}.${targetFormat}`;
    // Construct the ffmpeg command
    const ffmpegCommand = `ffmpeg -i ${file.path} ${outputPath}`;
    (0, child_process_1.exec)(ffmpegCommand, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).send('Conversion error');
        }
        // Output handling
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
        // Upload to S3
        const bucketName = process.env.AWS_S3_BUCKET;
        const key = path_1.default.basename(outputPath);
        fs_1.default.readFile(outputPath, (err, data) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                console.error('Read file error:', err);
                return res.status(500).send('File read error');
            }
            try {
                const uploadResult = yield s3Client.send(new client_s3_1.PutObjectCommand({
                    Bucket: bucketName,
                    Key: key,
                    Body: data,
                }));
                console.log('Upload Success', uploadResult);
                // Clean up local files
                fs_1.default.unlinkSync(file.path);
                fs_1.default.unlinkSync(outputPath);
                res.send({ message: 'File converted and uploaded successfully' });
            }
            catch (uploadErr) {
                console.error('Upload error:', uploadErr);
                res.status(500).send('Upload error');
            }
        }));
    });
}));
const port = process.env.PORT || 1337;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
