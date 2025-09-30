import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import authRoutes from "./src/routes/authRoute.js";
dotenv.config();

cors({
    credentials:true,
    allowedHeaders:true,
    methods:["GET","POST,PUT","PATCH","DELETE"],
    optionsSuccessStatus:200,
    origin:`https://bus-book-one.vercel.app`
});

const app=express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use("/upload",express.static("/src/upload"));
app.set("view engine","ejs");

app.set("views",path.join(process.cwd(),"/src/views"));
app.get("/",(req,res)=>{
    return res.render("dashboard");
});
app.use("/api",authRoutes);



app.listen(process.env.PORT,()=>{
    console.log(`Server Started at https://bus-book-one.vercel.app/`);
});
