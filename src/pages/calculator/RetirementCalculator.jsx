import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Calculator.css';

const formatCurrency = (amount) => {
  if (amount >= 10000000) {
    return '₹' + (amount / 10000000).toFixed(2) + ' Cr';
  } else if (amount >= 100000) {
    return '₹' + (amount / 100000).toFixed(2) + ' L';
  } else {
    return '₹' + Math.round(amount).toLocaleString('en-IN');
  }
};

const formatNumber = (num) => {
  return num.toLocaleString('en-IN');
};

const computeRetirement = ({ currentAge, retirementAge, monthlyInvestment, expectedReturn, currentSavings, inflationRate }) => {
  const yearsToRetire = retirementAge - currentAge;
  if (!(yearsToRetire > 0)) return null;

  const totalMonths = yearsToRetire * 12;
  const monthlyReturn = expectedReturn / 100 / 12;
  const sipFutureValue = monthlyReturn === 0
    ? monthlyInvestment * totalMonths
    : monthlyInvestment * (((Math.pow(1 + monthlyReturn, totalMonths) - 1) / monthlyReturn) * (1 + monthlyReturn));
  const savingsGrowth = currentSavings * Math.pow(1 + expectedReturn / 100, yearsToRetire);
  const totalCorpus = sipFutureValue + savingsGrowth;
  const totalInvestment = monthlyInvestment * totalMonths;

  return {
    yearsToRetire,
    totalCorpus,
    totalInvestment,
    savingsGrowth,
    totalReturns: totalCorpus - totalInvestment - currentSavings,
    // What the corpus is worth in today's money after inflation
    inflationAdjustedCorpus: totalCorpus / Math.pow(1 + inflationRate / 100, yearsToRetire),
    sipAmount: monthlyInvestment,
    sipYears: yearsToRetire,
    projectedCorpus: Math.round(totalCorpus / 100000)
  };
};

const RetirementCalculator = () => {
  const [formData, setFormData] = useState({
    currentAge: 30,
    retirementAge: 60,
    monthlyInvestment: 10000,
    expectedReturn: 12,
    currentSavings: 100000,
    inflationRate: 6
  });

  const handleChange = (e) => {
    const value = parseFloat(e.target.value);
    setFormData({ ...formData, [e.target.id]: Number.isNaN(value) ? 0 : value });
  };

  const results = useMemo(() => computeRetirement(formData), [formData]);

  const calculateRetirement = () => {
    if (formData.retirementAge <= formData.currentAge) {
      alert('Retirement age must be greater than current age');
    }
  };

  return (
    <section className="tools-section">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="text-center mb-5">
              <div className="tool-icon blue mx-auto mb-3" style={{ width: '80px', height: '80px', fontSize: '2rem' }}>
                <i className="bi bi-calculator"></i>
              </div>
              <h1 className="section-title">Retirement Calculator</h1>
              <p className="text-muted">Plan your retirement with our comprehensive calculator to determine how much you need to save</p>
            </div>

            <div className="row">
              <div className="col-lg-6">
                <div className="tool-card">
                  <h3 className="tool-title mb-4">Calculate Your Retirement Corpus</h3>
                  <form onSubmit={(e) => e.preventDefault()}>
                    {['currentAge', 'retirementAge', 'monthlyInvestment', 'expectedReturn', 'currentSavings', 'inflationRate'].map((field, i) => (
                      <div className="mb-4" key={i}>
                        <label htmlFor={field} className="form-label fw-semibold text-capitalize">
                          {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          id={field}
                          value={formData[field]}
                          onChange={handleChange}
                        />
                      </div>
                    ))}
                    <button className="btn-primary-custom w-100" onClick={calculateRetirement}>
                      <i className="bi bi-calculator me-2"></i>Calculate Retirement Corpus
                    </button>
                  </form>
                </div>
              </div>

              <div className="col-lg-6">
                {results && (
                  <div className="tool-card" id="resultsCard">
                    <h3 className="tool-title mb-4">Your Retirement Plan</h3>
                    <div className="alert alert-primary mb-4">
                      <div className="row text-center">
                        <div className="col-6">
                          <div className="stat-number fs-4 fw-bold text-primary">{formatCurrency(results.totalCorpus)}</div>
                          <div className="stat-label">Total Corpus</div>
                        </div>
                        <div className="col-6">
                          <div className="stat-number fs-4 fw-bold text-success">{results.yearsToRetire}</div>
                          <div className="stat-label">Years to Retire</div>
                        </div>
                      </div>
                    </div>

                    <div className="card bg-light mb-4">
                      <div className="card-body">
                        <div className="d-flex justify-content-between mb-2">
                          <span>Total Investment:</span>
                          <span className="fw-semibold">{formatCurrency(results.totalInvestment)}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <span>From Current Savings:</span>
                          <span className="fw-semibold">{formatCurrency(results.savingsGrowth)}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <span>Returns Generated:</span>
                          <span className="fw-semibold text-success">{formatCurrency(results.totalReturns)}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <span>Worth in today's money ({formData.inflationRate}% inflation):</span>
                          <span className="fw-semibold">{formatCurrency(results.inflationAdjustedCorpus)}</span>
                        </div>
                        <hr />
                        <div className="d-flex justify-content-between">
                          <span className="fw-bold">Total Corpus:</span>
                          <span className="fw-bold text-primary">{formatCurrency(results.totalCorpus)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="alert alert-info">
                      <i className="bi bi-info-circle me-2"></i>
                      <strong>Monthly SIP of ₹{formatNumber(results.sipAmount)}</strong> for {results.sipYears} years can help you build a retirement corpus of ₹{results.projectedCorpus} lakhs.
                    </div>
                  </div>
                )}

                <div className="text-center mt-4">
                  <Link to="/home/calculator" className="btn btn-outline-primary">
                    <i className="bi bi-arrow-left me-2"></i>Back to All Calculators
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RetirementCalculator;
