const User = require("../../models/User");
const { AppError } = require("../../utils/AppError");
const { catchAsync } = require("../../utils/catchAsync");
const { checkPermissions } = require("../../utils/checkPermissions");
const { userAge } = require("../../utils/getUserAge");
const cloudinary = require("cloudinary");
const { uploader } = cloudinary.v2;
const fileUpload = require('express-fileupload');
const fs = require('fs');

const updateUser = catchAsync(async (req, res, next) => {

	  const { id:userId } = req.params;
	  console.log(userId)
	  // Check if there is a file
		const imagesLinks = [];
  
      // Single upload
	  
      if (req.files.file) {
		console.log(req.files.file, imagesLinks)
        const singleUploadedData = await uploader.upload(req.files.file.tempFilePath, {
          folder: "user-images",
        });
        imagesLinks.push({
          public_id: singleUploadedData.public_id,
          url: singleUploadedData.secure_url,
        });
      }

      // Multiple upload
      if (req.files.files) {
        for (let i = 0; i < req.files.files.length; i++) {
          let filePath = req.files.files[i].tempFilePath;
          const uploadedData = await uploader.upload(filePath, {
            folder: "user-images",
          });
  
          imagesLinks.push({
            public_id: uploadedData.public_id,
            url: uploadedData.secure_url,
          });
        };
      };

	  const user = await User.findOne({ _id: userId });
	  if (!user) {
		return next(new AppError("User not found", 404));
	};
	checkPermissions(req.user, user._id);

		try {
			const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
				new: true,
				runValidators: true,
				useFindAndModify: false,
			});

		updatedUser.avatar = imagesLinks;
		updatedUser.age = userAge(updatedUser.date_of_birth);
		console.log(updatedUser)
	    await updatedUser.save();
		fs.unlinkSync(req.files.file.tempFilePath);

			res.status(200).json({
				status: "success",
				message: "Profile updated successfully",
				data: updatedUser,
			});
	
		} catch (err) {
			console.error("INTERNAL_SERVER_ERROR::", err.message);
				return res.status(500).json({
					status: "fail",
					message: "Internal server error",
					error: err.message,
				});
		};
	
});

module.exports = { updateUser };

