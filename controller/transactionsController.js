const db=require("../models/index");
const {Op}=require('sequelize');

exports.createTransaction=async(req,res)=>{
    try{
        const {amount,type,notes,category_id,user_id,date}=req.body;
        const transaction=db.Transactions.create({
            amount,
            type,
            notes,
            category_id,
            user_id:req.user.id,
            date:date || new Date(),
            is_delete:false,
        })
        if(transaction){
            return res.status(200).json({success:true,message:"Tranasaction saved!"});
        }
    }catch(err){
        console.log(err);
        return res.status(500).json({success:false,message:"Internal Server Error"});
    }
}

exports.updateTransaction=async(req,res)=>{
    try{
        const transactionId=req.params.id;
        const {date,notes,amount,category_id,type}=req.body;
        let updatedData={};
        if(date){
            updatedData.date=date;
        }
        if(notes){
            updatedData.notes=notes;
        }
        if(amount){
            updatedData.amount=amount;
        }
        if(category_id){
            updatedData.category=category_id;
        }
        if(type){
            updatedData.type=type;
        }
        
        const updatedTransaction=await db.Transactions.update(updatedData,{where:{transaction_id:transactionId}});
        if(updatedTransaction){
            return res.status(204).json({success:true,message:"Successfully Updated"});
        }
    }catch(err){
        console.log(err);
        return res.status(500).json({success:false,message:"Internal Server Error"});
    }
}
exports.deleteTransaction=async(req,res)=>{
    try{
        const transactionId=req.params.id;
        
        const deletedTransaction=await db.Transactions.update({is_delete:true},{where:{transaction_id:transactionId}});
        if(deletedTransaction){
            return res.status(204).json({success:true,message:"Successfully deleted"});
        }
    }catch(err){
        console.log(err);
        return res.status(500).json({success:false,message:"Internal Server Error"});
    }
}

exports.getTransactions=async(req,res)=>{
    try{
        
        if(req.user.role_id==1 || req.user.role_id==2){
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const search = req.query.search || '';
            const type = req.query.type; 
            const categoryName=req.query.category;
            const offset = (page - 1) * limit;
            const attributes=["transaction_id","amount","type","notes","category_id","user_id",	"date","is_delete"];

            let whereClause = {
                [Op.or]: [
                    { notes: { [Op.like]: `%${search}%` } }
                ]
                };
            
            if (type) {
                whereClause.type = type;
            }
            
            let categoryInclude = {
            model: db.Category,
            attributes: ['category']
            };

            if (categoryName) {
                categoryInclude.where = { name: categoryName };
            }
            const { count, rows } = await db.Transactions.findAndCountAll({
                where: whereClause,
                include: [categoryInclude],
                attributes:attributes,
                limit: limit,
                offset: offset,
                distinct: true, 
                order: [['date', 'ASC']]
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
        }else{
            res.status(403).json({ 
            success: false, 
            message: "Unauthorized", 
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ 
        success: false, 
        message: "Error fetching users", 
        });
    }
}