import React, { useState } from "react";
import "./NetWorthCalculator.css";

export default function NetWorthCalculator() {
  const [resultHtml, setResultHtml] = useState("");
  const [showResult, setShowResult] = useState(false);

  const formatINR = (n) =>
    "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 0 });

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;

    const getValue = (name) => parseFloat(form[name].value) || 0;

    // Assets
    const totalAssets =
      getValue("realEstate") +
      getValue("vehicles") +
      getValue("cashBank") +
      getValue("otherAssets");

    // Investments
    const totalInvestments =
      getValue("stocks") +
      getValue("bonds") +
      getValue("gold") +
      getValue("otherInvestments");

    // Retirement
    const totalRetirement =
      getValue("pf") + getValue("nps") + getValue("otherRetirement");

    // Miscellaneous
    const totalMisc = getValue("insurance") + getValue("otherMisc");

    // Liabilities
    const totalLiabilities =
      getValue("homeLoan") +
      getValue("vehicleLoan") +
      getValue("personalLoan") +
      getValue("creditCard") +
      getValue("otherLiabilities");

    const netWorth =
      totalAssets +
      totalInvestments +
      totalRetirement +
      totalMisc -
      totalLiabilities;

    let html = `<div>Total Assets: <strong>${formatINR(
      Math.round(totalAssets)
    )}</strong></div>`;
    html += `<div>Total Investments: <strong>${formatINR(
      Math.round(totalInvestments)
    )}</strong></div>`;
    html += `<div>Total Retirement Accounts: <strong>${formatINR(
      Math.round(totalRetirement)
    )}</strong></div>`;
    html += `<div>Total Miscellaneous: <strong>${formatINR(
      Math.round(totalMisc)
    )}</strong></div>`;
    html += `<div>Total Liabilities: <strong>${formatINR(
      Math.round(totalLiabilities)
    )}</strong></div>`;
    html += `<div style="margin-top:12px;">Net Worth: <strong>${formatINR(
      Math.round(netWorth)
    )}</strong></div>`;

    if (netWorth > 0) {
      html += `<div style="color:green;margin-top:12px;">You have a positive net worth. Good financial health!</div>`;
    } else if (netWorth < 0) {
      html += `<div style="color:#e53935;margin-top:12px;">Your net worth is negative. Consider reducing liabilities or increasing assets.</div>`;
    } else {
      html += `<div style="color:#555;margin-top:12px;">Your net worth is zero.</div>`;
    }

    setResultHtml(html);
    setShowResult(true);
  };

  return (
    <div className="nwc-container">
      <h1 className="nwc-title">Net Worth Calculator</h1>
      <div className="nwc-subtitle">
        Calculate your net worth: Assets + Investments + Retirement +
        Miscellaneous – Liabilities
      </div>
      <form className="nwc-form" onSubmit={handleSubmit} autoComplete="off">
        <div className="nwc-section">
          <div className="nwc-section-title">Assets</div>
          <div className="nwc-form-group">
            <label htmlFor="realEstate">Real Estate (₹)</label>
            <input
              type="number"
              id="realEstate"
              name="realEstate"
              min="0"
              defaultValue="0"
            />
          </div>
          <div className="nwc-form-group">
            <label htmlFor="vehicles">Vehicles (₹)</label>
            <input
              type="number"
              id="vehicles"
              name="vehicles"
              min="0"
              defaultValue="0"
            />
          </div>
          <div className="nwc-form-group">
            <label htmlFor="cashBank">Cash & Bank Accounts (₹)</label>
            <input
              type="number"
              id="cashBank"
              name="cashBank"
              min="0"
              defaultValue="0"
            />
          </div>
          <div className="nwc-form-group">
            <label htmlFor="otherAssets">Other Assets (₹)</label>
            <input
              type="number"
              id="otherAssets"
              name="otherAssets"
              min="0"
              defaultValue="0"
            />
          </div>
        </div>

        <div className="nwc-section">
          <div className="nwc-section-title">Investments</div>
          <div className="nwc-form-group">
            <label htmlFor="stocks">Stocks & Mutual Funds (₹)</label>
            <input
              type="number"
              id="stocks"
              name="stocks"
              min="0"
              defaultValue="0"
            />
          </div>
          <div className="nwc-form-group">
            <label htmlFor="bonds">Bonds & FDs (₹)</label>
            <input
              type="number"
              id="bonds"
              name="bonds"
              min="0"
              defaultValue="0"
            />
          </div>
          <div className="nwc-form-group">
            <label htmlFor="gold">Gold & Jewellery (₹)</label>
            <input
              type="number"
              id="gold"
              name="gold"
              min="0"
              defaultValue="0"
            />
          </div>
          <div className="nwc-form-group">
            <label htmlFor="otherInvestments">Other Investments (₹)</label>
            <input
              type="number"
              id="otherInvestments"
              name="otherInvestments"
              min="0"
              defaultValue="0"
            />
          </div>
        </div>

        <div className="nwc-section">
          <div className="nwc-section-title">Retirement Accounts</div>
          <div className="nwc-form-group">
            <label htmlFor="pf">Provident Fund / PPF (₹)</label>
            <input type="number" id="pf" name="pf" min="0" defaultValue="0" />
          </div>
          <div className="nwc-form-group">
            <label htmlFor="nps">NPS (₹)</label>
            <input type="number" id="nps" name="nps" min="0" defaultValue="0" />
          </div>
          <div className="nwc-form-group">
            <label htmlFor="otherRetirement">
              Other Retirement Accounts (₹)
            </label>
            <input
              type="number"
              id="otherRetirement"
              name="otherRetirement"
              min="0"
              defaultValue="0"
            />
          </div>
        </div>

        <div className="nwc-section">
          <div className="nwc-section-title">Miscellaneous</div>
          <div className="nwc-form-group">
            <label htmlFor="insurance">Insurance Surrender Value (₹)</label>
            <input
              type="number"
              id="insurance"
              name="insurance"
              min="0"
              defaultValue="0"
            />
          </div>
          <div className="nwc-form-group">
            <label htmlFor="otherMisc">Other Miscellaneous (₹)</label>
            <input
              type="number"
              id="otherMisc"
              name="otherMisc"
              min="0"
              defaultValue="0"
            />
          </div>
        </div>

        <div className="nwc-section">
          <div className="nwc-section-title">Liabilities</div>
          <div className="nwc-form-group">
            <label htmlFor="homeLoan">Home Loan (₹)</label>
            <input
              type="number"
              id="homeLoan"
              name="homeLoan"
              min="0"
              defaultValue="0"
            />
          </div>
          <div className="nwc-form-group">
            <label htmlFor="vehicleLoan">Car/Vehicle Loan (₹)</label>
            <input
              type="number"
              id="vehicleLoan"
              name="vehicleLoan"
              min="0"
              defaultValue="0"
            />
          </div>
          <div className="nwc-form-group">
            <label htmlFor="personalLoan">Personal Loan (₹)</label>
            <input
              type="number"
              id="personalLoan"
              name="personalLoan"
              min="0"
              defaultValue="0"
            />
          </div>
          <div className="nwc-form-group">
            <label htmlFor="creditCard">Credit Card Dues (₹)</label>
            <input
              type="number"
              id="creditCard"
              name="creditCard"
              min="0"
              defaultValue="0"
            />
          </div>
          <div className="nwc-form-group">
            <label htmlFor="otherLiabilities">Other Liabilities (₹)</label>
            <input
              type="number"
              id="otherLiabilities"
              name="otherLiabilities"
              min="0"
              defaultValue="0"
            />
          </div>
        </div>

        <div className="nwc-button-row">
          <button type="submit">Calculate Net Worth</button>
        </div>
      </form>

      {showResult && (
        <div
          className="nwc-result-box"
          dangerouslySetInnerHTML={{ __html: resultHtml }}
        />
      )}
    </div>
  );
}
