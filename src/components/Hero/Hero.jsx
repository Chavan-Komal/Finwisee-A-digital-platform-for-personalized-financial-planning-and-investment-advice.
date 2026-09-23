import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { dashboardPathFor, useAuth } from '../../context/AuthContext';
import { useCountUp, useInView } from '../../hooks/useInView';
import './Hero.css';

const FEATURES = [
  { icon: 'fa-calculator', title: 'Financial Calculators', desc: 'Retirement, loans, education and net-worth calculators with instant projections.', to: '/home/calculator' },
  { icon: 'fa-briefcase', title: 'Model Portfolios', desc: 'Research-backed stock, mutual fund and ETF portfolios you can follow.', to: '/home/pricing' },
  { icon: 'fa-file-invoice', title: 'Tax Advisory', desc: 'Expert tax planning, ITR filing and compliance support.', to: '/home/pricing' },
  { icon: 'fa-chart-line', title: 'Investment Planning', desc: 'Personalised strategies built around your goals and risk profile.', to: '/home/pricing' },
  { icon: 'fa-graduation-cap', title: 'Financial E-Learning', desc: 'Courses from certified experts, from the basics to advanced strategies.', to: '/home/e-learning' },
  { icon: 'fa-bullseye', title: 'Goal Tracking', desc: 'Set goals and see exactly when you will reach them at your savings rate.', to: '/auth/register' },
  { icon: 'fa-shield-halved', title: 'Secure Document Vault', desc: 'Share statements and policies with your advisor over a secure connection.', to: '/auth/register' },
  { icon: 'fa-user-tie', title: 'Expert Support', desc: 'Book consultations with certified advisors and message them any time.', to: '/home/contactus' },
];

const STEPS = [
  { icon: 'fa-user-plus', title: 'Create your profile', desc: 'Tell us your income, experience and risk appetite. It takes two minutes.' },
  { icon: 'fa-bullseye', title: 'Set your goals', desc: "Retirement, a home, your child's education - we project when you'll get there." },
  { icon: 'fa-comments', title: 'Talk to an advisor', desc: 'Book a consultation, share documents and get a plan built around you.' },
];

const GOALS = [
  { key: 'retirement', label: 'Retirement', icon: 'fa-umbrella-beach', headline: 'Retire without financial worry', copy: 'Work out the corpus you need, see how inflation erodes it, and find the monthly SIP that gets you there.', to: '/home/retirement', cta: 'Open retirement calculator' },
  { key: 'home', label: 'Buying a home', icon: 'fa-house', headline: 'Plan your home purchase', copy: 'Compare EMIs, tenures and down payments, and see what the loan really costs you over its life.', to: '/home/home-loan', cta: 'Open home loan calculator' },
  { key: 'education', label: "Child's education", icon: 'fa-graduation-cap', headline: "Fund your child's education", copy: 'Project tuition costs years ahead and find the monthly saving that comfortably covers them.', to: '/home/child-education', cta: 'Open education calculator' },
  { key: 'wealth', label: 'Growing wealth', icon: 'fa-seedling', headline: 'Build long-term wealth', copy: 'See how a monthly SIP compounds over time, and track your net worth as it grows.', to: '/home/sip-calculator', cta: 'Open SIP calculator' },
];

const FAQS = [
  { q: 'What does Finwisee actually do?', a: 'It brings your financial planning into one place: calculators for every major goal, a dashboard that tracks your goals and documents, and certified advisors you can book time with.' },
  { q: 'Do I need to pay to use the calculators?', a: 'No. Every calculator on the site is free and needs no account. You only pay for advisory plans such as tax filing or model portfolios.' },
  { q: 'How is my financial data protected?', a: 'Your account is protected by an encrypted login, documents are shared over a secure connection, and only you and your advisor can open them.' },
  { q: 'Can I talk to a real advisor?', a: 'Yes. Once you create an account you can book a consultation from your dashboard, choose a time, and message your advisor directly.' },
];

