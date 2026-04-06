const app=require("./app");
const port=process.env.PORT;
(async ()=>{
    try{
        app.listen(port,()=>console.log(`Server started at ${port}`));
    }catch(err){
        console.log(`Error ${err}`);
        process.exit(1);
    }
})();
 