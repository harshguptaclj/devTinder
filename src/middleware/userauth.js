const jwt = require('jsonwebtoken');
const User = require('../model/user')

const userAuth = async(req,res,next)=>{
    //Read the token from the req cookies 
    //Validate the token
    //find the user

    try{
        const {token} = req.cookies;
        if(!token){
            return res.status(401).send("Please Login!");
        }

        const decodedObj = jwt.verify(token,"Harsh@123",{expiresIn: "1d"});
        const {_id}= decodedObj;
        const user = await User.findById(_id);

        if(!user){
            throw new Error("User not found");
        }
        req.user = user;
        next();
    } catch(err){
        res.status(400).send("Error" + err.message);
    }


}

module.exports= {userAuth,};