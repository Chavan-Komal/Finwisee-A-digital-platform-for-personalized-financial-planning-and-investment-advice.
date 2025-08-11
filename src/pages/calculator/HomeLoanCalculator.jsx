import React, { useState, useEffect } from "react";
import "./HomeLoanCalculator.css";
import { Link } from "react-router-dom";

const HomeLoanCalculator = () => {
  const [loanAmount, setLoanAmount] = useState(500000);
  const [interestRate, setInterestRate] = useState(7);
  const [loanTenure, setLoanTenure] = useState(20);
  const [emi, setEmi] = useState(0);

  useEffect(() => {
    calculateEMI();
  }, []);

  const formatCurrency = (value) => {
    return `₹ ${Number(value).toLocaleString()}`;
  };

  const calculateEMI = () => {
    const principal = loanAmount;
    const monthlyRate = interestRate / 12 / 100;
    const months = loanTenure * 12;
    const emiValue =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);

    setEmi(Math.round(emiValue));
  };

  return (
    <div className="home-loan-calculator">
      <div className="hl-title">Home Loan EMI Calculator</div>
      <div className="hl-subtitle">Estimation for your Home Loan EMI</div>

      <div className="hl-container">
        <div className="calculator">
          <div className="left-panel">
            <div className="form-group">
              <label>Loan Amount (₹) *</label>
              <input
                type="range"
                min="10000"
                max="10000000"
                step="1000"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
              />
              <div className="value-display">{formatCurrency(loanAmount)}</div>
            </div>

            <div className="form-group">
              <label>Interest Rate (%) *</label>
              <input
                type="range"
                min="1"
                max="15"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
              />
              <div className="value-display">{interestRate}%</div>
            </div>

            <div className="form-group">
              <label>Loan Tenure (Years) *</label>
              <input
                type="range"
                min="1"
                max="30"
                step="1"
                value={loanTenure}
                onChange={(e) => setLoanTenure(Number(e.target.value))}
              />
              <div className="value-display">{loanTenure} Yrs</div>
            </div>

            <button onClick={calculateEMI}>Submit</button>
          </div>

          <div className="right-panel">
            <div>
              Home Loan EMI
              <br />₹ {emi.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mt-4">
        <Link to="/home/calculator" className="btn-outline-primary">
          <i className="bi bi-arrow-left me-2"></i>Back to All Calculators
        </Link>
      </div>
    </div>
  );
};

export default HomeLoanCalculator;
