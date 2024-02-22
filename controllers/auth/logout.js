const RefreshToken = require('../../models/UserRefreshToken');

const logout = async (req, res, next) => {
  try {
    const userId = req.userId;
    let refreshToken = await RefreshToken.findOne({ user: userId });
    if (!refreshToken) return res.status(401).json({ status: 'fail', message: 'No active user session' });
    
    await RefreshToken.findOneAndRemove( { user: userId }, { useFindAndModify: false });
    return res.status(200).json({ status: 'success', message: 'Logged out successfully' });
  } catch (err) {
    return res.status(500).json({ status: 'fail', message: err.message });
  }
};

module.exports = { logout }