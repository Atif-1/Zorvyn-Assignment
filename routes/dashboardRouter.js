const express=require("express");
const Router=express.Router();
const { protect} = require("../middleware/auth");
const { getDashboardSummary } = require("../controller/dashboardController");

Router.get("/",protect,getDashboardSummary);

module.exports=Router;