import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Calculator.css";
import { Link } from "react-router-dom";

const Calculator = () => {
  const calculatorRoutes = [
    {
      title: "Child Marriage Calculator",
      description: "Plan and calculate expenses for your child's wedding",
      icon: "fas fa-heart",
      path: "/home/child-marriage",
      color: "#ff6b6b"
    },
    {
      title: "Home Loan Calculator",
      description: "Calculate EMI and plan your home loan",
      icon: "fas fa-home",
      path: "/home/home-loan",
      color: "#4ecdc4"
    },
    {
      title: "Home Goal Calculator",
      description: "Plan and save for your dream home",
      icon: "fas fa-piggy-bank",
      path: "/home/home-goal",
      color: "#45b7d1"
    },
    {
      title: "Net Worth Calculator",
      description: "Calculate your total net worth",
      icon: "fas fa-chart-line",
      path: "/home/net-worth",
      color: "#96ceb4"
    },
    {
      title: "CAGR Calculator",
      description: "Calculate Compound Annual Growth Rate",
      icon: "fas fa-chart-bar",
      path: "/home/cagr-calculator",
      color: "#feca57"
    },
    {
      title: "SIP Calculator",
      description: "Plan your Systematic Investment Plan",
      icon: "fas fa-coins",
      path: "/home/sip-calculator",
      color: "#ff9ff3"
    },
    {
      title: "Lumpsum Calculator",
      description: "Calculate returns on lump sum investments",
      icon: "fas fa-money-bill-wave",
      path: "/home/lumpsum-calculator",
      color: "#54a0ff"
    },
    {
      title: "Compound Interest Calculator",
      description: "Calculate compound interest on investments",
      icon: "fas fa-percentage",
      path: "/home/compound-interest-calculator",
      color: "#5f27cd"
    }
  ];

  return (
    <section id="tools" className="tools-section">
      <div className="">
        <h2 className="section-title fade-in mb-5">Financial Tools & Calculators</h2>

        {/* Additional Calculators */}
        <div className="row mt-4">
          {calculatorRoutes.map(({ icon, title, description, path, color }, idx) => (
            <div className="col-lg-3 col-md-6 col-12" key={idx}>
              <div className="tool-card fade-in">
                <div className="tool-icon">
                  <i className={`bi ${icon}`}></i>
                </div>
                <h4 className="tool-title">{title}</h4>
                <p className="tool-description">{description}</p>
                <Link to={path} className="btn-primary-custom">
                  Calculate
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Calculator;