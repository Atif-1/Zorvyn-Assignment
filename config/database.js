
module.exports={
    username:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_NAME,
    host:process.env.DB_HOST,
    dialect:'mysql',
    pool:{
        max:20,
        min:5,
        acquire:60000,
        idle:20000
    },
    logging:false
}