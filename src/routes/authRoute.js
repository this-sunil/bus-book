import express from "express";
import { loginController, registerController } from "../controller/authController.js";
import upload from "../middleware/upload.js";

const router=express.Router();
router.post("/register",upload.none(),registerController);
router.post("/login",upload.none(),loginController);
export default router;