const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  first_name: {
    type: String,
    minlength: 3
 },
  last_name: {
    type: String,
    minlength: 3
 },
  fullname: {
    type: String,
  },
  //accountId can be google Id, facebook Id, apple Id etc.
  accountId: {
    type: String,
    default: null,
},
  email: {
    type: String,
    unique: true,
    required: [true, 'Please provide email'],
    validate: {
      validator: validator.isEmail,
      message: 'Please provide valid email',
    },
  },
  password: {
    type: String,
    required: [true, 'Please provide password and ensure its greater than 6 characters'],
    minlength: 6,
  },
  avatar: [
    {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
      _id: false
    },
  ],
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
  home_address: {
    type: String,
    default: ""
  },
  state_of_residence: {
    type: String,
    default: ""
  },
  country: {
    type: String,
    default: "nigeria"
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
  },
  date_of_birth: { 
    type: Date,
  },
  age: { 
    type: Number,
 },
  phone_number: {
    type: String
    
 },
  verification_status: {
    type: String,
    enum: ['verified', 'unverified'],
    default: "unverified"
  },
  provider: { 
    type: String,
 },
  otp: {
    type: Number,
    default: "",
},
  resetToken: {
    type: Number,
    default: "",
},
}, { timestamps: true });


module.exports = mongoose.model('user', UserSchema);
