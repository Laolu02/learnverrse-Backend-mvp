import express from "express";
import { makePayment, verifyPayment , webhook} from "./";
import { auth } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/", auth, makePayment);

router.get("/verify/:id", auth, verifyPayment);

router.use('/webhook', 
	express.raw({type: 'application/json'})
)

router.post('/webhook', auth, webhook)


export default router;
