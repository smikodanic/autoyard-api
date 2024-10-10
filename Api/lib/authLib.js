const crypto = require('crypto');


/**
 * Convert password to hash
 * @param  {string} password
 */
module.exports.pwdEncrypt = (password) => {
  // const salt = crypto.randomBytes(16).toString('hex');
  const salt = '99dcdf9f3ae0dbb4144f32ec8068bb82';
  const password_encrypted = crypto.pbkdf2Sync(password, salt, 1000, 32, `sha512`).toString(`hex`);
  return password_encrypted;
};
