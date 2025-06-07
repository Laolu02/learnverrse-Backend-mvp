import { Payment } from "../model/paymentModel";
import { options } from "../../../configs/paystackOptions";
import { HTTPSTATUS } from "../../../configs/http.config";

export const findPayment = async (idempotenceId) => {
  try {
    const payment = await Payment.findOne({ idempotenceId });
    return payment;
  } catch (error) {
    console.log("findPayment Error:", error);
    return;
  }
};

export const createPayment = async (body) => {
  try {
    const payment = await Payment.create({ ...body });
    return payment;
  } catch (error) {
    console.log("createPayment Error:", error);
    return;
  }
};

export const initializePayment = async (body) => {
  const { email, paystackAmount, userId, courseId, idempotenceId } = body;
  try {
    const params = JSON.stringify({
      email,
      paystackAmount,
    });

    const response = await axios.post(
      `${process.env.INITIALIZE_URL}`,
      params,
      options
    );
    const { reference } = response.data.data;
    await createPayment({
      email,
      amount: paystackAmount,
      userId,
      courseId,
      idempotenceId,
      reference,
    });
    return response;
  } catch (error) {
    console.log("createPayment error:", error);
    return;
  }
};

export const verifyReference = async (reference) => {
  try {
    const response = axios.get(
      `${process.env.VERIFY_URL}/${reference}`,
      options
    );
    const responseData = response.data.data;
    if (responseData.status === "success") {
      await Payment.findByOneAndUpdate(
        { reference },
        { status: "success" },
        { runValidators: true, new: true }
      );
    } else {
      await Payment.findByOneAndUpdate(
        { reference },
        { status: responseData.status },
        { runValidators: true, new: true }
      );
    }
    return response.data;
  } catch (error) {
    console.log("verifyReference error:", error);
    return;
  }
};

 export const verifyWebHook = async (body) => {
	const {event} = body
	const reference = body.data.reference
	try {
		if(event === 'charge.success'){
		await Payment.findByOneAndUpdate(
        { reference },
        { status: "success" },
        { runValidators: true, new: true }
		)
		return body
	} else {
		 await Payment.findByOneAndUpdate(
        { reference },
        { status: event },
        { runValidators: true, new: true }
      );
	  return body
	}
	} catch (error) {
		console.log('verify hook error', error)
	}
 }