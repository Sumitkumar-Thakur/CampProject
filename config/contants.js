import dotenv from 'dotenv';

if(process.env.NODE_ENV !== "production"){
    dotenv.config();
}

export default {
    mongoProdUri: process.env.MONGO_PROD_URI,
    secretCode: process.env.SECRET_CODE,
    cloudinaryEnv: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        key: process.env.CLOUDINARY_KEY,
        secret: process.env.CLOUDINARY_SECRET,
    }
};