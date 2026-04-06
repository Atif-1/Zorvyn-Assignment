
module.exports=(sequelize,DataTypes)=>{
    const Transactions=(sequelize.define("transactions",{
        transaction_id:{
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true,
        },
        amount:{
            type:DataTypes.INTEGER,
            allowNull:false,
        },
        type: {
            type: DataTypes.ENUM('income', 'expense'),
            allowNull: false,
        },
        notes:{
            type:DataTypes.TEXT,
            allowNull:true,

        },
        category_id:{
            type:DataTypes.INTEGER,
            allowNull:false,

        },
        user_id:{
            type:DataTypes.UUID,
            allowNull:false,
        },
        date: { 
            type: DataTypes.DATE, 
            allowNull: false, 
            defaultValue: DataTypes.NOW 
        },
        is_delete:{
            type:DataTypes.BOOLEAN,
            defaultValue:false,
        }
    }))
    return Transactions;
}