const db=require("../models/index");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const { where,Op } = require("sequelize");

exports.createUser=(async(req,res,next)=>{
    try{
       
        if(req.user.role_id!==1){
           return res.status(401).json({success:false,message:"Unauthorised"});
        }else{
            const {username,password,role_id,email}=req.body;
            const hashedPass=await bcrypt.hash(password,parseInt(process.env.SALT,10));
          
            const user=await db.User.create({
                username,
                email,
                password:hashedPass,
                role_id
            });
            return res.status(200).json({success:true,message:"User Created Successfully",user})
        }
    }catch(err){
        console.log(err);
        return res.status(500).json({success:false,message:"Internal Server Error"})
    }
})

exports.userLogin=(async(req,res,next)=>{
    try{
        const {password,username,email}=req.body;
        let user;
        if(username){
            user=await db.User.findOne({where:{username:username}});
        }
        if(email){
            user=await db.User.findOne({where:{email:email}});
        }

       
        if(!user || user.active!=1){
            return res.status(404).json({status:false,message:"Invalid Email,Password or username"});
        }
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(401).json({status:false,message:"Invalid Email,Password or username"});
        }else{
            const token=jwt.sign({id:user.user_id,role_id:user.role_id,username:user.username},process.env.SECRET_KEY,{expiresIn:'6h'})
            return res.status(200).json({status:true,message:"Successfully Logged In",token});
        }
    }catch(err){
        console.log("Error-:",err);
        return res.status(500).json({status:false,message:"Internal Server Error"});
    }

})

exports.updateUser=(async(req,res,next)=>{
    try{
        if(req.user.role_id!=1){
            return res.status(401).json({success:false,message:"Unauthorised"});
        }
        const userId = req.params.id;
        const updateData = {};

        if (req.body.username) {
            updateData.username = req.body.username;
        }

        if (req.body.email) {
            updateData.email = req.body.email;
        }

        if(req.body.active!==undefined){
            updateData.active=req.body.active;
        }
        
        if(req.body.role_id){
            updateData.role_id=req.body.role_id;
        }
        

        if(req.body.password){
            const hashedPass=await bcrypt.hash(req.body.parseInt(password,process.env.SALT,10));
            updateData.password=hashedPass;
        }

        const user=await db.User.findOne({where:{user_id:userId}});
        if(user){
        const updatedUser=await db.User.update(updateData,{where:{user_id:userId}}) ;
            return res.status(200).json({status:true,message:"Updated Successfully"});
        }else{
            return res.status(404).json({status:false,message:"User Not Found"});
        }

        
    }catch(err){
        return res.status(500).json({status:false,message:"Internal Server Error"});
    }
})

exports.getUsers = async (req, res) => {
  try {
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const roleName = req.query.role; 
    const active = req.query.active; 
    const offset = (page - 1) * limit;
    const attributes=["username","email","active","role_id"];

    let whereClause = {
      [Op.or]: [
        { username: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ]
    };

    if (active) {
      whereClause.active = active;
    }

    let roleInclude = {
      model: db.Role,
      attributes: ['role_name']
    };

    if (roleName) {
      roleInclude.where = { name: roleName };
    }

    const { count, rows } = await db.User.findAndCountAll({
      where: whereClause,
      include: [roleInclude],
      attributes:attributes,
      limit: limit,
      offset: offset,
      distinct: true, 
      order: [['username', 'ASC']]
    });

    res.status(200).json({
      success: true,
      data: rows,
      meta: {
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ 
      success: false, 
      message: "Error fetching users", 
    });
  }
};