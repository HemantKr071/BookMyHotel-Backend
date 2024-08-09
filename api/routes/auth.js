import express from "express";
import bycrpt from "bcrypt";
import jwt from "jsonwebtoken";
const router = express.Router();
import User from "../models/User.js";
//dotenv.config();

router.post('/register',async (req,res) => {
    const hashedPassword = await bycrpt.hash(req.body.password,10); // Hash the Password given by user
    
    try{
        const newUser = await User.create({
            username:req.body.username,
            email:req.body.email,
            password:hashedPassword // Hashed password will be store in DB

        });
        res.status(201).json({ 
            message: "User created successfully",
             user: newUser
        });

    }catch(err){
        console.error("Error creating user:", err);
        res.status(500).json({ error: "Failed to create userl" });

    }
});

router.post('/login',async (req,res) => {
    
    try{
        const user = await User.findOne({
            username:req.body.username
        })
        
        if(!user){
            res.status(500).json({
                message:"User not found"
            })
            return;
        }
        
        const isCorrectPassword = await bycrpt.compare(req.body.password, user.password);
    
        if(isCorrectPassword){
            const {password,isAdmin,...otherDetails} = user._doc;  // Information is stored in _doc part, so we use this,
                                                                   //as we dont want to send sensistive information in response
            const token = jwt.sign({id : user._id, isAdmin:user.isAdmin},process.env.JWT_SECRET);
            
            res.cookie("access_token",token,{
                httpOnly:true,
            }).status(200).json({                                 
                message: "Login Sucessful",
                user:otherDetails,
                token:token
            });
        }
        else{
            res.status(400).json({
                message:"Wrong Username or Password"
            })
        }
        
    }catch(err){
        console.error("Error finding user:", err);
        res.status(500).json({ error: "Failed to Login" });

    }
});


export default router;