import express from "express";
import { signup_a_user, login_user } from "../controllers/userCtrl";

const router = express.Router();

router.post("/signup", signup_a_user);
router.post("/login", login_user);

export default router;
