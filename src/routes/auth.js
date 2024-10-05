const express= require('express');
const User = require('../model/user')
const {validateSignUpData}= require('../utils/validation')
const bcrypt = require('bcrypt');
const authRouter = express.Router();

//signup api 
authRouter.post("/signup",async(req,res)=>{
    try{
        //Validation of data
        validateSignUpData(req);

        const {firstName, lastName, email, password} = req.body;

        //Encrypt the password
        const passwordHash = await bcrypt.hash(password,10);
       

        //Creating a new instance of the User model
        const user = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
        });
    
        const savedUser = await user.save();
        const token = await savedUser.getJWT();

        res.cookie("token",token,{
            expires: new Date(Date.now() + 8*3600000),
        });


        res.send("User added successfully");
    }catch(err){
        res.status(400).send("Error: " +  err.message)
    }
    
})

//login api 
authRouter.post("/login",async(req,res)=>{
    try{
        const {email, password} = req.body;

        const user = await User.findOne({email: email});
        if(!user){
            throw new Error("Invalid credentials");
        }
        const isPasswordValid = await user.validPassword(password);

        if(isPasswordValid){
            const token = await user.getJWT();

            res.cookie("token", token, {
                expires: new Date(Date.now() + 8*3600000),
            });
            res.send("Login Successful!!");
        }else {
            throw new Error("Invalid credentials");
        }
    } catch(err){
        res.status(400).send("ERROR : " + err.message);
    }
})

//logout api 
authRouter.post("/logout", async(req,res)=>{
    res.cookie("token", null, {
        expires: new Date(Date.now()),
    });
    res.send("Logout Successful!!");
})

module.exports = authRouter;