import React, { useState } from 'react';

const ChildEducationCalculator = () => {
  const [formData, setFormData] = useState({
    childAge: 5,
    goalAge: 18,
    currentCost: 1000000,
    inflation: 8,
    currentInvestments: 0,
    expectedReturn: 10,
  });

  const [resultHtml, setResultHtml] = useState('');
  const [showResult, setShowResult] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: parseFloat(value)
    });
  };

  const formatINR = (n) => {
    return "₹" + n.toLocaleString('en-IN', { maximumFractionDigits: 0 });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { childAge, goalAge, currentCost, inflation, currentInvestments, expectedReturn } = formData;
    const yearsLeft = goalAge - childAge;

    if (yearsLeft <= 0) {
      setResultHtml("Goal age must be greater than child's current age.");
      setShowResult(true);
      return;
    }

    const infRate = inflation / 100;
    const expRate = expectedReturn / 100;

    const futureCost = currentCost * Math.pow(1 + infRate, yearsLeft);

    let futureValueInvestments = 0;
    if (currentInvestments > 0 && expectedReturn > 0) {
      futureValueInvestments = currentInvestments * Math.pow(1 + expRate, yearsLeft);
    }

    const amountNeeded = futureCost - futureValueInvestments;

    let html = `<div>Estimated Future Cost of Education: <strong>${formatINR(Math.round(futureCost))}</strong></div>`;
    if (futureValueInvestments > 0) {
      html += `<div style="margin-top:8px;">Future Value of Current Investments: <strong>${formatINR(Math.round(futureValueInvestments))}</strong></div>`;
    }
    if (amountNeeded > 0) {
      html += `<div style="color:#e53935;margin-top:12px;">You need to accumulate <strong>${formatINR(Math.round(amountNeeded))}</strong> more to meet your goal.</div>`;
    } else {
      html += `<div style="color:green;margin-top:12px;">Congratulations! Your current investments are sufficient for the goal.</div>`;
    }

    setResultHtml(html);
    setShowResult(true);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Child Education Calculator</h1>
      <div style={styles.subtitle}>Plan for your child's bright future</div>

      <form onSubmit={handleSubmit} style={styles.form}>
        {[
          { label: 'Current Age of Child (Years)', name: 'childAge', value: formData.childAge },
          { label: 'Age at Which Funds are Needed (Years)', name: 'goalAge', value: formData.goalAge },
          { label: 'Current Cost of Education (₹)', name: 'currentCost', value: formData.currentCost },
          { label: 'Expected Inflation Rate (%)', name: 'inflation', value: formData.inflation },
          { label: 'Current Investments for Goal (₹)', name: 'currentInvestments', value: formData.currentInvestments },
          { label: 'Expected Rate of Return on Investments (%)', name: 'expectedReturn', value: formData.expectedReturn },
        ].map((field) => (
          <div key={field.name} style={styles.formGroup}>
            <label style={styles.label}>
              {field.label} <span style={styles.required}>*</span>
            </label>
            <input
              type="number"
              name={field.name}
              value={field.value}
              onChange={handleChange}
              min="0"
              required
              style={styles.input}
            />
          </div>
        ))}
        <div style={styles.buttonRow}>
          <button type="submit" style={styles.button}>Calculate</button>
        </div>
      </form>

      {showResult && (
        <div
          style={styles.resultBox}
          dangerouslySetInnerHTML={{ __html: resultHtml }}
        ></div>
      )}

      <div style={{ textAlign: 'center', marginTop: 20 }}>
        <a href="calculator.html" style={styles.backLink}>← Back to All Calculators</a>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '600px',
    margin: '40px auto',
    background: '#fff',
    borderRadius: '10px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
    padding: '32px 24px 36px 24px',
    fontFamily: 'Segoe UI, Arial, sans-serif'
  },
  heading: {
    textAlign: 'center',
    fontSize: '2.2rem',
    marginBottom: '0.5rem',
    fontWeight: 700,
    color: '#0a2a4d'
  },
  subtitle: {
    textAlign: 'center',
    color: '#555',
    fontSize: '1.1rem',
    marginBottom: '2rem'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column'
  },
  label: {
    fontWeight: 600,
    marginBottom: 6,
    color: '#222',
    fontSize: '1rem'
  },
  input: {
    padding: '9px 12px',
    border: '1px solid #bbb',
    borderRadius: 5,
    fontSize: '1rem',
    outline: 'none'
  },
  required: {
    color: '#e53935',
    marginLeft: 3
  },
  buttonRow: {
    textAlign: 'center',
    marginTop: 18
  },
  button: {
    background: '#007bff',
    color: '#fff',
    padding: '11px 36px',
    border: 'none',
    borderRadius: 6,
    fontSize: '1.1rem',
    fontWeight: 600,
    cursor: 'pointer'
  },
  resultBox: {
    marginTop: 26,
    background: '#eaf3ff',
    border: '1px solid #b6d6fa',
    borderRadius: 8,
    padding: '20px 18px',
    fontSize: '1.13rem',
    color: '#0a2a4d',
    textAlign: 'center',
    fontWeight: 500,
    maxWidth: '420px',
    margin: '26px auto 0 auto'
  },
  backLink: {
    textDecoration: 'none',
    color: '#007bff',
    border: '1px solid #007bff',
    padding: '10px 16px',
    borderRadius: 6
  }
};

export default ChildEducationCalculator;
