import React, { useState } from "react";
import "./HomeGoalCalculator.css";

const HomeGoalCalculator = () => {
  const [resultHtml, setResultHtml] = useState("");
  const [showResult, setShowResult] = useState(false);

  const formatINR = (n) => {
    return "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const form = e.target;
    const currentCost = parseFloat(form.currentCost.value);
    const yearsToGoal = parseFloat(form.yearsToGoal.value);
    const inflation = parseFloat(form.inflation.value) / 100;
    const currentSavings = parseFloat(form.currentSavings.value) || 0;
    const expectedReturn = parseFloat(form.expectedReturn.value) / 100 || 0;

    const futureCost = currentCost * Math.pow(1 + inflation, yearsToGoal);

    let futureValueSavings = 0;
    if (currentSavings > 0 && expectedReturn > 0) {
      futureValueSavings =
        currentSavings * Math.pow(1 + expectedReturn, yearsToGoal);
    }

    const amountNeeded = futureCost - futureValueSavings;

    let html = `<div>Estimated Future Cost of Home: <strong>${formatINR(
      Math.round(futureCost)
    )}</strong></div>`;
    if (futureValueSavings > 0) {
      html += `<div style="margin-top:8px;">Future Value of Current Savings: <strong>${formatINR(
        Math.round(futureValueSavings)
      )}</strong></div>`;
    }
    if (amountNeeded > 0) {
      html += `<div style="color:#e53935;margin-top:12px;">You need to accumulate <strong>${formatINR(
        Math.round(amountNeeded)
      )}</strong> more to reach your goal.</div>`;
    } else {
      html += `<div style="color:green;margin-top:12px;">Congratulations! Your current savings are sufficient for your goal.</div>`;
    }

    setResultHtml(html);
    setShowResult(true);
  };

  return (
    <div className="hgc-container">
      <h1 className="hgc-title">Home Goal Calculator</h1>
      <div className="hgc-subtitle">Plan your savings for your dream home</div>
      <form className="hgc-form" onSubmit={handleSubmit} autoComplete="off">
        <div className="hgc-form-group">
          <label htmlFor="currentCost">
            Current Cost of Desired Home (₹)
            <span className="hgc-required">*</span>
          </label>
          <input
            id="currentCost"
            name="currentCost"
            type="number"
            min="0"
            required
            defaultValue="5000000"
          />
        </div>
        <div className="hgc-form-group">
          <label htmlFor="yearsToGoal">
            Years Until Purchase
            <span className="hgc-required">*</span>
          </label>
          <input
            id="yearsToGoal"
            name="yearsToGoal"
            type="number"
            min="1"
            max="40"
            required
            defaultValue="5"
          />
        </div>
        <div className="hgc-form-group">
          <label htmlFor="inflation">
            Expected Inflation Rate (%)
            <span className="hgc-required">*</span>
          </label>
          <input
            id="inflation"
            name="inflation"
            type="number"
            min="0"
            step="0.1"
            required
            defaultValue="6"
          />
        </div>
        <div className="hgc-form-group">
          <label htmlFor="currentSavings">Current Savings for Goal (₹)</label>
          <input
            id="currentSavings"
            name="currentSavings"
            type="number"
            min="0"
            defaultValue="0"
          />
        </div>
        <div className="hgc-form-group">
          <label htmlFor="expectedReturn">
            Expected Rate of Return on Savings (%)
          </label>
          <input
            id="expectedReturn"
            name="expectedReturn"
            type="number"
            min="0"
            step="0.1"
            defaultValue="8"
          />
        </div>
        <div className="hgc-button-row">
          <button type="submit" className="hgc-submit-btn">
            Calculate
          </button>
        </div>
      </form>
      {showResult && (
        <div
          className="hgc-result-box"
          dangerouslySetInnerHTML={{ __html: resultHtml }}
          aria-live="polite"
        />
      )}
    </div>
  );
};

export default HomeGoalCalculator;
