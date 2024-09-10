const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const networkMembers = new Schema({
    networkCode: {
        type: String,
        required: true,
        index: true,
    },
    firstname: {
        type: String,
        required: false,
        default: ""
    },
    lastname: {
        type: String,
        required: false,
        default: ""
    },
    phone: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: false,
    },
    countryCode: {
        type: String,
        required: true,
    },
    sequence: {
        type: Number,
        required: true,
    },
    companyName: {
        type: String,
        required: false,
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

    userCode: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        enum: ['active', 'left'],
        required: true,
    },
},
    {
        timestamps: true
    }
);
module.exports = mongoose.model("PershibanetworkMembers", networkMembers,"PershibanetworkMembers");