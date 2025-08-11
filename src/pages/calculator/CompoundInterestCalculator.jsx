import React, { useState } from 'react';
import './Calculator.css';

const CompoundInterestCalculator = () => {
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [times, setTimes] = useState('');
  const [years, setYears] = useState('');
  const [result, setResult] = useState(null);

  const calculateCompound = (e) => {
    e.preventDefault();
    const P = parseFloat(principal);
    const r = parseFloat(rate) / 100;
    const n = parseInt(times);
    const t = parseInt(years);
    if (P > 0 && r > 0 && n > 0 && t > 0) {
      const amount = P * Math.pow(1 + r / n, n * t);
      setResult(amount);
    } else {
      setResult(null);
    }
  };

  return (
    <div className="calculator-container">
      <h2>Compound Interest Calculator</h2>
      <form className="calculator-form" onSubmit={calculateCompound}>
        <div className="form-group">
          <label>Principal (₹)</label>
          <input type="number" value={principal} onChange={e => setPrincipal(e.target.value)} required min="0" />
        </div>
        <div className="form-group">
          <label>Annual Interest Rate (%)</label>
          <input type="number" value={rate} onChange={e => setRate(e.target.value)} required min="0" step="0.01" />
        </div>
        <div className="form-group">
          <label>Times Compounded Per Year</label>
          <input type="number" value={times} onChange={e => setTimes(e.target.value)} required min="1" />
        </div>
        <div className="form-group">
          <label>Years</label>
          <input type="number" value={years} onChange={e => setYears(e.target.value)} required min="1" />
        </div>
        <button className="btn-primary" type="submit">Calculate</button>
      </form>
      {result !== null && (
        <div className="calculator-result">
          <h4>Final Amount</h4>
          <p>₹ {result.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
        </div>
      )}
    </div>
  );
};

export default CompoundInterestCalculator;