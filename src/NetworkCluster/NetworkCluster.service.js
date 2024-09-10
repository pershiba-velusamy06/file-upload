
const { readFile, utils } = require('xlsx');
const networkCluster = require('../../models/PershibaExcel.js');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const networkClusterService = {}

networkClusterService.createNetworkCluster = async (body, files) => {

    await networkClusterService.clusterValidator(body, files)
    const file = files.networkClusterDetails[0];
    const filePath = file.filepath;
    if (!filePath) {
        throw new Error('No files uploaded or invalid file path.');
    }
    const workbook = readFile(filePath);
    const networkClusterDetailssheetData = await utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { raw: false, dateNF: 'yyyy-mm-dd' });

    let getFormatedClusterData = await networkClusterService.formClusterData(networkClusterDetailssheetData)
    await networkClusterService.networkCLusterExist(getFormatedClusterData)
    getFormatedClusterData["networkClusterCode"] = new ObjectId();
    getFormatedClusterData["userType"] = "networkCluster";
    let networkData = await networkClusterService.InsertNetworkCluster(getFormatedClusterData)
    return networkData
}

networkClusterService.InsertNetworkCluster = async (data) => {
    const clusterCreatedData = await networkCluster.create(data)
    const resultObject = {
        networkClusterCode: clusterCreatedData.networkClusterCode,
        name: clusterCreatedData.name,
        logo: clusterCreatedData.logo,
        location: {
            city: clusterCreatedData.location.city,
            state: clusterCreatedData.location.state,
            country: clusterCreatedData.location.country,
            latitude: clusterCreatedData.location.latitude,
            longitude: clusterCreatedData.location.longitude,
        },
        email: clusterCreatedData.email,
        phone: clusterCreatedData.phone,
        countryCode: clusterCreatedData.countryCode,
        username: clusterCreatedData.username,
        userType: clusterCreatedData.userType
    }
    return resultObject
}
networkClusterService.clusterValidator = async (body, files) => {
    if (Object.keys(body).length > 0 || Object.keys(files).length != 1 || !files.networkClusterDetails) {
        throw new Error('Invalid or Extra Keys/file Passed');
    } else if (files.networkClusterDetails.length !== 1) {
        throw new Error('Only one file Upload is allowed');
    }
}

networkClusterService.networkCLusterExist = async (data) => {
    const networkExist = await networkCluster.findOne({
        $or: [
            { email: data.email },
            { username: data.username }
        ]
    })
    if (networkExist) {
        if (networkExist.username === data.username) {
            throw new Error('Network cluster already exist with the same username');
        } else {
        } throw new Error('Network cluster already exist with the same email');
    }

}

networkClusterService.formClusterData = async (data) => {
    let actualFeilds = {
        name: '',
        logo: '',
        username: '',
        phone: '',
        countryCode: "",
        email: '',
        location: {
            city: '',
            state: '',
            country: '',
            latitude: '',
            longitude: ''
        },
    }
    const fieldMapping = {
        'NetworkCluster Name': 'name',
        'NetworkCluster Logo': 'logo',
        'NetworkCluster Username': 'username',
        'NetworkCluster Country Code': 'countryCode',
        'NetworkCluster Official Phone': 'phone',
        'NetworkCluster Official Email': 'email',
        'NetworkCluster Location.city': 'location.city',
        'NetworkCluster Location.state': 'location.state',
        'NetworkCluster Location.country': 'location.country',
        'NetworkCluster Location.latitude': 'location.latitude',
        'NetworkCluster Location.longitude': 'location.longitude'
    };
    await networkClusterService.DataValidator(fieldMapping, data)

    for (const element of data) {
        const field = element.Fields;
        const value = element.Values;
        const property = fieldMapping[field];
        if (property) {

            const keys = property.split('.');
            let obj = actualFeilds;

            for (let i = 0; i < keys.length - 1; i++) {
                obj = obj[keys[i]];
            }

            obj[keys[keys.length - 1]] = value;
        }
    }
    const { name, logo, username, phone, email, location, countryCode } = actualFeilds;

    networkClusterService.validateStringLength(name, "NetworkCluster Name", 3);
    networkClusterService.validateStringLength(username, "NetworkCluster Username", 3);
    networkClusterService.validateNoWhiteSpace(username, "NetworkCluster Username");
    networkClusterService.stringIsAValidUrl(logo, "NetworkCluster Logo");
    networkClusterService.validatePhoneNumber(phone, "NetworkCluster Official Phone");
    networkClusterService.validateEmailFormat(email, "NetworkCluster Official Email");
    networkClusterService.validateNumberRange(location.latitude, "NetworkCluster Location.latitude", -90, 90);
    networkClusterService.validateNumberRange(location.longitude, "NetworkCluster Location.longitude", -180, 180);
    networkClusterService.validateCountryCode(countryCode);
    networkClusterService.validateStringLength(location.country, 'NetworkCluster Location.country', 3)

    return actualFeilds

}

