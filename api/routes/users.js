import express from "express";
import User from "../models/User.js";
import { verifyAdmin } from "../utils/verifyToken.js";
import { verifyUser } from "../utils/verifyToken.js";
const router = express.Router();

// CREATE USER
router.post("/",async (req, res) => {
    try {
        const newUser = await User.create(req.body);
        res.status(201).json({ 
            message: "User created successfully",
             User: newUser 
        });
    
    } catch (err) {
        console.error("Error creating User:", err);
        res.status(500).json({ error: "Failed to create User" });
    }
});

// UPDATE USER
router.put("/:id",verifyUser,async (req,res) => {
    try{
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {$set : req.body},
            {new : true}
        );
        res.status(200).json({ 
            message: "User updated successfully",
             User: updatedUser 
        });
       

    }catch(err){
        console.error("Error updating User:", err);
        res.status(500).json({ error: "Failed to update User" });
    }
})

// DELETE USER
router.delete("/:id",verifyUser,async (req,res) => {
    try{
        await User.findByIdAndDelete(
            req.params.id
        );
        res.status(200).json({ 
            message: "User deleted successfully",
        });
       

    }catch(err){
        console.error("Error deleting User:", err);
        res.status(500).json({ error: "Failed to delete User" });
    }
})

// GET ALL USERS
router.get("/all",verifyAdmin,async (req,res) => {
    try{
        const users = await User.find({});
        res.status(200).json(users);
       

    }catch(err){
        console.error("Error searching Users:", err);
        res.status(500).json({ error: "Failed to search Users" });
    }
})

// FIND USER BY ID
router.get("/:id",verifyUser,async (req,res) => {
    try{
        const user = await User.findById(
            req.params.id
        );
        res.status(200).json(user);
       

    }catch(err){
        console.error("Error searching User:", err);
        res.status(500).json({ error: "Failed to search User" });
    }
})



export default router;

