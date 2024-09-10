const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userCodesSchema = new Schema(
  {
    uid: {
      type: String,
      required: true,
    },
    userCode: {
      type: String,
      required: true,
      index:true
    },
    phone: {
      type: String,
      required: true,
    },
     isAuth: {
      type: Boolean,
      required: false,
    },
     fcmToken: {
      type: String,
      required: false,
    },
    userType: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: false,
    },
    userName: {
      type: String,
      required: false,
    },
    firstname: {
      type: String,
      required: false,
    },
    lastname: {
      type: String,
      required: false,
    },
    dpURL: {
      type: String,
      required: false,
    },
    aadhaarVerifiedStatus: {
      type: Boolean,
      required: false,
      default:false
    },
    otp: {
      otp: { type: String, required: false },
      expiry: {
        type: String,
        required: false,
      },
      _id: false,
    },
  
    title: [
      {
        _id: {
          type: String,
          required: false,
        },
        value: {
          type: String,
          required: false,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('userCodesList',userCodesSchema,'userCodesList');