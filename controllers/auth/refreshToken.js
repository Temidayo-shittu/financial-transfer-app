const RefreshToken = require('../../models/UserRefreshToken');
const { signAccessToken, verifyRefreshToken, signRefreshToken } = require('../../middlewares/full-auth');
const User = require('../../models/User');

const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken)
      return res
        .status(401)
        .json({ status: 'fail', message: 'Token is required' });

		const existingToken = await RefreshToken.findOne({ token: refreshToken }).exec();

    if (!existingToken) {
					return res.status(401).json({
						status: "fail",
						message: "Token not authentic please login again",
					});
    }
    
    if (existingToken) {
					await RefreshToken.findByIdAndRemove(existingToken._id, {
						useFindAndModify: false,
					}).exec();

					return res.status(401).json({
						status: "fail",
						message: "Token expired, please login again",
					});
    }
    
    const user = await User.findById(existingToken.user).exec();

    if (!user) {
      return res.status(401).json({
        status: 'fail',
        message: 'User not found',
      });
    }

    const payload = {
      role: user.role,
      email: user.email,
      id: user._id,
      name: `${user.first_name} ${user.last_name}`,
      first_name: user.first_name,
      last_name: user.last_name,
    };
    
    const accessToken = await signAccessToken(payload);

    return res.status(200).json({
      status: 'success',
      message: 'Refresh token is valid',
      access_token: accessToken,
      refresh_token: existingToken.token,
    });
  } catch (err) {
    return res.status(500).json({ status: 'fail', message: err.message });
  }
};

module.exports = { refreshToken }