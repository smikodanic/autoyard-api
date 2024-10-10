/***** PRE HOOKS ****/
const authLib = require('../../lib/authLib');


/**
 * Crypt the password before save.
 * --- CAUTION --> Do NOT use the arrow function because this. will not work. ---
 * @param {any} next
 */
module.exports.cryptPasswd = function (next) {
  const passEncrypted = authLib.pwdEncrypt(this.password);
  this.set({ password: passEncrypted }); // patch the document's property
  next();
};
