import {v2 as cloudinary} from "cloudinary"
import { CloudinaryStorage } from "multer-storage-cloudinary";
import CONSTANTS from "../config/contants.js";
const { cloudinaryEnv } = CONSTANTS;

cloudinary.config({
    cloud_name: cloudinaryEnv.cloudName,
    api_key: cloudinaryEnv.key,
    api_secret: cloudinaryEnv.secret,
    secure: true,
})

export const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'Camp',
        allowedFormats: ['jpeg', 'png', 'jpg']
    } 
})

export default {
    cloudinary,
    storage
}