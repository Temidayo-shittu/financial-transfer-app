const bcrypt = require("bcrypt");

const hashPassword = async (password) => {
    const the_password = password ? password.trim() : "";
    try {
        const hashed = await bcrypt.hash(the_password, 10);
        return hashed;
    } catch (err) {
        throw new Error(err);
    }
};

const comparePassword = async (input_password, hashed_password) => {
    const to_be_pass = input_password ? input_password.trim() : "";
    try {
        const result = await bcrypt.compare(to_be_pass, hashed_password);
        return result;
    } catch (err) {
        throw new Error(err);
    }
};

module.exports = { hashPassword, comparePassword };
