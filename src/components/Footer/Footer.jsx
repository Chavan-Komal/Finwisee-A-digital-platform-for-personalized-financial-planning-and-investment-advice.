import React from 'react';
import './Footer.css'
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="modern-footer">
      <div className="footer-top">
        <div className="container">
          <div className="row">
            <div className="col-12 col-lg-4 mb-4">
              <div className="footer-brand">
                <div className="brand-logo">
                  <i className="fas fa-chart-line"></i>
                  <span>Finwisee</span>
                </div>
                <p className="brand-description">
                  Your trusted partner for financial planning and investment advisory services. 
                  We simplify personal finance to help you achieve your financial goals.
                </p>
                <div className="contact-info">
                  <div className="contact-item">
                    <i className="fas fa-phone"></i>
                    <div>
                      <strong>(+91) 973 060 1468</strong>
                      <small>Phone Support</small>
                    </div>
                  </div>
                  <div className="contact-item">
                    <i className="fab fa-whatsapp"></i>
                    <div>
                      <strong>(+91) 782 109 8386</strong>
                      <small>WhatsApp Support</small>
                    </div>
                  </div>
                  <div className="contact-item">
                    <i className="fas fa-clock"></i>
                    <div>
                      <strong>10 AM - 07 PM, IST</strong>
                      <small>Business Hours</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-6 col-lg-2 mb-4">
              <h4>Products</h4>
              <ul className="footer-links">
                <li><Link to="/home/calculator">Financial Calculators</Link></li>
                <li><Link to="/home/retirement">Retirement Planning</Link></li>
                <li><Link to="/home/child-education">Education Planning</Link></li>
                <li><Link to="/home/home-loan">Home Loan Calculator</Link></li>
                <li><Link to="/home/vehicle-loan">Vehicle Loan Calculator</Link></li>
              </ul>
            </div>

            <div className="col-6 col-lg-2 mb-4">
              <h4>Company</h4>
              <ul className="footer-links">
                <li><Link to="/home/aboutus">About Us</Link></li>
                <li><Link to="/home/contactus">Contact Us</Link></li>
                <li><Link to="/home/faq">FAQs</Link></li>
                <li><Link to="/home/offers">Offers</Link></li>
                <li><Link to="/home/pricing">Pricing</Link></li>
              </ul>
            </div>

            <div className="col-6 col-lg-2 mb-4">
              <h4>Services</h4>
              <ul className="footer-links">
                <li><a href="#">Investment Advisory</a></li>
                <li><a href="#">Tax Planning</a></li>
                <li><a href="#">Insurance Planning</a></li>
                <li><a href="#">Estate Planning</a></li>
                <li><a href="#">Portfolio Management</a></li>
              </ul>
            </div>

            <div className="col-6 col-lg-2 mb-4">
              <h4>Legal</h4>
              <ul className="footer-links">
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms of Service</a></li>
                <li><a href="#">Disclaimer</a></li>
                <li><a href="#">Cookie Policy</a></li>
                <li><a href="#">Grievance Policy</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-middle">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-12 col-md-6">
              <div className="social-links">
                <h5>Follow Us</h5>
                <div className="social-icons">
                  <a href="#" className="social-icon" aria-label="YouTube">
                    <i className="fab fa-youtube"></i>
                  </a>
                  <a href="#" className="social-icon" aria-label="Facebook">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a href="#" className="social-icon" aria-label="LinkedIn">
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                  <a href="#" className="social-icon" aria-label="Twitter">
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a href="#" className="social-icon" aria-label="Instagram">
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a href="#" className="social-icon" aria-label="WhatsApp">
                    <i className="fab fa-whatsapp"></i>
                  </a>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="newsletter">
                <h5>Stay Updated</h5>
                <p>Get the latest financial insights and tips</p>
                <div className="newsletter-form">
                  <input type="email" placeholder="Enter your email" />
                  <button type="button">
                    <i className="fas fa-paper-plane"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-12 col-md-6">
              <div className="certifications">
                <span className="cert-badge">
                  <i className="fas fa-shield-alt"></i>
                  SEBI Registered Research Analyst
                </span>
                <span className="cert-badge">
                  <i className="fas fa-certificate"></i>
                  SEBI Registered Investment Advisor
                </span>
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="footer-contact">
                <p>
                  Need help? Contact us at{' '}
                  <a href="mailto:contact@finwisee.in">contact@finwisee.in</a>
                  {' '}or call{' '}
                  <a href="tel:+919730601468">+91 973 060 1468</a>
                </p>
              </div>
            </div>
          </div>
          <div className="copyright">
            <p>&copy; 2024 Finwisee Pvt Ltd. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