networkClusterService.DataValidator = async (fieldMapping, data) => {
    const requiredFields = new Set(Object.keys(fieldMapping));
    const fieldPresence = new Map();
    const invalidFields = new Set();
    for (const element of data) {
        const field = element.Fields;

        if (requiredFields.has(field)) {
            fieldPresence.set(field, true);
        } else {
            invalidFields.add(field);
        }
    }
    if (invalidFields.size > 0) {
        throw new Error(`Invalid fields provided: ${Array.from(invalidFields).join(', ')}`);
    }

    for (const field of requiredFields) {
        fieldPresence.set(field, false);
    }

    for (const element of data) {
        const field = element.Fields;
        if (fieldPresence.has(field)) {
            fieldPresence.set(field, true);
        }
    }

    const missingFields = [];
    for (const [field, isPresent] of fieldPresence) {
        if (!isPresent) {
            missingFields.push(field);
        }
    }

    if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

}

networkClusterService.validateCountryCode = (code) => {
    if (typeof code !== 'string' || code.charAt(0) !== '+' || !/^\+\d+$/.test(code) || code.length < 2 || code.length > 4) {
        throw new Error(`Invalid NetworkCluster Country Code ${code}`);
    }
}

networkClusterService.validatePhoneNumber = (phoneNumber) => {
    if (typeof phoneNumber !== 'string' || !/\d+$/.test(phoneNumber) || phoneNumber.length < 7 || phoneNumber.length > 16) {
        throw new Error(`Invalid phone ${phoneNumber}`);
    }

}

networkClusterService.validateNumberRange = (value, field, minValue, maxValue) => {
    if (!networkClusterService.isNumeric(value) || value < minValue || value > maxValue) {
        throw new Error(`${field} to be a number, minimum ${minValue} and maximum ${maxValue} with or without decimal numbers`);
    }
}

networkClusterService.isNumeric = (str) => {
    if (typeof str != "string") return false;
    return !isNaN(str) &&
        !isNaN(parseFloat(str));
}

networkClusterService.validateNoWhiteSpace = (value, field) => {
    if (!networkClusterService.hasWhiteSpace(value)) {
        throw new Error(`${field} to have Min 3 and Max 30 characters of string without spaces`);
    }
}

networkClusterService.hasWhiteSpace = (str) => {
    return (str && !(/\s/g.test(str))) ? true : false;
}

networkClusterService.validateEmailFormat = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]*[a-zA-Z][^\s@]*$/;
    if (!networkClusterService.isString(value) || !emailRegex.test(value)) {
        throw new Error('Network Official Email Id is not in the desired format');
    }
}

networkClusterService.validateStringLength = (value, field, minLength) => {
    if (!networkClusterService.isString(value) || value.length < minLength) {
        throw new Error(`${field} to have Min ${minLength} of string`);
    }
};
networkClusterService.validateOptionalStringLength = (value, field, maxLength) => {
    if ((typeof value != "string") || (maxLength && value.length > maxLength)) {
        throw new Error(`${field} to have Max ${(maxLength) || 'unlimited'} characters of string`);
    }
}
networkClusterService.stringIsAValidUrl = (str) => {
    const res = str.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/g);
    return (res !== null);
};

networkClusterService.isString = (str) => {
    return (str && (typeof str == "string") && isNaN(str));
};


module.exports = networkClusterService;