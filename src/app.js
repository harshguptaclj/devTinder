const express= require('express');

const app = express();

app.use("/test",(req,res)=>{
    res.send("Hare Krishna");
})

app.listen(7777,()=>{
    console.log("App is listening on Port 7777");
})