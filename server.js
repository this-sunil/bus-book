import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./src/routes/authRoute.js";
dotenv.config();

cors({
    credentials:true,
    allowedHeaders:true,
    methods:["GET","POST,PUT","PATCH","DELETE"],
    optionsSuccessStatus:200,
    origin:`http://localhost:${process.env.PORT}`
});

const app=express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use("/upload",express.static("/src/upload"));
app.use("/api",authRoutes);
app.listen(process.env.PORT,()=>{
    console.log(`Server Started at http://localhost:${process.env.PORT}`);
});
