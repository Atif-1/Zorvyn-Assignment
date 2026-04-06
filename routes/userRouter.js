const express=require("express");
const Router=express.Router();
const { createUser, userLogin, updateUser, getUsers } = require("../controller/userController");
const { protect, restrict } = require("../middleware/auth");
const validate = require("../middleware/validate");
const {createUserValidators, getUserValidator}=require("../validators/validator");


Router.post("/signup",protect,restrict,createUserValidators,validate,createUser);
Router.post("/login",userLogin);
Router.patch("/update/:id",protect,restrict,updateUser);
Router.get("/",protect,restrict,getUserValidator,getUsers);

module.exports=Router;