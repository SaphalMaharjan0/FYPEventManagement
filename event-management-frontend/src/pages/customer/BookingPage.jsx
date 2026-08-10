import React, { useState } from "react";
import { Check, ArrowLeft, Ticket } from "lucide-react";
import { useSettings } from "../../contexts/SettingsContext";
import { formatPrice, formatDate, formatShortAddress } from "../../utils/formatting";
import { useFetch } from "../../hooks/useFetch";

export default function BookingPage({ event, initialQuantity, onBookingSuccess, onNavigate }) {
  const fetchWithAuth = useFetch();
  const { currency, region } = useSettings();
  const [quantity, setQuantity] = useState(initialQuantity || 1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("esewa");
  const [isProcessing, setIsProcessing] = useState(false);

  if (!event) {
    return (
      <div style={{ textAlign: "center", padding: "4rem" }}>
        <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>No event selected</h2>
        <button 
          onClick={() => onNavigate("events")}
          style={{ padding: "0.75rem 1.5rem", backgroundColor: "var(--color-blue-500)", color: "var(--color-white)", borderRadius: "0.5rem", border: "none", cursor: "pointer" }}
        >
          Browse Events
        </button>
      </div>
    );
  }

  const handleIncrement = () => {
    if (quantity < event.seatsLeft) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (paymentMethod === "esewa") {
      setIsProcessing(true);
      try {
        const response = await fetchWithAuth("/api/customer/bookings/initiate-esewa", {
          method: "POST",
          body: JSON.stringify({ eventId: event.id, quantity })
        });
        
        if (response && (response.signature || response.transactionUuid)) {
          // Redirect to the eSewa Sandbox (rc-epay) via form submission
          const form = document.createElement("form");
          const esewaUrl = response.esewaUrl || "https://rc-epay.esewa.com.np/api/epay/main/v2/form";
          // Use GET for mock so Vite dev server can route to the React page
          const isMock = esewaUrl.includes("localhost") || esewaUrl.includes("mock-esewa");
          form.setAttribute("method", isMock ? "GET" : "POST");
          form.setAttribute("action", esewaUrl); // rc-epay is the eSewa Sandbox environment

          const addField = (name, value) => {
            const hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", name);
            hiddenField.setAttribute("value", value);
            form.appendChild(hiddenField);
          };

          addField("amount", response.amount);
          addField("tax_amount", response.taxAmount);
          addField("total_amount", response.totalAmount);
          addField("transaction_uuid", response.transactionUuid);
          addField("product_code", response.productCode);
          addField("product_service_charge", response.productServiceCharge);
          addField("product_delivery_charge", response.productDeliveryCharge);
          addField("success_url", response.successUrl);
          addField("failure_url", response.failureUrl);
          addField("signed_field_names", response.signedFieldNames);
          addField("signature", response.signature);

          document.body.appendChild(form);
          form.submit();
        } else {
          alert("Failed to initiate eSewa payment");
          setIsProcessing(false);
        }
      } catch (err) {
        console.error(err);
        alert("Error connecting to server for payment");
        setIsProcessing(false);
      }
    } else if (paymentMethod === "khalti") {
      setIsProcessing(true);
      try {
        const response = await fetchWithAuth("/api/customer/bookings/initiate-khalti", {
          method: "POST",
          body: JSON.stringify({ eventId: event.id, quantity })
        });
        
        if (response && response.paymentUrl) {
          // Redirect the user directly to the Khalti payment page
          window.location.href = response.paymentUrl;
        } else {
          alert("Failed to initiate Khalti payment");
          setIsProcessing(false);
        }
      } catch (err) {
        console.error(err);
        alert("Error connecting to server for payment");
        setIsProcessing(false);
      }
    } else if (paymentMethod === "cash") {
      setIsProcessing(true);
      try {
        const response = await fetchWithAuth("/api/customer/bookings/cash", {
          method: "POST",
          body: JSON.stringify({ eventId: event.id, quantity })
        });
        
        if (response && response.success) {
          onBookingSuccess(event.id, quantity);
          setIsSuccess(true);
        } else {
          alert("Failed to process cash booking");
          setIsProcessing(false);
        }
      } catch (err) {
        console.error(err);
        alert("Error connecting to server for booking");
        setIsProcessing(false);
      }
    } else {
      onBookingSuccess(event.id, quantity);
      setIsSuccess(true);
    }
  };

  const totalPrice = event.price * quantity;

  if (isSuccess) {
    return (
      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "2rem", backgroundColor: "var(--color-white)", borderRadius: "1rem", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)", textAlign: "center" }}>
        <div style={{ width: "80px", height: "80px", backgroundColor: "#dcfce7", color: "#166534", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
          <Check size={40} />
        </div>
        <h1 style={{ fontSize: "2rem", fontWeight: "bold", color: "var(--color-slate-900)", marginBottom: "1rem" }}>Booking Confirmed!</h1>
        <p style={{ color: "var(--color-slate-500)", marginBottom: "2rem", fontSize: "1.1rem" }}>
          You have successfully booked {quantity} ticket{quantity > 1 ? "s" : ""} to <strong>{event.title}</strong>.
        </p>

        <div style={{ backgroundColor: "var(--color-slate-50)", padding: "1.5rem", borderRadius: "0.75rem", border: "1px solid #e2e8f0", textAlign: "left", marginBottom: "2rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem", fontSize: "0.95rem" }}>
            <span style={{ color: "var(--color-slate-500)" }}>Order Reference:</span>
            <span style={{ fontWeight: "600", color: "var(--color-slate-900)" }}>EP-{Math.floor(100000 + Math.random() * 900000)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem", fontSize: "0.95rem" }}>
            <span style={{ color: "var(--color-slate-500)" }}>Tickets:</span>
            <span style={{ fontWeight: "600", color: "var(--color-slate-900)" }}>{quantity}x General Admission</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #e2e8f0", paddingTop: "1rem", fontSize: "1.1rem" }}>
            <span style={{ color: "var(--color-slate-500)", fontWeight: "500" }}>Total Paid:</span>
            <span style={{ fontWeight: "bold", color: "var(--color-green-500)" }}>{formatPrice(totalPrice, currency)}</span>
          </div>
        </div>

        <button 
          onClick={() => onNavigate("customer-bookings")}
          style={{ width: "100%", padding: "1rem", backgroundColor: "var(--color-blue-500)", color: "var(--color-white)", borderRadius: "0.5rem", border: "none", fontWeight: "600", fontSize: "1rem", cursor: "pointer" }}
        >
          View My Bookings
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      <button 
        onClick={() => onNavigate("event-details")}
        style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "none", border: "none", color: "var(--color-slate-500)", fontWeight: "500", cursor: "pointer", marginBottom: "2rem" }}
      >
        <ArrowLeft size={16} />
        Back to Event Details
      </button>

      <div className="booking-grid">
        
        {/* Left Column: Event Summary */}
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: "bold", color: "var(--color-slate-900)", marginBottom: "1.5rem" }}>Checkout</h1>
          <div style={{ backgroundColor: "var(--color-white)", borderRadius: "1rem", border: "1px solid #e2e8f0", overflow: "hidden" }}>
            <img src={event.image} alt={event.title} style={{ width: "100%", height: "200px", objectFit: "cover" }} />
            <div style={{ padding: "1.5rem" }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "var(--color-slate-900)", marginBottom: "0.5rem" }}>{event.title}</h2>
              <p style={{ color: "var(--color-slate-500)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>{formatDate(event.date, region) || event.date} · {formatShortAddress(event.venue)}</p>
              
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #e2e8f0", paddingTop: "1.5rem" }}>
                <span style={{ fontWeight: "600", color: "var(--color-slate-900)" }}>General Admission</span>
                <span style={{ fontWeight: "600", color: "var(--color-slate-900)" }}>{formatPrice(event.price, currency)} / ticket</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Ticket Selection & Payment */}
        <div>
          <form onSubmit={handleCheckoutSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            
            {/* Ticket Selector */}
            <div style={{ backgroundColor: "var(--color-white)", padding: "1.5rem", borderRadius: "1rem", border: "1px solid #e2e8f0" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "600", color: "var(--color-slate-900)", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Ticket size={18} />
                Select Tickets
              </h3>
              
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontWeight: "500", color: "var(--color-slate-900)" }}>Quantity</div>
                  <div style={{ fontSize: "0.85rem", color: "var(--color-slate-500)" }}>Max {event.seatsLeft} available</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <button type="button" onClick={handleDecrement} disabled={quantity <= 1} style={{ width: "32px", height: "32px", borderRadius: "50%", border: "1px solid #e2e8f0", backgroundColor: quantity <= 1 ? "var(--color-slate-50)" : "var(--color-white)", cursor: quantity <= 1 ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", color: "var(--color-slate-900)" }}>-</button>
                  <span style={{ fontWeight: "600", fontSize: "1.1rem", width: "20px", textAlign: "center" }}>{quantity}</span>
                  <button type="button" onClick={handleIncrement} disabled={quantity >= event.seatsLeft} style={{ width: "32px", height: "32px", borderRadius: "50%", border: "1px solid #e2e8f0", backgroundColor: quantity >= event.seatsLeft ? "var(--color-slate-50)" : "var(--color-white)", cursor: quantity >= event.seatsLeft ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", color: "var(--color-slate-900)" }}>+</button>
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div style={{ backgroundColor: "var(--color-white)", padding: "1.5rem", borderRadius: "1rem", border: "1px solid #e2e8f0" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "600", color: "var(--color-slate-900)", marginBottom: "1rem" }}>
                Payment Method
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                  <input type="radio" name="paymentMethod" value="esewa" checked={paymentMethod === "esewa"} onChange={() => setPaymentMethod("esewa")} />
                  <img src="https://esewa.com.np/common/images/esewa-logo.png" alt="eSewa" style={{ height: "24px", objectFit: "contain", marginLeft: "0.5rem" }} />
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                  <input type="radio" name="paymentMethod" value="khalti" checked={paymentMethod === "khalti"} onChange={() => setPaymentMethod("khalti")} />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/e/ee/Khalti_Digital_Wallet_Logo.png.jpg" alt="Khalti" style={{ height: "24px", objectFit: "contain", marginLeft: "0.5rem", borderRadius: "4px" }} />
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                  <input type="radio" name="paymentMethod" value="cash" checked={paymentMethod === "cash"} onChange={() => setPaymentMethod("cash")} />
                  <span style={{ fontWeight: "500", marginLeft: "0.5rem" }}>Cash on Arrival / Mock</span>
                </label>
              </div>
            </div>

            {/* Total Calculation */}
            <div style={{ backgroundColor: "var(--color-slate-50)", padding: "1.5rem", borderRadius: "1rem", border: "1px solid #e2e8f0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem", color: "var(--color-slate-500)" }}>
                <span>Subtotal ({quantity} tickets)</span>
                <span>{formatPrice(totalPrice, currency)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem", color: "var(--color-slate-500)" }}>
                <span>Taxes & Fees</span>
                <span>{formatPrice(0, currency)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #e2e8f0", paddingTop: "1rem", fontSize: "1.25rem", fontWeight: "bold", color: "var(--color-slate-900)" }}>
                <span>Total</span>
                <span>{formatPrice(totalPrice, currency)}</span>
              </div>
            </div>

            <button 
              type="submit"
              style={{ width: "100%", padding: "1rem", backgroundColor: "var(--color-blue-500)", color: "var(--color-white)", border: "none", borderRadius: "0.5rem", fontSize: "1.1rem", fontWeight: "bold", cursor: "pointer", transition: "background-color 0.2s" }}
              onMouseEnter={(e) => { if(!isProcessing) e.target.style.backgroundColor = "var(--color-blue-600)" }}
              onMouseLeave={(e) => { if(!isProcessing) e.target.style.backgroundColor = "var(--color-blue-500)" }}
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : `Confirm Booking • ${formatPrice(totalPrice, currency)}`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
