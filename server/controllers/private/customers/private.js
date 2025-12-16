import express from "express";
import customerModel from "../../../Models/Customers/Customers.js";

const router = express.Router();

router.get("/getcustomer", async (req, res)=>{
    try {
        if(!req.user.isActive)
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


export default router;