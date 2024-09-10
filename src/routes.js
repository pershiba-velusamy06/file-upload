
const express = require('express');
const uploadMiddleWare = require('./uploadMiddleWare.js');
const networkClusterController = require('./NetworkCluster/Networkcluster.controller');
const networkMemberController = require('./NetworkMembers/NetworkMember.controller.js');

const router = express.Router();

router.post('/createNetworkCluster',uploadMiddleWare,networkClusterController.createNetworkCluster )
router.post('/createNetworkMembers',uploadMiddleWare,networkMemberController.CreateNetworkMembers )

module.exports = {
    routes: router,
  };