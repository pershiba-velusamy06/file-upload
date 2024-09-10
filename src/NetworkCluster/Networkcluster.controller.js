const networkClusterService = require("./NetworkCluster.service");


const networkClusterController={}

networkClusterController.createNetworkCluster = async (req, res) => {
    networkClusterService.createNetworkCluster(req.body, req.files)
      .then(async (result) => {
        res.status(200).json({
          success: true,
          isAuth: false,
          message: "Network Cluster created Successfully",
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
  };


module.exports = networkClusterController;