import express from "express";
import { deleteUserController, loginController, registerController, updateUserController } from "../controller/authController.js";
import upload from "../middleware/upload.js";

const router=express.Router();
router.post("/register",upload.none(),registerController);
router.post("/login",upload.none(),loginController);
router.post("/updateUser",upload.single("photo"),updateUserController);
router.delete("/deleteUser",upload.none(),deleteUserController);
export default router;