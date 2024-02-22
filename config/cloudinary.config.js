const cloudinary = require("cloudinary");

const { config, uploader } = cloudinary.v2;

const dotenv = require("dotenv");

dotenv.config();

const cloudinaryConfig = () => {
	config({
		cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
		api_key: process.env.CLOUDINARY_API_KEY,
		api_secret: process.env.CLOUDINARY_API_SECRET,
	});
};

module.exports = { cloudinaryConfig };