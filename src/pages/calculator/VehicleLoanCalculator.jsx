import React, { useState } from "react";
import "./VehicleLoanCalculator.css";

const VehicleLoanCalculator = () => {
  const [formData, setFormData] = useState({
    vehiclePrice: 1000000,
    downPayment: 100000,
    loanTerm: 5,
    interestRate: 9,
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const formatINR = (n) => {
    return "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const val = parseFloat(value);

    setFormData((prevData) => ({
      ...prevData,
      [name]: isNaN(val) ? "" : val,
    }));

    // Clear result and error on input change
    setResult(null);
    setError("");
  };

  const validateForm = () => {
    const { vehiclePrice, downPayment, loanTerm, interestRate } = formData;

    if (
      vehiclePrice === "" ||
      downPayment === "" ||
      loanTerm === "" ||
      interestRate === ""
    ) {
      return false;
    }

    if (downPayment > vehiclePrice) {
      setError("Down payment cannot exceed vehicle price.");
      return false;
    }

    if (
      vehiclePrice <= 0 ||
      downPayment < 0 ||
      loanTerm < 1 ||
      interestRate < 0
    ) {
      setError("Please enter valid positive values.");
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setResult(null);
      return;
    }

    setError("");

    const { vehiclePrice, downPayment, loanTerm, interestRate } = formData;

    const principal = vehiclePrice - downPayment;
    const n = loanTerm * 12;
    const r = interestRate / 12 / 100;

    let emi = 0;
    if (r === 0) {
      emi = principal / n;
    } else {
      emi = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    }

    const totalPayment = emi * n;
    const totalInterest = totalPayment - principal;

    setResult(
      <>
        <div>
          Loan Amount: <strong>{formatINR(Math.round(principal))}</strong>
        </div>
        <div style={{ marginTop: "8px" }}>
          Monthly EMI: <strong>{formatINR(Math.round(emi))}</strong>
        </div>
        <div style={{ marginTop: "8px" }}>
          Total Interest Payable:{" "}
          <strong>{formatINR(Math.round(totalInterest))}</strong>
        </div>
        <div style={{ marginTop: "8px" }}>
          Total Payment (Principal + Interest):{" "}
          <strong>{formatINR(Math.round(totalPayment))}</strong>
        </div>
      </>
    );
  };

  const isSubmitDisabled = !validateForm();

  return (
    <div className="vehicle-calculator">
      <div className="container">
        <h1>Vehicle Loan Calculator</h1>
        <div className="subtitle">Estimate your EMI and total loan cost</div>
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="form-group">
            <label>
              Vehicle Price (₹)<span className="required">*</span>
            </label>
            <input
              type="number"
              name="vehiclePrice"
              min="0"
              required
              value={formData.vehiclePrice}
              onChange={handleChange}
              className={
                error && formData.downPayment > formData.vehiclePrice
                  ? "error"
                  : ""
              }
            />
          </div>
          <div className="form-group">
            <label>
              Down Payment (₹)<span className="required">*</span>
            </label>
            <input
              type="number"
              name="downPayment"
              min="0"
              required
              value={formData.downPayment}
              onChange={handleChange}
              className={
                error && formData.downPayment > formData.vehiclePrice
                  ? "error"
                  : ""
              }
            />
            {error && (
              <div className="error-message" role="alert" aria-live="assertive">
                {error}
              </div>
            )}
          </div>
          <div className="form-group">
            <label>
              Loan Term (Years)<span className="required">*</span>
            </label>
            <input
              type="number"
              name="loanTerm"
              min="1"
              max="10"
              required
              value={formData.loanTerm}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>
              Interest Rate (% per annum)<span className="required">*</span>
            </label>
            <input
              type="number"
              name="interestRate"
              min="0"
              step="0.01"
              required
              value={formData.interestRate}
              onChange={handleChange}
            />
          </div>
          <div className="button-row">
            <button type="submit" disabled={isSubmitDisabled}>
              Calculate
            </button>
          </div>
        </form>

        {result && <div className="result-box">{result}</div>}

        <div className="text-center mt-4">
          <a href="calculator.html" className="btn btn-outline-primary">
            ← Back to All Calculators
          </a>
        </div>
      </div>
    </div>
  );
};

export default VehicleLoanCalculator;
