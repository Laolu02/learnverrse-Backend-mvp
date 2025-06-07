import express from "express";
import { makePayment, verifyPayment } from "./";
import { auth } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/", auth, makePayment);

router.get("/:id", auth, verifyPayment);


export default router;
