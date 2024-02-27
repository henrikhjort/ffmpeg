import express, { Request, Response } from 'express';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process'; // Import exec

// Configure your AWS S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const app = express();
const upload = multer({ dest: 'uploads/' });

app.post('/convert', upload.single('file'), async (req: Request, res: Response) => {
  // Check for api key in headers.
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).send('Unauthorized');
  }
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const file = req.file;
  const fileName = req.body.fileName;
  const outputPath = `${fileName}`;

  // Construct the ffmpeg command
  const ffmpegCommand = `ffmpeg -i ${file.path} -b:a 192k -ar 44100 ${outputPath}`;

  exec(ffmpegCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return res.status(500).send('Conversion error');
    }

    // Upload to S3
    const bucketName = process.env.AWS_S3_BUCKET;
    const key = path.basename(outputPath);

    fs.readFile(outputPath, async (err, data) => {
      if (err) {
        console.error('Read file error:', err);
        return res.status(500).send('File read error');
      }

      try {
        const uploadResult = await s3Client.send(new PutObjectCommand({
          Bucket: bucketName,
          Key: key,
          Body: data,
        }));
        console.log('Upload Success', uploadResult);

        // Clean up local files
        fs.unlinkSync(file.path);
        fs.unlinkSync(outputPath);

        res.send({ message: 'File converted and uploaded successfully' });
      } catch (uploadErr) {
        console.error('Upload error:', uploadErr);
        res.status(500).send('Upload error');
      }
    });
  });
});

const port = process.env.PORT || 1337;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
