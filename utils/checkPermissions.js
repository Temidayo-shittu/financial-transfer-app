const { AppError } = require('./AppError');

const checkPermissions = (requestUser, resourceUserId)=> {
    if(requestUser.role === 'admin' || requestUser.id === resourceUserId.toString()) return
    throw new AppError("Unauthorized to access routes!!", 401);
};

module.exports = { checkPermissions };