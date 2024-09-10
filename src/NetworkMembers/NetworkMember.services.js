const { readFile, write, utils } = require('xlsx');
const userCodesList = require('../../models/userCodesList');
const PershibanetworkMembers = require('../../models/PershibanetworkMembers');
const titlesList = require('../../models/titlesList');
const fs = require('fs');
const path = require('path');
const networkMemberService = {}

networkMemberService.createMemberCluster = async (body, files) => {
    console.log(body,"body")
    await networkMemberService.memberValidator(body, files)
    const file = files.networkMemberList[0];
    const filePath = file.filepath;
    if (!filePath) {
        throw new Error('No files uploaded or invalid file path.');
    }
    const workbook = readFile(filePath);
    const networkMembersheetData = await utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { raw: false, dateNF: 'yyyy-mm-dd' });

    let getFormatedMemberData = await networkMemberService.formMemberData(networkMembersheetData, body.networkCode)
    // console.log(getFormatedMemberData, "getFormatedMemberData")
    const { existingMembers, nonExistingMembers } = await networkMemberService.ArraySeperation(getFormatedMemberData)
    let excel = await networkMemberService.createSheet(existingMembers)

    let createMember = await networkMemberService.addMember(nonExistingMembers)
    console.log(createMember)
    if (createMember) {
        return [{ networkMembersRejectedDataURL: excel }]
    }
}

networkMemberService.addMember = async (data) => {
  //  console.log(data,"nonExistingMembers")
    let members = await PershibanetworkMembers.create(data)
    return members
}

networkMemberService.createSheet = async (data) => {
    if (data.length > 0) {
        let workbook = utils.book_new();
        let ws = utils.json_to_sheet(data);
        utils.book_append_sheet(workbook, ws, "Results");
        const sheetDataBuffer = write(workbook, { bookType: 'xlsx', type: 'buffer', bookSST: false });
    
        const filename = `results_${Date.now()}.xlsx`;
        const uploadDir = path.join(__dirname, 'upload', 'files'); 
        const filepath = path.join(uploadDir, filename);

      
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

     
        fs.writeFileSync(filepath, sheetDataBuffer);

   
        return `/files/${filename}`;
    } else {
        return ""
    }
}

networkMemberService.ArraySeperation = async (getFormatedMemberData) => {
    let existingMembers = [];
    let nonExistingMembers = [];

    for (const member of getFormatedMemberData) {
        const existingMember = await PershibanetworkMembers.findOne({
            phone: member.phone,
            networkCode: member.networkCode
        });

        if (existingMember) {

            existingMembers.push(member);
        } else {

            nonExistingMembers.push(member);
        }
    }
    return {
        existingMembers, nonExistingMembers
    }
}
networkMemberService.memberValidator = async (body, files) => {
    // if (Object.keys(body).length !== 1 || Object.keys(files).length != 1 || !files.networkMemberList) {
    //     throw new Error('Invalid or Extra Keys/file Passed');
    // } else if (files.networkMemberList.length !== 1) {
    //     throw new Error('Only one file Upload is allowed');
    // }
}
networkMemberService.formMemberData = async (data, networkCode) => {
    console.log(networkCode)
    let actualFeilds = {
        firstname: "",
        lastname: "",
        phone: "",
        countryCode: "",
        email: "",
        userCode: "",
        title: "",
        companyName: ""

    }
    const fieldMapping = {
        "First Name": "firstname",
        "Last Name": "lastname",
        "Country Code": "countryCode",
        "Phone Number": "phone",
        "Official Email": "email",
        "Title": "title",
        "Company Name": "companyName"


    };
    let memberData = Promise.all(data.map(async item => {
        const mappedObject = { ...actualFeilds };
        for (const [key, value] of Object.entries(fieldMapping)) {
            if (item[key]) {
                mappedObject[value] = item[key].trim();;
            }
        }
        mappedObject.userCode = await networkMemberService.fetchUserCodeByPhone(`${mappedObject.countryCode}${mappedObject.phone}`);
        mappedObject.networkCode = networkCode
        mappedObject.sequence = -1
        mappedObject.status = 'active'
        mappedObject.title = await networkMemberService.fetchTitle(mappedObject.title)
        return mappedObject;
    }));
    return memberData
}

networkMemberService.fetchUserCodeByPhone = async (phoneNumber) => {
    const user = await userCodesList.findOne({ phone: phoneNumber });
    return user ? user.userCode : "";
};
networkMemberService.fetchTitle = async (data) => {
    const title = await titlesList.findOne({ value: data }, { value: 1, _id: 1 });
    if (title) {
        console.log(title, "title")
    }
    return title ? [title] : []
};

module.exports = networkMemberService;