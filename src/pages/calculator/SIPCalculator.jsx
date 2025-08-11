import React, { useState } from 'react';
import './Calculator.css';

const SIPCalculator = () => {
  const [monthly, setMonthly] = useState('');
  const [rate, setRate] = useState('');
  const [years, setYears] = useState('');
  const [result, setResult] = useState(null);

  const calculateSIP = (e) => {
    e.preventDefault();
    const P = parseFloat(monthly);
    const r = parseFloat(rate) / 100 / 12;
    const n = parseInt(years) * 12;
    if (P > 0 && r > 0 && n > 0) {
      const maturity = P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
      setResult(maturity);
    } else {
      setResult(null);
    }
  };

  return (
    <div className="calculator-container">
      <h2>SIP Calculator</h2>
      <form className="calculator-form" onSubmit={calculateSIP}>
        <div className="form-group">
          <label>Monthly Investment (₹)</label>
          <input type="number" value={monthly} onChange={e => setMonthly(e.target.value)} required min="0" />
        </div>
        <div className="form-group">
          <label>Expected Return (p.a. %)</label>
          <input type="number" value={rate} onChange={e => setRate(e.target.value)} required min="0" step="0.01" />
        </div>
        <div className="form-group">
          <label>Investment Period (years)</label>
          <input type="number" value={years} onChange={e => setYears(e.target.value)} required min="1" />
        </div>
        <button className="btn-primary" type="submit">Calculate</button>
      </form>
      {result !== null && (
        <div className="calculator-result">
          <h4>Maturity Amount</h4>
          <p>₹ {result.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
        </div>
      )}
    </div>
  );
};

export default SIPCalculator;