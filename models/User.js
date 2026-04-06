

module.exports=(sequelize,DataTypes)=>{
    const User=sequelize.define('user',{
        user_id:{
            type:DataTypes.UUID,
            defaultValue:DataTypes.UUIDV4,
            primaryKey:true,

        },
        username:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        email:{
            type:DataTypes.STRING,
            allowNull:false,
            unique:true,
            validate: { isEmail: true }
        },
        password:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        role_id:{
            type:DataTypes.INTEGER,
            allowNull:false,
        },
        active:{
            type:DataTypes.BOOLEAN,
            defaultValue:true
        }
    })
    return User;
}