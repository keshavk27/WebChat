import dotenv from "dotenv";
dotenv.config();

import { v2 as cloudinary } from 'cloudinary';
import fs from "fs" 
import path from 'path';

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});


const uploadfile = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const filePath = path.resolve(localFilePath);

    // Infer extension
    const ext = path.extname(filePath).toLowerCase();

    // Decide resource_type based on extension
    let resourceType = "auto";
    const rawExtensions = ['.pdf', '.doc', '.docx', '.txt', '.zip', '.csv', '.xls', '.xlsx'];

    if (rawExtensions.includes(ext)) {
      resourceType = "raw"; // tell Cloudinary to treat it as raw file
    }

    const response = await cloudinary.uploader.upload(filePath, {
      resource_type: resourceType,
    });

    // Clean up local file
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return response;

  } catch (error) {
    console.error("Cloudinary upload error:", error.message);

    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return null;
  }
};
export {uploadfile}

