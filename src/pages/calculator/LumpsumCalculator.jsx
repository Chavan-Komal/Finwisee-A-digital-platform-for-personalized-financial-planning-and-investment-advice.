import React, { useState } from 'react';
import './Calculator.css';

const LumpsumCalculator = () => {
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [years, setYears] = useState('');
  const [result, setResult] = useState(null);

  const calculateLumpsum = (e) => {
    e.preventDefault();
    const P = parseFloat(principal);
    const r = parseFloat(rate) / 100;
    const n = parseInt(years);
    if (P > 0 && r > 0 && n > 0) {
      const maturity = P * Math.pow(1 + r, n);
      setResult(maturity);
    } else {
      setResult(null);
    }
  };

  return (
    <div className="calculator-container">
      <h2>Lumpsum Calculator</h2>
      <form className="calculator-form" onSubmit={calculateLumpsum}>
        <div className="form-group">
          <label>Principal (₹)</label>
          <input type="number" value={principal} onChange={e => setPrincipal(e.target.value)} required min="0" />
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

export default LumpsumCalculator;