const cloudinary = require("cloudinary").v2;        //cloudinary is a cloud which we use to store the images url and filename
const { CloudinaryStorage } = require("multer-storage-cloudinary"); 

cloudinary.config({     //initalizing the cloud with the cloud credentials
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {       //The data must be stored in the wanderlust_DEV folder only
        folder: "wanderlust_DEV",
        allowedFormats: ["png", "jpg", "jpeg"],
    },
})

module.exports = {
    cloudinary,
    storage,
}