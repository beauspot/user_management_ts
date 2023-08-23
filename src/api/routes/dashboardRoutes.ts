import express from "express";
import { dashboardCtrl } from "../controllers/dashboardCtrl"
import { auth } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/dashboard", auth, dashboardCtrl);

export default router;
