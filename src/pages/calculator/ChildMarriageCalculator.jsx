import React, { useState } from "react";
import "./ChildMarriageCalculator.css";

const ChildMarriageCalculator = () => {
  const [result, setResult] = useState("");
  const [showResult, setShowResult] = useState(false);

  const formatINR = (n) => {
    return "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const gender = e.target.gender.value;
    const childAge = parseFloat(e.target.childAge.value);
    const currentCost = parseFloat(e.target.currentCost.value);
    const inflation = parseFloat(e.target.inflation.value) / 100;
    const currentInvestments =
      parseFloat(e.target.currentInvestments.value) || 0;
    const expectedReturn = parseFloat(e.target.expectedReturn.value) / 100 || 0;

    if (!gender) {
      setShowResult(true);
      setResult("Please select your child's gender.");
      return;
    }

    const legalAge = gender === "male" ? 21 : 18;
    const yearsLeft = legalAge - childAge;

    if (yearsLeft <= 0) {
      setShowResult(true);
      setResult("Your child has already reached the legal marriage age.");
      return;
    }

    const futureCost = currentCost * Math.pow(1 + inflation, yearsLeft);

    let futureValueInvestments = 0;
    if (currentInvestments > 0 && expectedReturn > 0) {
      futureValueInvestments =
        currentInvestments * Math.pow(1 + expectedReturn, yearsLeft);
    }

    const amountNeeded = futureCost - futureValueInvestments;

    let html = `<div>Estimated Cost of Marriage at Age ${legalAge}: <strong>${formatINR(
      Math.round(futureCost)
    )}</strong></div>`;
    html += `<div style="margin-top:8px;">Years left to plan: <strong>${yearsLeft}</strong></div>`;

    if (futureValueInvestments > 0) {
      html += `<div style="margin-top:8px;">Future Value of Current Investments: <strong>${formatINR(
        Math.round(futureValueInvestments)
      )}</strong></div>`;
    }

    if (amountNeeded > 0) {
      html += `<div style="color:#e53935;margin-top:12px;">You need to accumulate <strong>${formatINR(
        Math.round(amountNeeded)
      )}</strong> more to meet your goal.</div>`;
    } else {
      html += `<div style="color:green;margin-top:12px;">Congratulations! Your current investments are sufficient for the goal.</div>`;
    }

    setShowResult(true);
    setResult(html);
  };

  return (
    <div className="child-calculator container d-flex justify-content-center">
      <div className="">
        <h1>Child Marriage Calculator</h1>
        <div className="subtitle">
          Plan for your child's wedding, the smart way
        </div>
        <div className="legal-note">
          <strong>Note:</strong> The legal minimum marriage age in India is{" "}
          <strong>21 years for boys</strong> and{" "}
          <strong>18 years for girls</strong>.
          <br />
          Please plan accordingly to comply with the law.
        </div>
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="form-group">
            <label>
              Child's Gender<span className="required">*</span>
            </label>
            <select name="gender" required>
              <option value="">Select</option>
              <option value="male">Boy</option>
              <option value="female">Girl</option>
            </select>
          </div>
          <div className="form-group">
            <label>
              Current Age of Child (Years)<span className="required">*</span>
            </label>
            <input
              type="number"
              name="childAge"
              min="0"
              max="40"
              required
              defaultValue="10"
            />
          </div>
          <div className="form-group">
            <label>
              Current Cost of Marriage (₹)<span className="required">*</span>
            </label>
            <input
              type="number"
              name="currentCost"
              min="0"
              required
              defaultValue="1000000"
            />
          </div>
          <div className="form-group">
            <label>
              Expected Inflation Rate (%)<span className="required">*</span>
            </label>
            <input
              type="number"
              name="inflation"
              min="0"
              step="0.1"
              required
              defaultValue="7"
            />
          </div>
          <div className="form-group">
            <label>Current Investments for Goal (₹)</label>
            <input
              type="number"
              name="currentInvestments"
              min="0"
              defaultValue="0"
            />
          </div>
          <div className="form-group">
            <label>Expected Rate of Return on Investments (%)</label>
            <input
              type="number"
              name="expectedReturn"
              min="0"
              step="0.1"
              defaultValue="10"
            />
          </div>
          <div className="button-row">
            <button type="submit" className="submit-btn">
              Calculate
            </button>
          </div>
        </form>
        {showResult && (
          <div
            className="result-box"
            dangerouslySetInnerHTML={{ __html: result }}
          ></div>
        )}
      </div>
    </div>
  );
};

export default ChildMarriageCalculator;
