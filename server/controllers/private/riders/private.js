import express from "express";
import riderModel from "../../../Models/Riders/Riders.js";
import customerModel from "../../../Models/Customers/Customers.js";
import restaurantModel from "../../../Models/Restaurants/Restaurants.js";

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
        let rid_details = await riderModel.findOne({_id: req.user.id}, {
            currentOrder: 1
        });
        await riderModel.findOneAndUpdate({_id: req.user.id}, {
            $push : {orderHistory: rid_details.currentOrder[0]},
            $set: {currentOrder: []}
        });

        let res_name = rid_details.currentOrder[0].restaurant_name;
        let ord_id = rid_details.currentOrder[0]._id;
        let res_details = await restaurantModel.findOne({name: res_name}, {
            currentOrder: 1
        });
        let res_order = res_details.currentOrder.find((x)=> x._id == ord_id);
        await restaurantModel.updateOne({name: res_name}, {
            $push: {orderHistory: res_order},
            $pull: {currentOrder: res_order}
        });

        let cus_details = await customerModel.findOne({"currentOrder._id": ord_id}, {
            currentOrder: 1
        });
        await customerModel.findOneAndUpdate({"currentOrder._id": ord_id}, {
            $push: {orderHistory: cus_details.currentOrder[0]},
            $set: {currentOrder: []}
        });
        
        res.status(200).json({msg: "Order completed successfully!!"})
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: error});
    }
});

router.get("/get-order", async (req, res)=>{
    try {
        let ord_details = await riderModel.findOne({_id: req.user.id},{
            currentOrder: 1
        });
        res.status(200).json(ord_details.currentOrder);
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: error});
    }
});

router.get("/total-orders", async (req, res)=>{
    try {
        let details = await riderModel.findOne({_id: req.user.id}, {
            orderHistory: 1,
            _id: 0
        });
        console.log(details.orderHistory.length);
        res.status(200).json({"Total Orders": details.orderHistory.length});
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: error});
    }
})

export default router;