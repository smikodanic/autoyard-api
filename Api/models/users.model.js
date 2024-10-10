const mongoose = require('mongoose');
const CommonMethods = require('./mutual/CommonMethods.js');
const options = require('./mutual/options');
const vText = require('./validators/validateText.js');
const vResource = require('./validators/validateResource.js');
const pre_users = require('./middlewares/pre_users');
const post_users = require('./middlewares/post_users');



class Users extends CommonMethods {

  constructor() {
    super();
    this.initSchemaModel();
  }


  initSchemaModel() {
    const collection = 'users';

    /*** SCHEMA ***/
    const opts = { ...options, collection };
    const schema = new mongoose.Schema({
      first_name: { type: String, required: 'First name is required' },
      last_name: { type: String, required: 'Last name is required' },
      address: String,
      city: String,
      country: String,

      phone: String,
      email: { type: String, required: 'Email is required.', index: { name: 'email', unique: true } },
      website: String,

      username: { type: String, required: 'Username is required', index: { name: 'username', unique: true } },
      password: { type: String, required: 'Password is required' },

      role: { type: String, enum: ['admin', 'developer', 'customer'], default: 'customer' },
      is_active: { type: Boolean, default: false }, // disable login
    }, opts);


    /*** MIDDLEWARES (pre & post hooks) ***/
    // schema.pre('save', pre_users.cryptPasswd);
    // schema.pre('update', pre_users.cryptPasswd);
    // schema.pre('findOneAndUpdate', pre_users.cryptPasswd);
    // schema.post('deleteOne', { document: true }, post_users.afterUserDelete);


    /*** VALIDATORS [activated on doc.save() or doc.validate()] ***/
    schema.path('email').validate(vResource.emailCheck, 'Email is not valid.');
    schema.path('username').validate(vText.hasLengthBetween(4, 21), '{PATH} must contain from 4 to 21 characters.');
    // schema.path('password').validate(vText.hasLengthBetween(5, 13), '{PATH} must contain from 5 to 13 characters.');


    /*** MODEL ***/
    this.model = mongoose.model(`${collection}MD`, schema);
  }


}



module.exports = new Users();
