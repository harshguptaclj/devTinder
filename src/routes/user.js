const express= require('express');
const { userAuth } = require('../middleware/userauth');
const ConnectionRequestModel = require('../model/connectionRequest');
const { connect } = require('mongoose');
const User = require('../model/user');
const userRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName photUrl age gender about skills";

//Get all the pending connection request for the loggedIn user
userRouter.get("/user/requests/recieved", userAuth, async(req,res)=>{
    try{
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequestModel.find({
            toUserId: loggedInUser._id,
            status: "interested",
        }).populate(
            "fromUserId",
            USER_SAFE_DATA
        );
        
        res.json({
            message: "Data fetched successfully",
            data: connectionRequests,
        });
    } catch(err){
        req.statusCode(400).send("Error: " + err.message);
    }
});

//Get all the connections of the loggedIn User
userRouter.get("/user/connections", userAuth, async (req, res)=>{
    try{
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequestModel.find({
            $or: [
                {toUserId: loggedInUser._id, status:"accepted"},
                { fromUserId: loggedInUser._id, status: "accepted"},
            ],
        })
            .populate("fromUserId", USER_SAFE_DATA)
            .populate("toUserId", USER_SAFE_DATA);

        const data = connectionRequests.map((row)=>{
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
                return row.toUserId;
            }
            return row.fromUserId
        });

        res.json({data: data});
    } catch(err){
        res.status(400).send({message: err.message});
    }
});

//Feed API
userRouter.get("/feed", userAuth, async(req,res)=>{
    try{
        const loggedInUser = req.user;

        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit>50 ? 50 : limit;
        const skip = (page-1)* limit;

        const connectionRequests = await ConnectionRequestModel.find({
            $or: [{ fromUserId: loggedInUser._id}, {toUserId: loggedInUser._id}],
        }).select("fromUserId toUserId");
        
        const hideUsersFromFeed = new Set();
        connectionRequests.forEach((req)=>{
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        });

        const users = await User.find({
            $and: [
                { _id : { $nin: Array.from(hideUsersFromFeed)}},
                { _id: { $ne: loggedInUser._id}}
            ],
        })
            .select(USER_SAFE_DATA)
            .skip(skip)
            .limit(limit);

        res.status(201).json({data:users});
    } catch(err){
        res.status(400).json({message: err.message});
    }
});

module.exports = userRouter;