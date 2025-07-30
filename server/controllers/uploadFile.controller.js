import { uploadfile as cloudinaryUpload } from "../utilities/cloudinary.utils.js";
import { apiResponse } from "../utilities/apiResponse.js";

export const uploadFile = async (req, res, next) => {
  try {
    // console.log(req.files)
    const file = req.files?.docs?.[0];
    if (!file) {
      return res
        .status(400)
        .json(new apiResponse(400, null, "No file uploaded"));
    }
    

    const cloudinaryResponse = await cloudinaryUpload(file.path);
    if (!cloudinaryResponse) {
      return res
        .status(500)
        .json(new apiResponse(500, null, "Cloudinary upload failed"));
    }

    const format = cloudinaryResponse.format?.toLowerCase();

    const imageFormats = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'tiff'];
    const videoFormats = ['mp4', 'mov', 'avi', 'mkv', 'webm', 'ogg'];

    let messageType = 'file'; // default

    if (imageFormats.includes(format)) {
      messageType = 'image';
    } else if (videoFormats.includes(format)) {
      messageType = 'video';
    }
    // console.log(messageType)
    // console.log(cloudinaryResponse)

    return res.status(200).json(
      new apiResponse(200, {
        url: cloudinaryResponse.secure_url,
        fileName: file.originalname,
        messageType,
      })
    );
  } catch (err) {
    console.error("Upload Error:", err);
    return res
      .status(500)
      .json(new apiResponse(500, null, "Internal Server Error"));
  }
};
