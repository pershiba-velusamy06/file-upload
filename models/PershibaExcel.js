const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const networkCluster = new Schema({
    // uid: {
    //     type: String,
    //     required: true
    // },
    networkClusterCode: {
        type: String,
        required: true,
        index: true,
    },
    phone: {
        type: String,
        required: true,
    },
    countryCode: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        index: true
    },
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    logo: {
        type: String,
        required: false,
    },
    location: {
        city: {
            type: String,
            required: false,
        },
        state: {
            type: String,
            required: false,
        },
        country: {
            type: String,
            required: true,
        },
        latitude: {
            type: String,
            required: true,
        },
        longitude: {
            type: String,
            required: true,
        }
    },
    userType: {
        type: String,
        enum: ["networkCluster"],
        required: true,
    },
    networksPartOf: {
        type: Array,
        default: []
    },
    adminDetails: [{
        _id: false,
        firstname: {
            type: String,
            required: false,
        },
        lastname: {
            type: String,
            required: false,
        },
        countryCode: {
            type: String,
            required: false,
        },
        phone: {
            type: String,
            required: false,
        },
        email: {
            type: String,
            required: false,
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
    }],
},
    {
        timestamps: true
    }
);
module.exports = mongoose.model("pershiba_excel", networkCluster);