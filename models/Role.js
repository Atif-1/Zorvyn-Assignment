

module.exports=(sequelize,DataTypes)=>{
    const Role=(sequelize.define("role",{
        role_id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true,
            allowNull:false,
        },
        role_name:{
            type:DataTypes.STRING,
            allowNull:false,
            unique:true
        }
    }));
    return Role;
}