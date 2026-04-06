const jwt=require("jsonwebtoken");

exports.protect=(async(req,res,next)=>{
    try{
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }
        if (token) {
            jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
            if (err) {
                return res.status(403).json({success:false,message:"Something went wrong! Please Login Again"});
            }
            req.user = user;
            next();
            });
        } else {
            res.status(401).json({success:false,message:"Error! Please Login Again."});
        }
    }catch(err){
         console.log(err);
        res.status(500).json({success:false,message:"Internal Server Error"})
    }
})

exports.restrict = (req, res, next) => {
    if (req.user && req.user.role_id === 1) {
        return next();
    }
    res.status(403).json({ success: false, message: "Unauthorized User" });
};
