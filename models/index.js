const {Sequelize,DataTypes}=require("sequelize");
const config =require("../config/database");

const sequelize=new Sequelize(config.database,config.username,config.password,{
    host:config.host,
    dialect:config.dialect,
    pool:{
        max:config.pool.max,
        min:config.pool.min,
        acquire:config.pool.acquire,
        idle:config.pool.idle
    },
    logging:config.logging
})

sequelize.authenticate().then(()=>{
    console.log("db connected");
}).catch(err=>console.log("Error",err))

const db={};

db.Sequelize=Sequelize;
db.sequelize=sequelize;

db.User=require("./User")(sequelize,DataTypes);
db.Category=require("./Category")(sequelize,DataTypes);
db.Role=require("./Role")(sequelize,DataTypes);
db.Transactions=require("./Transactions")(sequelize,DataTypes);


db.User.hasMany(db.Transactions,{foreignKey:'user_id'});
db.Transactions.belongsTo(db.User,{foreignKey:'user_id'});

db.User.belongsTo(db.Role,{foreignKey:'role_id'});
db.Role.hasMany(db.User,{foreignKey:'role_id'});

db.Transactions.belongsTo(db.Category,{foreignKey:'category_id'});
db.Category.hasMany(db.Transactions,{foreignKey:'category_id'});

db.sequelize.sync({force:false}).then(()=>{
    console.log('Yes sync done!')
})

module.exports=db;