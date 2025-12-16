import express from "express";
import restaurantModel from "../../../Models/Restaurants/Restaurants.js";

const router = express.Router();

router.get("/getrestaurant", async (req, res)=>{
    try {
        let isActive = await restaurantModel.find({_id: req.user.id}, 
            {
                _id: 0,
                isActive: 1
            });
                console.log(isActive);
        if(!isActive[0].isActive)
        {
            return res.status(400).json({msg: "Restaurant does not exist!"});
        }
        let restaurant = await restaurantModel.findOne({_id: req.user.id},
        {
            name: 1,
            email: 1,
            phone: 1,
            _id: 0,
            location: 1,
            orderHistory: 1,
            currentOrder: 1,
            isVerified: 1
        });
        res.status(200).json(restaurant);
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: error.message});
    }
});

router.put("/updaterestaurant", async (req, res)=>{
    try {
        let updatedData = req.body;
        await restaurantModel.updateOne({_id: req.user.id}, {
            $set: updatedData
        });
        res.status(200).json({msg: "Your data was updated successfully!"});
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: error.message});
    }
});

router.delete("/deleterestaurant", async (req, res)=>{
    try {
        
        await restaurantModel.updateOne({_id: req.user.id}, {
            $set: {isActive: false}
        });
        res.status(200).json({msg: "Your account was deleted successfully. Farewell!"});
    } catch (error) {
        console.log(error.message);
        res.status(500).json({msg: error});
    }
});

router.post("/additem", async (req, res)=>{
    try {
        let menuData = req.body;
        await restaurantModel.updateOne({_id: req.user.id}, {
            $push: menuData
        });
        res.status(201).json({msg: `Menu items ${menuData.name} were added successfully!!`});
    } catch (error) {
        console.log(error.message);
        res.status(500).json({msg: error});
    }
});


export default router;