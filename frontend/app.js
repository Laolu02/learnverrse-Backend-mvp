document
  .getElementById("paymentForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const amount = Number(document.getElementById("amount").value);

    if (!email || !amount || amount <= 0) {
      alert("Please enter valid details");
      return;
    }

    try {
      const response = await fetch("http://localhost:3002/api/v1/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          amount,
          courseId: 1,
          userId: 2,
          idempotenceId: 72834,
        }),
      });
      if (!response.ok) {
        const text = await response.text();
        console.error("API error:", response.status, text);
        throw new Error("Payment initiation failed");
      }
      const data = await response.json();

      if (!data.authorization_url) {
        alert("Failed to initialize payment");
        return;
      }

      // Redirect to Paystack
      window.location.href = data.authorization_url;
    } catch (err) {
      console.error("Payment initiation failed:", err);
      alert("Error occurred. Please try again.");
    }
  });
