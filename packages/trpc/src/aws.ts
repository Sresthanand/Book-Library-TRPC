import dotenv from "dotenv";
import fs from "fs";
import aws from "aws-sdk";

dotenv.config();

const region = process.env.S3_REGION;
const bucketName = process.env.S3_BUCKET_NAME || "";
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKeyId = process.env.AWS_SECRET_ACCESS_KEY_ID;

aws.config.update({
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_ID,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
});

const s3 = new aws.S3();

function uploadFile(file: any) {
  const imageFile = file.image && file.image[0];
  const pdfFile = file.pdf && file.pdf[0];

  const imageUploadParams = {
    Bucket: bucketName,
    Body: imageFile ? imageFile.buffer : null,
    Key: imageFile ? imageFile.originalname : null,
    ContentType: imageFile ? imageFile.mimetype : null,
  };

  const pdfUploadParams = {
    Bucket: bucketName,
    Body: pdfFile ? pdfFile.buffer : null,
    Key: pdfFile ? pdfFile.originalname : null,
    ContentType: pdfFile ? pdfFile.mimetype : null,
  };

  return Promise.all([
    s3.upload(imageUploadParams).promise(),
    s3.upload(pdfUploadParams).promise(),
  ]);
}

export default uploadFile;
