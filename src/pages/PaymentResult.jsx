import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function PaymentResult() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const status = params.get("status");
  const reference = params.get("reference"); // bookingId

  useEffect(() => {
    if (status === "success" && reference) {
      // temporary confirm API call to backend
      fetch(`http://localhost:5000/api/payment/confirm/${reference}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      })
        .then(() => {
          toast.success("Booking confirmed successfully!");
          navigate("/booking-success");
        })
        .catch(() => toast.error("Failed to confirm booking."));
    }
  }, [status, reference, navigate]);

  return (
    <div className="text-center mt-20">
      {status === "success" ? (
        <h2 className="text-3xl text-green-600 font-bold">
          ✅ Payment Successful!
        </h2>
      ) : (
        <h2 className="text-3xl text-red-600 font-bold">
          ❌ Payment Failed!
        </h2>
      )}
      <p className="mt-4">You can close this page now.</p>
    </div>
  );
}
