const mongoose = require('mongoose');

const connectDB = async()=>{
    await mongoose.connect("mongodb+srv://harshguptaclj:jQqn7XFIndOYM6aG@cluster0.doejczi.mongodb.net/devTinder");
    console.log("DB Connected Successfully");
}

module.exports=connectDB;