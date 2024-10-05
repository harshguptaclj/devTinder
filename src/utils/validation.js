const validator = require("validator");

const validateSignUpData = (req) =>{
    const {firstName, lastName, email, password} = req.body;
    if(!email){
        throw new Error("Email is not there!")
    }
    if(!firstName){
        throw new Error("Name is not valid");
    }
    else if(email && !validator.isEmail(email)){
        throw new Error("Email is not valid!");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Please enter a strong Password!");
    }
};

const validateEditProfileData = (req) =>{
    const data = req.body;
    const ALLOWED_UPDATES = ["firstName","lastName","email","photoUrl", "about", "gender", "age", "skills"];
    const isEditAllowed = Object.keys(data).every((k)=>
        ALLOWED_UPDATES.includes(k)
    );
    return isEditAllowed;
}

const validateEditPassword = (req) =>{
    const {password} = req.body;
    if(!validator.isStrongPassword(password)){
        throw new Error("Please Enter a Strong Password!");
    }
}

module.exports = {
    validateSignUpData,
    validateEditProfileData,
    validateEditPassword
};