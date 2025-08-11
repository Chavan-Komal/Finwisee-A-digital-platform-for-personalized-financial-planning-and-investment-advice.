import React from 'react';
import { Container, Row, Col, Navbar, Nav, NavDropdown, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
 import './About.css'; // Custom styles

const AboutUs = () => {
  return (
    <>
      
      {/* Page Header */}
      <section className="page-header">
       <Container className="text-center my-4">
  <h1 className="page-title">About Finwisee</h1>
  
</Container>

      </section>

      {/* About Content */}
      <section className="content-section">
        <Container>
          <Row>
            <Col lg={8}>
              <div className="about-content">
                <h2>Our Story</h2>
                <p className="lead">
                  Founded in 2008 with a vision to democratize investing in India, InvestYadnya has grown to become one of the most trusted investment advisory firms in the country.
                </p>
                <p>
                  Our journey began when our founders realized that quality investment advice was only available to high-net-worth individuals. We set out to change this by making professional investment guidance accessible to every Indian investor, regardless of their investment size.
                </p>
                <p>
                  Today, we manage over ₹500 crores in assets and serve more than 10,000 satisfied clients across India. Our team of certified financial planners and investment experts work tirelessly to help our clients achieve their financial goals.
                </p>
                <h3 className="mt-5">Our Mission</h3>
                <p>
                  To empower every Indian to build wealth through smart, informed investment decisions. We believe that with the right guidance and tools, anyone can secure their financial future.
                </p>
                <h3 className="mt-4">Our Vision</h3>
                <p>
                  To be India's most trusted and innovative investment platform, making financial planning accessible, transparent, and rewarding for all.
                </p>
                <h3 className="mt-4">Our Values</h3>
                <Row className="mt-3">
                  <Col md={6} className="value-item">
                    <h5><i className="fas fa-shield-alt text-primary me-2"></i>Transparency</h5>
                    <p>We believe in complete transparency in all our dealings and recommendations.</p>
                  </Col>
                  <Col md={6} className="value-item">
                    <h5><i className="fas fa-heart text-primary me-2"></i>Client First</h5>
                    <p>Our clients' interests always come first in every decision we make.</p>
                  </Col>
                  <Col md={6} className="value-item">
                    <h5><i className="fas fa-lightbulb text-primary me-2"></i>Innovation</h5>
                    <p>We continuously innovate to provide better solutions and experiences.</p>
                  </Col>
                  <Col md={6} className="value-item">
                    <h5><i className="fas fa-graduation-cap text-primary me-2"></i>Education</h5>
                    <p>We educate our clients to make informed investment decisions.</p>
                  </Col>
                </Row>
              </div>
            </Col>
            {/* <Col lg={4}>
              <div className="sidebar">
                <h4>Quick Facts</h4>
                <div className="fact-item mb-3">
                  <h5>₹500+ Crores</h5>
                  <p>Assets Under Management</p>
                </div>
                <div className="fact-item mb-3">
                  <h5>10,000+</h5>
                  <p>Happy Clients</p>
                </div>
                <div className="fact-item mb-3">
                  <h5>15+ Years</h5>
                  <p>Industry Experience</p>
                </div>
                <div className="fact-item mb-3">
                  <h5>50+</h5>
                  <p>Expert Team Members</p>
                </div>
                <hr className="my-4" />
                <h4>Certifications</h4>
                <ul className="list-unstyled">
                  <li className="mb-2"><i className="fas fa-check-circle text-success me-2"></i>SEBI Registered Investment Advisor</li>
                  <li className="mb-2"><i className="fas fa-check-circle text-success me-2"></i>AMFI Registered Mutual Fund Distributor</li>
                  <li className="mb-2"><i className="fas fa-check-circle text-success me-2"></i>IRDA Licensed Insurance Broker</li>
                  <li className="mb-2"><i className="fas fa-check-circle text-success me-2"></i>ISO 27001 Certified</li>
                </ul>
              </div>
            </Col> */}
          </Row>
        </Container>
      </section>

      {/* Footer and Team can also be converted in similar component structure */}
    </>
  );
};

export default AboutUs;