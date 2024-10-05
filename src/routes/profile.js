const express= require('express');
const bcrypt = require('bcrypt');
const profileRouter = express.Router();


const { validateEditProfileData, validateEditPassword } = require('../utils/validation');
const { userAuth } = require('../middleware/userauth');


profileRouter.get("/profile/view",userAuth, async (req,res) =>{
    try{
        const user = req.user;
        res.json({message:"These are the available user:",
            data: user});
    } catch(err){
        res.status(400).send("ERROR : "+ err.message);
    }

});

profileRouter.patch("/profile/edit", userAuth, async(req,res)=>{
    try{
        const isUpdateAllowed = validateEditProfileData(req);
        if(!isUpdateAllowed){
            throw new Error("Update not allowed");
        }
        const loggedInUser = req.user;
        
        Object.keys(req.body).forEach((key)=>loggedInUser[key]= req.body[key]);

        await loggedInUser.save();
        
        res.json({
            message: `${loggedInUser.firstName}, your Profile Updated Successfully!!`,
            data: loggedInUser
        })
    } catch(err){
        res.status(400).send("UPDATE FAILED:"+ err.message);
    }

});

profileRouter.patch('/profile/password',userAuth, async(req,res)=>{
    try{
        validateEditPassword(req);

        const {password} = req.body;
        
        //Encrypt the password
        const passwordHash = await bcrypt.hash(password,10);

        const loggedInUser = req.user;

        loggedInUser.password = passwordHash;

        await loggedInUser.save();

        res.json({
            message:"Password updated successfully"
        })
        
    }catch(err){
        res.status(400).send("Can't update password!!" + err.message)
    }
})

module.exports= profileRouter;