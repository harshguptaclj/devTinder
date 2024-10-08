const express = require('express');
const connectDB= require('./config/database.js');
const cookieParser= require('cookie-parser');
const cors = require('cors');

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth.js");
const profileRouter = require("./routes/profile.js");
const requestRouter = require("./routes/requests.js");
const userRouter= require("./routes/user.js")

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter); 

connectDB().then(()=>{
    app.listen(7777,()=>{
        console.log("Server is running on PORT 7777");
    })
}).catch((err)=>{
    console.log("Can't connect to server!");   
})

