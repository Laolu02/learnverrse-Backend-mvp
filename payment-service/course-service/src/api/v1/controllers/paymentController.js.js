import { HTTPSTATUS } from "../../../configs/http.config.js";
import AsyncHandler from "../middlewares/asyncHandler.js";
import {
  findPayment,
  initializePayment,
} from "../services/PaymentService.js";
import { AppError } from "../utils/appError.js";

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
