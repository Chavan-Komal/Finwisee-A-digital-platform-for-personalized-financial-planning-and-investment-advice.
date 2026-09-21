import React, { useState } from 'react';

const AfterRetirement = () => {
  const [form, setForm] = useState({
    currentAge: 60,
    lifeExpectancy: 85,
    annualExpense: 100000,
    inflation: 7,
    currentAssets: 100000,
    expectedReturn: 10,
    annualIncome: 0,
    incomeGrowth: 0,
    incomeTillAge: 75,
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: parseFloat(value) });
  };

  const formatINR = (n) => {
    return "₹" + n.toLocaleString('en-IN', { maximumFractionDigits: 0 });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const {
      currentAge,
      lifeExpectancy,
      annualExpense,
      inflation,
      currentAssets,
      expectedReturn,
      annualIncome,
      incomeGrowth,
      incomeTillAge
    } = form;

    const years = lifeExpectancy - currentAge;
    if (years <= 0) {
      setResult("Life Expectancy must be greater than Current Age.");
      return;
    }

    let expenseAtRetirement = annualExpense * Math.pow(1 + inflation / 100, years);

    let totalCorpusNeeded = 0;
    let expense = expenseAtRetirement;

    for (let i = 0; i < years; i++) {
      totalCorpusNeeded += expense / Math.pow(1 + expectedReturn / 100, i + 1);
      expense *= (1 + inflation / 100);
    }

    if (annualIncome > 0 && incomeTillAge > currentAge) {
      let incomeYears = Math.min(lifeExpectancy, incomeTillAge) - currentAge;
      let income = annualIncome;
      let pvIncome = 0;
      for (let i = 0; i < incomeYears; i++) {
        pvIncome += income / Math.pow(1 + expectedReturn / 100, i + 1);
        income *= (1 + incomeGrowth / 100);
      }
      totalCorpusNeeded -= pvIncome;
    }

    let html = `<div>Total Retirement Corpus Required: <strong>${formatINR(Math.round(totalCorpusNeeded))}</strong></div>`;
    if (currentAssets >= totalCorpusNeeded) {
      html += `<div style="color:green;margin-top:10px;">Congratulations! Your current assets are sufficient for your retirement plan.</div>`;
    } else {
      html += `<div style="color:#e53935;margin-top:10px;">You need to accumulate <strong>${formatINR(Math.round(totalCorpusNeeded - currentAssets))}</strong> more to meet your retirement goal.</div>`;
    }

    setResult(html);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '40px auto', background: '#fff', borderRadius: '12px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', padding: '32px 28px 40px 28px' }}>
      <h1 style={{ textAlign: 'center', fontSize: '2.5rem', fontWeight: 700 }}>After Retirement Calculator</h1>
      <div style={{ textAlign: 'center', color: '#555', fontSize: '1.2rem', marginBottom: '2rem' }}>Enjoy your retirement stress free</div>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '24px 16px', justifyContent: 'space-between' }}>
        {[
          { label: 'Current Age (Years)', name: 'currentAge', value: form.currentAge },
          { label: 'Life Expectancy (Years)', name: 'lifeExpectancy', value: form.lifeExpectancy },
          { label: 'Current Annual Expense (₹)', name: 'annualExpense', value: form.annualExpense },
          { label: 'Inflation (%)', name: 'inflation', value: form.inflation },
          { label: 'Current Assets (₹)', name: 'currentAssets', value: form.currentAssets },
          { label: 'Expected Rate of Return of Existing Investments (%)', name: 'expectedReturn', value: form.expectedReturn },
          { label: 'Annual Income after Retirement', name: 'annualIncome', value: form.annualIncome },
          { label: 'Expected growth in Income (%)', name: 'incomeGrowth', value: form.incomeGrowth },
          { label: 'Income expected till age', name: 'incomeTillAge', value: form.incomeTillAge }
        ].map(({ label, name, value }) => (
          <div key={name} style={{ flex: '1 1 30%', minWidth: '300px', display: 'flex', flexDirection: 'column' }}>
            <label style={{ fontWeight: 600, marginBottom: 6 }}>{label}<span style={{ color: '#e53935' }}>*</span></label>
            <input type="number" name={name} value={value} onChange={handleChange} min="0" required style={{ padding: '10px 12px', borderRadius: 6, border: '1px solid #ccc' }} />
          </div>
        ))}
        <div style={{ width: '100%', textAlign: 'center', marginTop: 24 }}>
          <button type="submit" style={{ background: '#007bff', color: '#fff', padding: '12px 36px', border: 'none', borderRadius: 6, fontSize: '1.1rem', fontWeight: 600, cursor: 'pointer' }}>
            Submit
          </button>
        </div>
      </form>

      {result && (
        <div style={{ marginTop: 30, background: '#f2f8ff', border: '1px solid #d0e3fa', borderRadius: 8, padding: '20px 28px', fontSize: '1.2rem', color: '#0a2a4d', fontWeight: 500 }} dangerouslySetInnerHTML={{ __html: result }} />
      )}

      <div style={{ textAlign: 'center', marginTop: 24 }}>
        <a href="calculator.html" style={{ textDecoration: 'none', color: '#007bff', border: '1px solid #007bff', padding: '10px 16px', borderRadius: 6 }}>
          ← Back to All Calculators
        </a>
      </div>
    </div>
  );
};

export default AfterRetirement;
