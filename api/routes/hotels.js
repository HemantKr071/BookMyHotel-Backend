import express from "express";
const router = express.Router();
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import { verifyAdmin } from "../utils/verifyToken.js";
import mongoose from "mongoose";
const { Promise } = mongoose;
import { verifyUser } from "../utils/verifyToken.js";

// CREATE HOTEL
router.post("/", async (req, res) => {
    try {
        const newHotel = await Hotel.create(req.body);
        res.status(201).json({ 
            message: "Hotel created successfully",
             hotel: newHotel 
        });
    
    } catch (err) {
        console.error("Error creating hotel:", err);
        res.status(500).json({ error: "Failed to create hotel" });
    }
});

// UPDATE HOTEL
router.put("/:id",verifyAdmin,async (req,res) => {
    try{
        const updatedHotel = await Hotel.findByIdAndUpdate(
            req.params.id,
            {$set : req.body},
            {new : true}
        );
        res.status(200).json({ 
            message: "Hotel updated successfully",
             hotel: updatedHotel 
        });
       

    }catch(err){
        console.error("Error updating hotel:", err);
        res.status(500).json({ error: "Failed to update hotel" });
    }
})

// DELETE HOTEL
router.delete("/:id",verifyAdmin,async (req,res) => {
    try{
        await Hotel.findByIdAndDelete(
            req.params.id
        );
        res.status(200).json({ 
            message: "Hotel deleted successfully",
        });
       

    }catch(err){
        console.error("Error deleting hotel:", err);
        res.status(500).json({ error: "Failed to delete hotel" });
    }
})

// SEARCH ALL HOTELS
router.get("/all",async (req,res) => {
    const {min,max,...others} = req.query;

    try{
        const hotels = await Hotel.find({...others,
            cheapestPrice:{$gt:min | 1 ,$lt:max | 20000}
        }).limit(req.query.limit);
        res.status(200).json(hotels);
       

    }catch(err){
        console.error("Error searching hotels:", err);
        res.status(500).json({ error: "Failed to search hotels" });
    }
})
// SEARCH HOTEL BY ID
router.get("/find/:id",async (req,res) => {
    try{
        const hotel = await Hotel.findById(
            req.params.id
        );
        res.status(200).json(hotel);
       

    }catch(err){
        console.error("Error searching hotel:", err);
        res.status(500).json({ error: "Failed to search hotel" });
    }
});

// Search by city and type end points below

router.get("/countByCity",async (req,res)=>{
    const cities = req.query.cities.split(",");
    const list = [];

    console.log(cities);
    try{
        for (const city of cities) {
            const count = await Hotel.countDocuments({ city: city });
            list.push(count);
        }
        res.status(200).json(list);

    }catch(err){
        console.error("Error searching hotel:", err);
        res.status(500).json({ error: "Failed to search hotel by city" });
    }
});

router.get("/countByType",async (req,res)=>{
   
    try{
        const hotelCount = await Hotel.countDocuments({ type:"hotel"});
        const apartmentCount = await Hotel.countDocuments({ type:"apartment"});
        const resortCount = await Hotel.countDocuments({ type:"resort"});
        const villaCount = await Hotel.countDocuments({ type:"villa"});
        const cabinCount = await Hotel.countDocuments({ type:"cabin"});
       
        res.status(200).json([
            {type:"hotel",count:hotelCount},
            {type:"apartment",count:apartmentCount},
            {type:"resort",count:resortCount},
            {type:"villa",count:villaCount},
            {type:"cabin",count:cabinCount},
        ]);

    }catch(err){
        console.error("Error searching types:", err);
        res.status(500).json({ error: "Failed to search types" });
    }
});

router.get("/room/:id",async (req,res) => {
    const list = [];
    console.log(req.params.id);
    try{
        const hotel = await Hotel.findById(req.params.id);
        
        for (const roomId of hotel.rooms) {
            const room = await Room.findById(roomId);
            list.push(room);
        }
        res.status(200).json(list);

    }catch(err){
        console.error("Error finding rooms:", err);
        res.status(500).json({ error: "Failed to search rooms" });

    }
});



export default router;