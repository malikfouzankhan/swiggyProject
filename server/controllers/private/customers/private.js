import express from "express";
import customerModel from "../../../Models/Customers/Customers.js";
import restaurantModel from "../../../Models/Restaurants/Restaurants.js";
import riderModel from "../../../Models/Riders/Riders.js";
import {v4 as uuid} from "uuid";

const router = express.Router();

router.get("/getcustomer", async (req, res)=>{
    try {
        let isActive = await customerModel.find({_id: req.user.id}, {_id: 0, isActive: 1});
        console.log(isActive);
        if(!isActive[0].isActive)
        {
            return res.status(400).json({msg: "User does not exist!"});
        }
        let user = await customerModel.findOne({_id: req.user.id},{name: 1, email: 1, phone: 1, _id: 0, location: 1, orderHistory: 1, currentOrder: 1, isVerified: 1});
        res.status(200).json(user);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({msg: error.message});
    }
});

router.put("/updatecustomer", async (req, res)=>{
    try {
        let updatedData = req.body;
        await customerModel.updateOne({_id: req.user.id}, {
            $set: updatedData
        });
        res.status(200).json({msg: "Your data was updated successfully!"});
    } catch (error) {
        console.log(error.message);
        res.status(500).json({msg: error.message});
    }
});

router.delete("/deletecustomer", async (req, res)=>{
    try {
        await customerModel.updateOne({_id: req.user.id}, {$set: {isActive: false}});
        res.status(200).json({msg: "Your account was deleted successfully. Farewell!"});
    } catch (error) {
        console.log(error.message);
        res.status(500).json({msg: error});
    }
});

router.put("/place-order", async (req, res)=>{
    try {
        let {restaurant_name, item_name, item_quantity} = req.body;
        let res_details = await restaurantModel.findOne({name: restaurant_name}, {
            menu: 1,
            phone: 1
        });
        let cus_details = await customerModel.findOne({_id: req.user.id}, {
            name: 1,
            phone: 1
        });
        let rid_details = await riderModel.findOne({isOnline: true},{
            name: 1,
            phone: 1
        });


        let order = {
            _id: uuid(),
            restaurant_name,
            restaurant_phone: res_details.phone,
            item_name,
            item_quantity,
            total: item_quantity * res_details.menu.find((x)=> x.name == item_name).price,
            rider_name: rid_details.name,
            rider_phone: rid_details.phone
        }
        await customerModel.updateOne({_id: req.user.id}, {
            $push: {currentOrder: order}
        });

        order.customer_name = cus_details.name;
        order.customer_phone = cus_details.phone;
        delete order.rider_name;
        delete order.rider_phone;

        await riderModel.updateOne({}, {
            $push: {currentOrder: order}
        });

        delete order.restaurant_name;
        delete order.restaurant_phone;
        order.rider_name = rid_details.name;
        order.rider_phone = rid_details.phone;

        await restaurantModel.updateOne({_id: res_details._id}, {
            $push: {currentOrder: order}
        });
        
        res.status(201).json({msg: "Order placed!!"});
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: error});
    }
});


export default router;