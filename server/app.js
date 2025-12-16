import express from "express";
import dotenv from "dotenv";
dotenv.config();
import "./utils/dbConnect.js";
import customerPublicRouter from "./controllers/public/customers/public.js";
import customerPrivateRouter from './controllers/private/customers/private.js';
import authMiddleware from "./middleware/auth.js";
import restaurantPublicRouter from "./controllers/public/restaurants/public.js";
import riderPublicRouter from "./controllers/public/riders/public.js";
import restaurantPrivateRouter from "./controllers/private/restaurants/private.js"

const port = process.env.PORT;

const app = express();
app.use(express.json());

app.get("/", (req, res)=>{
    res.status(200).json({msg: "Server is running holding good 👍"});
});

app.use("/public/customer", customerPublicRouter);
app.use("/public/restaurant", restaurantPublicRouter);
app.use("/public/rider", riderPublicRouter);
app.use(authMiddleware);
app.use("/private/customer", customerPrivateRouter);
app.use("/private/restaurant", restaurantPrivateRouter);


app.listen(port, ()=>{
    console.log(`Server is up and running at: http://localhost:${port}`);
});