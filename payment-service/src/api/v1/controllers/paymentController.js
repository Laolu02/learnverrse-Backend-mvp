import { HTTPSTATUS } from "../../../configs/http.config.js";
import AsyncHandler from "../middlewares/asyncHandler.js";
import {
  findPayment,
  initializePayment,
  verifyWebHook,
  verifyReference
} from "../services/PaymentService.js";
import { AppError } from "../utils/appError.js";
import {createHmac} from 'crypto'

export const makePayment = AsyncHandler(async (req, res) => {
  const { email, amount, userId, courseId, idempotenceId } = req.body;
  const payment = await findPayment(idempotenceId);
  if (payment) {
    throw new AppError("payment already initiated, verify payment");
  }
  const paystackAmount = amount * 100;

  const response = await initializePayment({
    email,
    paystackAmount,
    userId,
    courseId,
    idempotenceId,
  });
  console.log(response);
  if (!response) {
    throw new AppError("payment initialization failed");
  }

  res.status(HTTPSTATUS.CREATED).json(response.data.data);
});

export const verifyPayment = AsyncHandler(async (req, res) => {
  const { reference } = req.params;
  const response = await verifyReference(reference);
  if (response.data.status === "success") {
    return res
      .status(HTTPSTATUS.OK)
      .json({ msg: response.data.message, response });
  } else {
    throw new AppError(response.data.message);
  }
});

export const webhook = AsyncHandler(async (req, res) => {
  const paystackSignature = req.headers['x-paystack-signature']
  const paystackHash = createHmac('sha512', process.env.PAYSTACK_SECRET_KEY).update(req.body).digest('hex')
  if(paystackHash !== paystackSignature){
    throw new AppError('Invalid signature')
  }
  const response =  await verifyWebHook(JSON.parse(req.body))
  if(response.event === 'charge.success'){
   return res.status(HTTPSTATUS.OK).send(200)
  } else {
    throw new AppError(response.reason)
  }
})
