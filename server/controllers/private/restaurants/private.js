import express from "express";
import restaurantModel from "../../../Models/Restaurants/Restaurants.js";
import {v4 as uuid} from "uuid";

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
        console.log(error);
        res.status(500).json({msg: error.message});
    }
});

router.post("/additem", async (req, res)=>{
    try {
        let menuData = req.body;
        menuData.item_id = uuid();
        console.log(menuData);
        await restaurantModel.updateOne({_id: req.user.id}, {
            $push: {menu: menuData}
        });
        res.status(201).json({msg: `Menu item ${menuData.name} were added successfully!!`});
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: error});
    }
});

router.put("/updateitem", async (req, res)=>{
    try {
        let {name, price, item_id, inStock} = req.body;
        let updated = await restaurantModel.updateOne({_id: req.user.id, 'menu.item_id': item_id}, {
            $set: {"menu.$.name": name, "menu.$.price": price, "menu.$.inStock": inStock}
        });
        console.log(updated);
        res.status(201).json({msg: `Menu item/s were updated successfully!!`});
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: error});
    }
});

router.delete("/deleteitem", async (req, res)=>{
    try {
        let {item_id} = req.body;
        let deleted = await restaurantModel.updateOne({_id: req.user.id, 'menu.item_id': item_id}, {
            $pull: {menu: {item_id}
        }}, {
            new: true
        });
        if(deleted.modifiedCount === 0)
        {
            return res.status(404).json({msg: "Menu item not found!!"});
        }
        // console.log(deleted);
        res.status(200).json({msg: `Menu item with ID: ${item_id} was deleted successfully!`});
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: error.message});
    }
});

router.delete("/deletemenu", async (req, res)=>{
    try {
        let deleted = await restaurantModel.updateOne({_id: req.user.id}, {
            $set: {menu: []}
        });
        res.status(204).json({msg: "Menu deleted successfully!!"});
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: error.message});
    }
});


export default router;