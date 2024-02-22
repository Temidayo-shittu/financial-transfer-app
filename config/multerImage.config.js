const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
	filename: function (req, file, callback) {
		callback(null, Date.now() + file.originalname);
	},
});

function checkFileType(file, cb) {
	const filetypes = /jpeg|jpg|png/;
	const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
	const mimetype = filetypes.test(file.mimetype);
	// if (!mimetype && !extname) {
	if (!mimetype) {
		return cb(new Error("Error: Image file Only!"));
	}
	return cb(null, true);
}

const upload = multer({
	storage,
	limits: { fileSize: 20000000 }, //20mb
	fileFilter: function (req, file, cb) {
		checkFileType(file, cb);
	},
});

module.exports = { upload };
