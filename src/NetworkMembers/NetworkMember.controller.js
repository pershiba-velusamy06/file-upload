const networkMemberService = require("./NetworkMember.services");

const networkMemberController={}

networkMemberController.CreateNetworkMembers=async(req,res)=>{
    networkMemberService.createMemberCluster(req.body, req.files)
    .then(async (result) => {
      res.status(200).json({
        success: true,
        isAuth: false,
        message: "Members added to network Successfully",
        result: [result],
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        isAuth: false,
        errorCode: -1,
        message: err.message,
        result: [],
       
      });
    });
}

module.exports = networkMemberController;