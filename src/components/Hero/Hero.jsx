import "./Hero.css";
import { Link } from 'react-router-dom';

const features = [
  {
    icon: "📊",
    title: "Financial Calculators",
    desc: "Comprehensive calculators for retirement, loans, education, and more."
  },
  {
    icon: "💼",
    title: "Model Portfolios",
    desc: "Ready-made, research-backed stock, MF & ETF portfolios."
  },
  {
    icon: "🧾",
    title: "Tax Advisory",
    desc: "Expert tax planning, ITR filing, and compliance support."
  },
  {
    icon: "📈",
    title: "Investment Planning",
    desc: "Personalized investment strategies for your goals."
  },
  {
    icon: "⏱️",
    title: "Real-time Stock Analysis",
    desc: "Live insights and analytics for smarter decisions."
  },
  {
    icon: "🔒",
    title: "Secure Payments",
    desc: "Bank-level security for all your transactions."
  },
  {
    icon: "📊",
    title: "Personalized Dashboard",
    desc: "Track your progress and manage your finances in one place."
  },
  {
    icon: "👨‍💼",
    title: "Expert Support",
    desc: "Certified advisors ready to help you succeed."
  },
];

const Hero = () => {
  return (
    <div className="hero-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <div className="brand-badge">
                <span className="brand-text">Finwisee</span>
                <span className="brand-accent">FIVE-G</span>
              </div>
              <h1 className="hero-title">
                Master Your Financial Future with
                <span className="highlight"> Intelligent Analysis</span>
              </h1>
              <p className="hero-description">
                Comprehensive stock research, financial calculators, and expert guidance
                using our proprietary FIVE-G Framework for informed investment decisions.
              </p>
              <div className="hero-stats">
                <div className="stat-item">
                  <span className="stat-number">225+</span>
                  <span className="stat-label">Companies Analyzed</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">500+</span>
                  <span className="stat-label">Premium Resources</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">10K+</span>
                  <span className="stat-label">Happy Users</span>
                </div>
              </div>
              <div className="hero-actions">
                <button className="btn-primary">Start Analysis</button>
                <button className="btn-secondary">Watch Demo</button>
              </div>
            </div>
            <div className="hero-visual">
              <div className="hero-image-container">
                <img
                  src="https://storage.googleapis.com/a1aa/image/f1c302d2-f505-4763-2688-0f3d1afa7dfb.jpg"
                  alt="Financial Analysis Dashboard"
                  className="hero-image"
                />
                <div className="floating-card card-1">
                  <div className="card-icon">📈</div>
                  <div className="card-content">
                    <h4>Stock Analysis</h4>
                    <p>Real-time insights</p>
                  </div>
                </div>
                <div className="floating-card card-2">
                  <div className="card-icon">💰</div>
                  <div className="card-content">
                    <h4>Portfolio Tracking</h4>
                    <p>Smart monitoring</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="">
          <div className="text-center mb-5">
            <h2 className="fw-bold">All-in-One Financial Platform</h2>
            <p>Everything you need for smart, secure, and successful financial planning.</p>
          </div>
          <div className="features-grid">
            {features.map((feature, idx) => (
              <div className="feature-card" key={idx}>
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* E-Learning Promotion Section */}
      <section className="e-learning-promotion">
        <div className="container">
          <div className="promotion-content">
            <div className="promotion-text">
              <h2 className="promotion-title">Master Financial Education</h2>
              <p className="promotion-description">
                Enhance your financial knowledge with our comprehensive e-learning platform. 
                Learn from industry experts with courses covering investment fundamentals, 
                portfolio management, retirement planning, and more.
              </p>
              <div className="promotion-stats">
                <div className="promo-stat">
                  <span className="promo-stat-number">50+</span>
                  <span className="promo-stat-label">Courses</span>
                </div>
                <div className="promo-stat">
                  <span className="promo-stat-number">25K+</span>
                  <span className="promo-stat-label">Students</span>
                </div>
                <div className="promo-stat">
                  <span className="promo-stat-number">4.8</span>
                  <span className="promo-stat-label">Rating</span>
                </div>
              </div>
              <div className="promotion-actions">
                <Link to="/home/e-learning" className="btn-primary">Explore Courses</Link>
                <button className="btn-secondary">Free Trial</button>
              </div>
            </div>
            <div className="promotion-visual">
              <div className="promotion-image-container">
                <img
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=300&fit=crop"
                  alt="E-Learning Platform"
                  className="promotion-image"
                />
                <div className="floating-badge">
                  <i className="fas fa-graduation-cap"></i>
                  <span>Learn & Grow</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;
