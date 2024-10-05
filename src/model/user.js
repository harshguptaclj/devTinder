const mongoose= require('mongoose');
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:2,
        maxLength:20,
    },
    lastName:{
        type:String
    },
    email:{
        type:String,
        lowercase:true,
        required: true,
        unique:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email Address : " + value);
            }
        }
    },
    password:{
        type:String,
        required:true,
    },
    age:{
        type:Number,
        min:18,
        max:100,
    },
    gender:{
        type:String,
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("Gender data is not valid");
            }
        }
    },
    photUrl: {
        type: String,
        default:"https://geographyandyou.com/images/user-profile.png"
    },
    about: {
        type: String,
        default: "This is a default about of the user!"
    },
    skills:{
        type: [String],
    }
},
{
    timestamps: true
})

//Compound Index
userSchema.index({firstName: 1, lastName:1});

//Here we can define schema methods
userSchema.methods.getJWT = async function(){
    const user = this;
    const token = await jwt.sign({_id:user._id},"Harsh@123",{expiresIn:"1d"});
    return token;
}

userSchema.methods.validPassword= async function(passwordInputByUser){
    const user = this;
    const passwordHash = user.password;
    const isPasswordValid  = await bcrypt.compare(passwordInputByUser,passwordHash);
    return isPasswordValid;
}

//Now we will make a model

module.exports= mongoose.model("user", userSchema);