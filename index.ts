import express, { Request, Response } from 'express';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

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
  // log body
  console.log(req.body);
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const file = req.file;
  console.log(file);
  const targetFormat = 'mp3'; // Adjust as needed
  const outputPath = `converted-${Date.now()}.${targetFormat}`;

  /*
  ffmpeg(fs.createReadStream(file.path))
    .toFormat(targetFormat)
    .on('error', (err: Error) => {
      console.error('An error occurred: ' + err.message);
      res.status(500).send('Conversion error');
    })
    .on('end', async () => {
      console.log('Conversion finished');

      // Upload to S3
      const bucketName = process.env.AWS_S3_BUCKET;
      const key = path.basename(outputPath);

      try {
        const data = await s3Client.send(new PutObjectCommand({
          Bucket: bucketName,
          Key: key,
          Body: fs.createReadStream(outputPath),
        }));
        console.log('Upload Success', data);

        // Clean up local files
        fs.unlinkSync(file.path);
        fs.unlinkSync(outputPath);

        res.send({ message: 'File converted and uploaded successfully' });
      } catch (err) {
        console.error('Upload error:', err);
        res.status(500).send('Upload error');
      }
    })
    .saveToFile(outputPath);
    */
   res.send({ message: 'File converted and uploaded successfully' });
});

const port = process.env.PORT || 1337;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
