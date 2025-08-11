// File: src/components/CAGRCalculator.jsx
import React, { useState } from "react";
import "./CagrCalculator.css";

const CAGRCalculator = () => {
  const [initial, setInitial] = useState(10000);
  const [final, setFinal] = useState(25000);
  const [duration, setDuration] = useState(15);
  const [result, setResult] = useState("0.00 %");

  const calculateCAGR = () => {
    const P = parseFloat(initial);
    const F = parseFloat(final);
    const T = parseFloat(duration);

    if (P <= 0 || F <= 0 || T <= 0) {
      setResult("Invalid Input");
      return;
    }

    const CAGR = Math.pow(F / P, 1 / T) - 1;
    const percent = (CAGR * 100).toFixed(2);
    setResult(`${percent} %`);
  };

  return (
    <section className="cagr-calculator-container">
      <h1>CAGR Calculator</h1>
      <p>Discover Your Investment's Growth Potential</p>

      <div className="cagr-calculator-box">
        <div className="cagr-input-section">
          <label>
            Initial Investment (₹)
            <input
              type="range"
              min="1000"
              max="100000"
              value={initial}
              onChange={(e) => setInitial(e.target.value)}
            />
            <input type="number" value={initial} readOnly />
          </label>

          <label>
            Final Investment (₹)
            <input
              type="range"
              min="1000"
              max="200000"
              value={final}
              onChange={(e) => setFinal(e.target.value)}
            />
            <input type="number" value={final} readOnly />
          </label>

          <label>
            Duration Of Investment (Yr)
            <input
              type="range"
              min="1"
              max="30"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
            <input type="number" value={duration} readOnly />
          </label>

          <button onClick={calculateCAGR}>Submit</button>
        </div>

        <div className="cagr-output-section">
          <h2>CAGR</h2>
          <p id="cagrResult">{result}</p>
        </div>
      </div>

      <div className="cagr-back-link">
        <a href="calculator.html">Back to All Calculators</a>
      </div>
    </section>
  );
};

export default CAGRCalculator;
