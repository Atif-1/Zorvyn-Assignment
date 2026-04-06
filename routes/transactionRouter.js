const express=require("express");
const Router=express.Router();
const { protect, restrict } = require("../middleware/auth");
const validate = require("../middleware/validate");
const { createTransactionValidator}=require("../validators/validator");
const { createTransaction, updateTransaction, deleteTransaction, getTransactions } = require("../controller/transactionsController");

Router.post("/create",protect,restrict,createTransactionValidator,validate,createTransaction);
Router.patch("/delete/:id",protect,restrict,deleteTransaction);
Router.patch("/update/:id",protect,restrict,updateTransaction);
Router.get("/",protect,getTransactions);

module.exports=Router;