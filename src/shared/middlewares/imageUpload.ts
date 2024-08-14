/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { RequestHandler } from "express";
import aws from "aws-sdk";
import multer from "multer";
import multerS3 from "multer-s3";
import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(`./environments/.env.${process.env.NODE_ENV}`),
});

aws.config.update({
  secretAccessKey: process.env.AWS_SECRET_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3: any = new aws.S3({});

const MIME_TYPE_MAP: any = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
  "application/pdf": "pdf",
  "video/mp4": "mp4",
};

interface FolderMapping {
  [fieldName: string]: string;
}

export const imageUpload = (folders: FolderMapping): RequestHandler => {
  const uploaders: any[] = [];

  // Create multer uploaders for each field
  Object.keys(folders).forEach((fieldName) => {
    const uploader = multer({
      storage: multerS3({
        s3,
        bucket: process.env.AWS_BUCKET as string,
        metadata(req, file, cb) {
          cb(null, { fieldName });
        },
        key(req, file, cb) {
          const folderName = folders[fieldName];
          const imageMimetype = file.mimetype.split("/");
          const fileName = `${Date.now().toString()}.${imageMimetype[1]}`;
          const key = folderName ? `${folderName}/${fileName}` : fileName;
          cb(null, key);
        },
      }),
      fileFilter(req: any, file: any, cb: any) {
        if (!file.originalname.match(/\.(JPG|jpg|jpeg|png|pdf|mp4)$/)) {
          return cb(new Error("Invalid mime type!"), false);
        }
        cb(null, true);
      },
    }).single(fieldName as string); // Use single method for each uploader

    uploaders.push(uploader);
  });

  // Combine multer uploaders into a single middleware function
  return (req, res, next) => {
    // Execute each uploader sequentially
    const uploadPromises = uploaders.map((uploader) => {
      return new Promise<void>((resolve, reject) => {
        uploader(req, res, (err: any) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    });

    Promise.all(uploadPromises)
      .then(() => next())
      .catch((err) => next(err));
  };
};
