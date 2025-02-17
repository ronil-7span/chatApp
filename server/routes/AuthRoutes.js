import express from "express";
import { SignUp, SignIn } from "../controllers/authController.js";

const router = express.Router();

router.post('/signUp', SignUp)
router.post('/signIn', SignIn)

export default router;