const formatInr = (value) => {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(2)} L`;
  return `₹${Math.round(value).toLocaleString('en-IN')}`;
};

/** Live SIP projection with a small area chart - the interactive centrepiece of the hero. */
const SipProjector = () => {
  const [monthly, setMonthly] = useState(15000);
  const [years, setYears] = useState(15);
  const [rate, setRate] = useState(12);

  const { invested, future, series } = useMemo(() => {
    const monthlyRate = rate / 100 / 12;
    const points = [];
    let balance = 0;
    for (let year = 1; year <= years; year++) {
      for (let month = 0; month < 12; month++) {
        balance = balance * (1 + monthlyRate) + monthly;
      }
      points.push({ year, balance });
    }
    return { invested: monthly * 12 * years, future: balance, series: points };
  }, [monthly, years, rate]);

  const { areaPath, linePath } = useMemo(() => {
    const W = 300;
    const H = 110;
    const max = series[series.length - 1]?.balance || 1;
    const coords = series.map((p, i) => {
      const x = series.length === 1 ? W : (i / (series.length - 1)) * W;
      const y = H - (p.balance / max) * (H - 8);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });
    return {
      linePath: `M${coords.join(' L')}`,
      areaPath: `M0,${H} L${coords.join(' L')} L${W},${H} Z`,
    };
  }, [series]);

  return (
    <div className="lp-projector">
      <div className="lp-projector-head">
        <div>
          <span className="lp-projector-label">Projected value</span>
          <strong className="lp-projector-value">{formatInr(future)}</strong>
        </div>
        <span className="lp-projector-gain">
          <i className="fas fa-arrow-up"></i> {formatInr(future - invested)} returns
        </span>
      </div>

      <svg className="lp-chart" viewBox="0 0 300 110" preserveAspectRatio="none" role="img"
        aria-label={`Projected growth to ${formatInr(future)} over ${years} years`}>
        <defs>
          <linearGradient id="lpFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#lpFill)" />
        <path d={linePath} fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      </svg>

      <div className="lp-slider">
        <label htmlFor="lp-monthly">Monthly investment <strong>₹{monthly.toLocaleString('en-IN')}</strong></label>
        <input id="lp-monthly" type="range" min="1000" max="100000" step="1000" value={monthly}
          onChange={(e) => setMonthly(Number(e.target.value))} />
      </div>
      <div className="lp-slider">
        <label htmlFor="lp-years">Time period <strong>{years} years</strong></label>
        <input id="lp-years" type="range" min="1" max="30" value={years}
          onChange={(e) => setYears(Number(e.target.value))} />
      </div>
      <div className="lp-slider">
        <label htmlFor="lp-rate">Expected return <strong>{rate}% p.a.</strong></label>
        <input id="lp-rate" type="range" min="6" max="18" step="0.5" value={rate}
          onChange={(e) => setRate(Number(e.target.value))} />
      </div>

      <div className="lp-projector-foot">
        <span>You invest <strong>{formatInr(invested)}</strong></span>
        <Link to="/home/sip-calculator">Full calculator <i className="fas fa-arrow-right"></i></Link>
      </div>
    </div>
  );
};

const Stat = ({ target, suffix, decimals = 0, label, active }) => {
  const value = useCountUp(target, active);
  return (
    <div className="lp-stat">
      <span className="lp-stat-number">{value.toFixed(decimals)}{suffix}</span>
      <span className="lp-stat-label">{label}</span>
    </div>
  );
};

const Section = ({ className = '', children }) => {
  const [ref, inView] = useInView();
  return (
    <section ref={ref} className={`lp-section ${className} ${inView ? 'is-visible' : ''}`}>
      {children}
    </section>
  );
};

const Hero = () => {
  const { user, isAuthenticated } = useAuth();
  const [statsRef, statsInView] = useInView('-40px');
  const [activeGoal, setActiveGoal] = useState(GOALS[0].key);
  const [openFaq, setOpenFaq] = useState(0);
  const loggedIn = isAuthenticated();
  const goal = GOALS.find((g) => g.key === activeGoal);

  return (
    <div className="lp">
      {/* ---------- Hero ---------- */}
      <section className="lp-hero">
        <div className="lp-hero-inner">
          <div className="lp-hero-text">
            <span className="lp-badge">
              <span className="lp-badge-dot"></span>
              Powered by the FIVE-G Framework
            </span>
            <h1 className="lp-title">
              Master your financial future with <span className="lp-title-accent">intelligent analysis</span>
            </h1>
            <p className="lp-lede">
              Research-backed portfolios, calculators for every goal and certified advisors —
              in one dashboard that shows exactly where your money is headed.
            </p>

            <div className="lp-actions">
              <Link className="lp-btn lp-btn-primary" to={loggedIn ? dashboardPathFor(user) : '/auth/register'}>
                <i className="fas fa-rocket"></i>
                {loggedIn ? 'Go to my dashboard' : 'Start free'}
              </Link>
              <Link className="lp-btn lp-btn-ghost" to="/home/calculator">
                <i className="fas fa-calculator"></i>
                Explore calculators
              </Link>
            </div>

            <ul className="lp-trust">
              <li><i className="fas fa-circle-check"></i> SEBI registered research analyst</li>
              <li><i className="fas fa-circle-check"></i> No card needed to start</li>
              <li><i className="fas fa-circle-check"></i> Free calculators, always</li>
            </ul>

            <div className="lp-stats" ref={statsRef}>
              <Stat target={225} suffix="+" label="Companies analysed" active={statsInView} />
              <Stat target={500} suffix="+" label="Premium resources" active={statsInView} />
              <Stat target={10} suffix="K+" label="Happy users" active={statsInView} />
              <Stat target={4.8} decimals={1} suffix="/5" label="Average rating" active={statsInView} />
            </div>
          </div>

          <div className="lp-hero-visual">
            <SipProjector />
          </div>
        </div>
      </section>

      {/* ---------- Features ---------- */}
      <Section className="lp-features">
        <div className="lp-container">
          <div className="lp-section-head">
            <span className="lp-eyebrow">Everything in one place</span>
            <h2>An all-in-one financial platform</h2>
            <p>Plan, learn, invest and track — without juggling five different apps.</p>
          </div>
          <div className="lp-feature-grid">
            {FEATURES.map((feature, i) => (
              <Link className="lp-feature" to={feature.to} key={feature.title} style={{ '--delay': `${i * 55}ms` }}>
                <span className="lp-feature-icon"><i className={`fas ${feature.icon}`}></i></span>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
                <span className="lp-feature-link">Learn more <i className="fas fa-arrow-right"></i></span>
              </Link>
            ))}
          </div>
        </div>
      </Section>

      {/* ---------- Goal picker ---------- */}
      <Section className="lp-goals">
        <div className="lp-container">
          <div className="lp-section-head">
            <span className="lp-eyebrow">Start with your goal</span>
            <h2>What are you planning for?</h2>
            <p>Pick a goal and jump straight into the calculator built for it.</p>
          </div>

          <div className="lp-goal-tabs" role="tablist" aria-label="Financial goals">
            {GOALS.map((g) => (
              <button
                key={g.key}
                role="tab"
                aria-selected={activeGoal === g.key}
                className={`lp-goal-tab ${activeGoal === g.key ? 'active' : ''}`}
                onClick={() => setActiveGoal(g.key)}
              >
                <i className={`fas ${g.icon}`}></i>
                {g.label}
              </button>
            ))}
          </div>

          <div className="lp-goal-panel" key={goal.key} role="tabpanel">
            <div className="lp-goal-icon"><i className={`fas ${goal.icon}`}></i></div>
            <div className="lp-goal-body">
              <h3>{goal.headline}</h3>
              <p>{goal.copy}</p>
              <Link className="lp-btn lp-btn-primary" to={goal.to}>
                {goal.cta} <i className="fas fa-arrow-right"></i>
              </Link>
            </div>
          </div>
        </div>
      </Section>

      {/* ---------- How it works ---------- */}
      <Section className="lp-steps">
        <div className="lp-container">
          <div className="lp-section-head">
            <span className="lp-eyebrow">How it works</span>
            <h2>From sign-up to a real plan in three steps</h2>
          </div>
          <ol className="lp-step-grid">
            {STEPS.map((step, i) => (
              <li className="lp-step" key={step.title} style={{ '--delay': `${i * 90}ms` }}>
                <span className="lp-step-num">{i + 1}</span>
                <i className={`fas ${step.icon} lp-step-icon`}></i>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      {/* ---------- E-learning ---------- */}
      <Section className="lp-learning">
        <div className="lp-container lp-learning-inner">
          <div>
            <span className="lp-eyebrow">Learn as you invest</span>
            <h2>Master financial education</h2>
            <p>
              Courses from certified professionals covering investment fundamentals, portfolio
              management, tax planning and retirement — at your own pace.
            </p>
            <div className="lp-learning-stats">
              <div><strong>50+</strong><span>Courses</span></div>
              <div><strong>25K+</strong><span>Students</span></div>
              <div><strong>4.8</strong><span>Rating</span></div>
            </div>
            <Link className="lp-btn lp-btn-primary" to="/home/e-learning">
              <i className="fas fa-graduation-cap"></i> Explore courses
            </Link>
          </div>
          <div className="lp-learning-card">
            <div className="lp-course">
              <span className="lp-course-icon"><i className="fas fa-chart-pie"></i></span>
              <div className="lp-course-body">
                <h4>Personal Finance Mastery</h4>
                <p>Beginner · 40 hours</p>
              </div>
              <span className="lp-course-price">₹1,999</span>
            </div>
            <div className="lp-course">
              <span className="lp-course-icon"><i className="fas fa-chart-line"></i></span>
              <div className="lp-course-body">
                <h4>Stock Market for Beginners</h4>
                <p>Beginner · 35 hours</p>
              </div>
              <span className="lp-course-price">₹2,499</span>
            </div>
            <div className="lp-course">
              <span className="lp-course-icon"><i className="fas fa-coins"></i></span>
              <div className="lp-course-body">
                <h4>Mutual Fund Strategies</h4>
                <p>Intermediate · 30 hours</p>
              </div>
              <span className="lp-course-price">₹1,699</span>
            </div>
          </div>
        </div>
      </Section>

      {/* ---------- FAQ ---------- */}
      <Section className="lp-faq">
        <div className="lp-container lp-faq-inner">
          <div className="lp-section-head lp-section-head-left">
            <span className="lp-eyebrow">Questions</span>
            <h2>Frequently asked</h2>
            <p>Still unsure? <Link to="/home/contactus">Talk to our team</Link>.</p>
          </div>
          <div className="lp-faq-list">
            {FAQS.map((faq, i) => (
              <div className={`lp-faq-item ${openFaq === i ? 'open' : ''}`} key={faq.q}>
                <button className="lp-faq-q" onClick={() => setOpenFaq(openFaq === i ? -1 : i)} aria-expanded={openFaq === i}>
                  {faq.q}
                  <i className={`fas ${openFaq === i ? 'fa-minus' : 'fa-plus'}`}></i>
                </button>
                <div className="lp-faq-a"><p>{faq.a}</p></div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ---------- Closing CTA ---------- */}
      <Section className="lp-cta">
        <div className="lp-container lp-cta-inner">
          <div>
            <h2>Ready to take control of your money?</h2>
            <p>Create a free account and see your goals, documents and advisors in one dashboard.</p>
          </div>
          <div className="lp-actions">
            <Link className="lp-btn lp-btn-light" to={loggedIn ? dashboardPathFor(user) : '/auth/register'}>
              {loggedIn ? 'Open my dashboard' : 'Create free account'}
            </Link>
            <Link className="lp-btn lp-btn-outline" to="/home/pricing">See pricing</Link>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default Hero;
