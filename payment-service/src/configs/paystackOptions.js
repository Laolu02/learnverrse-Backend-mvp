export const options = {
	headers: {
	  Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
	  "Content-Type": "application/json",
	},
  };