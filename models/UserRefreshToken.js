const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const { config } = require("../config/global.config");
const { model, Schema } = mongoose;

const RefreshTokenSchema = new Schema({
	token: String,
	user: { type: Schema.Types.ObjectId, ref: "user" },
	expiryDate: Date,
});

RefreshTokenSchema.statics.createRefreshToken = async function (userId) {
	try {
		let expiredAt = new Date();
		expiredAt.setSeconds(
			expiredAt.getSeconds() + parseInt(config.refreshTokenExpiresIn),
		);
		let _token = uuidv4();
		let _object = new this({
			token: _token,	
			user: userId,
			expiryDate: expiredAt.getTime(),
		});
		let refreshToken = await _object.save();
		return refreshToken.token;
	} catch (error) {
		throw error;
	}
};

RefreshTokenSchema.statics.verifyExpiration = (token) => {
	return token.expiryDate.getTime() < new Date().getTime();
};

module.exports = model("userRefreshToken", RefreshTokenSchema);
