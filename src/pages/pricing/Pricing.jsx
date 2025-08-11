import React from "react";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import "./Pricing.css";

const PlansAndPricing = () => {
  const { addToCart, cartCount } = useCart();
  const navigate = useNavigate();

  const plans = [
    {
      id: 1,
      title: "Model Portfolio (All)",
      price: 11999,
      originalPrice: 15999,
      badge: "Most Popular",
      description: "Complete access to all Finwisee model portfolios",
      features: [
        "Access to All 13 Finwisee Model Portfolios",
        "Stock, MF & ETF Portfolios included",
        "Future portfolio additions included",
        "Fundamental Analysis based portfolios",
        "Supporting Research material",
        "Quarterly Rebalancing",
        "Exclusive Live Sessions",
        "One-Click Investment & Rebalancing"
      ],
      icon: "📊",
      color: "primary"
    },
    {
      id: 2,
      title: "Income Tax Advisory",
      price: 7999,
      originalPrice: 9999,
      badge: "Best Value",
      description: "Complete tax advisory with ITR filing",
      features: [
        "45 mins expert consultation call",
        "Advance Tax Calculations",
        "Personalized email advisory",
        "Income Tax Return preparation",
        "Complete filing service",
        "Post-filing support"
      ],
      icon: "💰",
      color: "success"
    },
    {
      id: 3,
      title: "Tax Health Checkup",
      price: 6999,
      originalPrice: 8999,
      description: "Comprehensive tax health assessment",
      features: [
        "15 mins expert consultation",
        "ITR Processing status review",
        "Pending tax demands check",
        "Refund status verification",
        "High-value transaction review",
        "Compliance portal check",
        "Action plan recommendations"
      ],
      icon: "🔍",
      color: "info"
    },
    {
      id: 4,
      title: "NRI Tax Advisory",
      price: 14999,
      originalPrice: 19999,
      badge: "Premium",
      description: "Specialized NRI tax services",
      features: [
        "45 mins expert consultation",
        "Advance Tax Calculations",
        "NRI-specific investment guidance",
        "Tax Treaty Benefits analysis",
        "FEMA Compliance guidance",
        "Remittance planning",
        "Return to India tips",
        "Complete ITR filing"
      ],
      icon: "🌍",
      color: "warning"
    },
    {
      id: 5,
      title: "ESOP Tax Calculations",
      price: 9999,
      originalPrice: 12999,
      description: "Specialized ESOP tax services",
      features: [
        "30 mins expert consultation",
        "ESOP Calculations for NRI & Resident",
        "Tax Implications analysis",
        "Treaty Benefits/DTAA check",
        "Capital Gains calculation",
        "Advance Tax planning"
      ],
      icon: "📈",
      color: "danger"
    },
    {
      id: 6,
      title: "Property Sale Advisory",
      price: 4999,
      originalPrice: 6999,
      description: "Property sale capital gains guidance",
      features: [
        "15 mins expert consultation",
        "Capital Gains Calculations",
        "Tax saving options review",
        "Investment recommendations",
        "Compliance guidance"
      ],
      icon: "🏠",
      color: "secondary"
    },
    {
      id: 7,
      title: "Advisory Call",
      price: 4999,
      originalPrice: 5999,
      description: "General financial advisory",
      features: [
        "45 mins expert consultation",
        "Personalized financial advice",
        "Investment recommendations",
        "Risk assessment",
        "Follow-up support"
      ],
      icon: "📞",
      color: "primary"
    },
    {
      id: 8,
      title: "Gold Plan",
      price: 74999,
      originalPrice: 99999,
      badge: "Elite",
      description: "Personal meeting with CEO",
      features: [
        "Personal Meeting with CEO (SEBI RIA)",
        "Complete Financial Planning",
        "Portfolio review & optimization",
        "Custom investment strategy",
        "Ongoing support",
        "Priority access"
      ],
      icon: "👑",
      color: "warning",
      specialButton: "Book Appointment"
    },
    {
      id: 9,
      title: "Premium Plan",
      price: 999,
      originalPrice: 1999,
      description: "Algorithm-based financial planning",
      features: [
        "Proprietary Algorithm Analysis",
        "20+ page Detailed Report",
        "Goal-based planning",
        "Insurance recommendations",
        "Retirement planning",
        "Investment strategy"
      ],
      icon: "🤖",
      color: "info"
    }
  ];

  const handleAddToCart = (plan) => {
    addToCart(plan);
  };

  const handleViewCart = () => {
    navigate('/home/cart');
  };

  return (
    <div className="pricing-container">
      <div className="pricing-header">
        <div className="container">
          <h1 className="pricing-title">Choose Your Financial Plan</h1>
          <p className="pricing-subtitle">
            Select the perfect plan for your financial needs. Mix and match services for the best value.
          </p>
          {cartCount > 0 && (
            <div className="cart-indicator">
              <button className="btn-view-cart" onClick={handleViewCart}>
                <i className="fas fa-shopping-cart"></i>
                View Cart ({cartCount})
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="pricing-content">
        <div className="container">
          <div className="pricing-grid">
            {plans.map((plan) => (
              <div key={plan.id} className={`pricing-card ${plan.color}`}>
                {plan.badge && (
                  <div className={`badge ${plan.badge.toLowerCase().replace(' ', '-')}`}>
                    {plan.badge}
                  </div>
                )}
                
                <div className="card-header">
                  <div className="plan-icon">{plan.icon}</div>
                  <h3 className="plan-title">{plan.title}</h3>
                  <p className="plan-description">{plan.description}</p>
                </div>

                <div className="card-pricing">
                  <div className="price-container">
                    <span className="currency">₹</span>
                    <span className="price">{plan.price.toLocaleString()}</span>
                    <span className="period">/year</span>
                  </div>
                  {plan.originalPrice > plan.price && (
                    <div className="original-price">
                      <span>₹{plan.originalPrice.toLocaleString()}</span>
                      <span className="discount">
                        Save ₹{(plan.originalPrice - plan.price).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>

                <div className="card-features">
                  <ul>
                    {plan.features.map((feature, index) => (
                      <li key={index}>
                        <i className="fas fa-check"></i>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="card-action">
                  {plan.specialButton ? (
                    <button className="btn-special">
                      <i className="fas fa-calendar"></i>
                      {plan.specialButton}
                    </button>
                  ) : (
                    <button 
                      className="btn-add"
                      onClick={() => handleAddToCart(plan)}
                    >
                      <i className="fas fa-plus"></i>
                      Add to Cart
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlansAndPricing;
