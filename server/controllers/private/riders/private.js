import express from "express";
import riderModel from "../../../Models/Riders/Riders";

const router = express.Router();

router.get("/getrider", async (req, res)=>{
    try {
        let isActive = await riderModel.find({_id: req.user.id}, {_id: 0, isActive: 1});
        console.log(isActive);
        if(!isActive[0].isActive)
        {
            return res.status(400).json({msg: "Rider does not exist!"});
        }
        let rider = await riderModel.findOne({_id: req.user.id},{name: 1, email: 1, phone: 1, _id: 0, location: 1, orderHistory: 1, currentOrder: 1, isVerified: 1});
        res.status(200).json(rider);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({msg: error.message});
    }
});

router.put("/updaterider", async (req, res)=>{
    try {
        let updatedData = req.body;
        await riderModel.updateOne({_id: req.user.id}, {
            $set: updatedData
        });
        res.status(200).json({msg: "Your data was updated successfully!"});
    } catch (error) {
        console.log(error.message);
        res.status(500).json({msg: error.message});
    }
});

router.delete("/deleterider", async (req, res)=>{
    try {
        await riderModel.updateOne({_id: req.user.id}, {$set: {isActive: false}});
        res.status(200).json({msg: "Your account was deleted successfully. Farewell!"});
    } catch (error) {
        console.log(error.message);
        res.status(500).json({msg: error});
    }
});

router.put("/complete-order", async (req, res)=>{
    try {
        await customerModel.findOneAndUpdate({})
        await restaurantModel.findOneAndUpdate({})
        await riderModel.findOneAndUpdate({})

    } catch (error) {
        console.log(error);
        res.status(500).json({msg: error});
    }
});


export default router;