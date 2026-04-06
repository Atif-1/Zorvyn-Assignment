const express=require("express");
const helmet=require("helmet");
const cors=require("cors");
const bodyParser = require("body-parser");
const app=express();
app.use(helmet());
app.use(cors("*"));
app.use(express.json());
app.use(bodyParser.json());
require("dotenv").config();
const userRouter=require("./routes/userRouter");
const transactionRouter=require("./routes/transactionRouter");
const dashboardRouter=require("./routes/dashboardRouter");
app.use("/user",userRouter);
app.use("/transaction",transactionRouter);
app.use("/dashboard",dashboardRouter);



app.use("/",(req,res,next)=>{
    res.status(200).json({success:true,message:"Welcome to FinSol -: Finance Solution "});
})


module.exports= app;
