import express from "express";
import Room from "../models/Room.js";
import Hotel from "../models/Hotel.js";
import { verifyAdmin } from "../utils/verifyToken.js";
import { verifyUser } from "../utils/verifyToken.js";
const router = express.Router();

//CREATE ROOM
router.post("/:hotelid",verifyAdmin,async (req,res) => {
    const hotelId = req.params.hotelid;
    
    try {
        const newRoom = await Room.create(req.body);
       // Updating room in the Hotel
        await Hotel.findByIdAndUpdate(hotelId,{
            $push : {rooms : newRoom._id},
        });
        res.status(201).json({ 
            message: "Room created successfully",
            room: newRoom 
        });
    
    } catch (err) {
        console.error("Error creating room:", err);
        res.status(500).json({ error: "Failed to create room" });
    }
});

// UPDATE ROOM AVAILABILITY
router.put("/availability/:id",async (req,res) => {
    try{
       await Room.updateOne({"roomNumbers._id":req.params.id},{
        $push:{
            "roomNumbers.$.unavailableDates": req.body.dates
        },
       });
        res.status(200).json({ 
            message: "Room updated successfully",
        });
       

    }catch(err){
        console.error("Error updating rooms:", err);
        res.status(500).json({ error: "Failed to update rooml" });
    }
})

// UPDATE ROOM
router.put("/:id",verifyAdmin,async (req,res) => {
    try{
        const updatedRoom = await Room.findByIdAndUpdate(
            req.params.id,
            {$set : req.body},
            {new : true}
        );
        res.status(200).json({ 
            message: "Room updated successfully",
             room: updatedRoom
        });
       

    }catch(err){
        console.error("Error updating rooms:", err);
        res.status(500).json({ error: "Failed to update rooml" });
    }
})

// DELETE ROOM
router.delete("/:id/:hotelid",verifyAdmin,async (req,res) => {
    const hotelId = req.params.hotelid;
    try{
        await Room.findByIdAndDelete(
            req.params.id
        );
        await Hotel.findByIdAndUpdate(hotelId,{
            $pull : {rooms : req.params.id},
        });
        res.status(200).json({ 
            message: "Room deleted successfully",
        });
       

    }catch(err){
        console.error("Error deleting room:", err);
        res.status(500).json({ error: "Failed to delete hotel" });
    }
})

// GET ALL ROOMS
router.get("/all",async (req,res) => {
    try{
        const rooms = await Room.find({});
        res.status(200).json(rooms);
       

    }catch(err){
        console.error("Error searching rooms:", err);
        res.status(500).json({ error: "Failed to search rooms" });
    }
})

// GET ROOM
router.get("/:id",async (req,res) => {
    try{
        const room = await Room.findById(
            req.params.id
        );
        res.status(200).json(room);
       

    }catch(err){
        console.error("Error searching room:", err);
        res.status(500).json({ error: "Failed to search room" });
    }
})





export default router;