import React, { useState } from 'react';
import './Contact.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    investmentAmount: '',
    message: '',
    consent: false,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^\+?\d{7,15}$/.test(phone);

  const handleSubmit = (e) => {
    e.preventDefault();
    const tempErrors = {};

    if (!formData.firstName.trim()) tempErrors.firstName = 'Please enter your first name.';
    if (!formData.lastName.trim()) tempErrors.lastName = 'Please enter your last name.';
    if (!formData.email.trim() || !validateEmail(formData.email)) tempErrors.email = 'Please enter a valid email address.';
    if (!formData.phone.trim() || !validatePhone(formData.phone)) tempErrors.phone = 'Please enter a valid phone number (7-15 digits, optional +).';
    if (!formData.subject) tempErrors.subject = 'Please select a subject.';
    if (!formData.message.trim()) tempErrors.message = 'Please enter your message.';
    if (!formData.consent) tempErrors.consent = 'You must agree before submitting.';

    setErrors(tempErrors);

    if (Object.keys(tempErrors).length === 0) {
      alert('Message sent successfully!');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        subject: '',
        investmentAmount: '',
        message: '',
        consent: false,
      });
    }
  };

  return (
    <section className="contact-section">
      <div className="container">
        <div className="form-sidebar-wrapper">
          <div className="form-wrapper">
            <h2>Send Us a Message</h2>
            <p>Have questions about investments? Our experts are here to help you make informed decisions.</p>
            <form onSubmit={handleSubmit}>
              <div className="input-grid">
                <div>
                  <label>First Name *</label>
                  <input name="firstName" value={formData.firstName} onChange={handleChange} />
                  {errors.firstName && <p className="error">{errors.firstName}</p>}
                </div>
                <div>
                  <label>Last Name *</label>
                  <input name="lastName" value={formData.lastName} onChange={handleChange} />
                  {errors.lastName && <p className="error">{errors.lastName}</p>}
                </div>
              </div>

              <div className="input-grid">
                <div>
                  <label>Email Address *</label>
                  <input name="email" type="email" value={formData.email} onChange={handleChange} />
                  {errors.email && <p className="error">{errors.email}</p>}
                </div>
                <div>
                  <label>Phone Number *</label>
                  <input name="phone" type="tel" value={formData.phone} onChange={handleChange} />
                  {errors.phone && <p className="error">{errors.phone}</p>}
                </div>
              </div>

              <div>
                <label>Subject *</label>
                <select name="subject" value={formData.subject} onChange={handleChange}>
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="investment">Investment Consultation</option>
                  <option value="mutual-funds">Mutual Funds</option>
                  <option value="stocks">Stock Trading</option>
                  <option value="portfolio">Portfolio Management</option>
                  <option value="insurance">Insurance</option>
                  <option value="support">Technical Support</option>
                </select>
                {errors.subject && <p className="error">{errors.subject}</p>}
              </div> <br />

              <div>
                <label>Investment Amount (Optional)</label>
                <select name="investmentAmount" value={formData.investmentAmount} onChange={handleChange}>
                  <option value="">Select investment range</option>
                  <option value="under-1-lakh">Under ₹1 Lakh</option>
                  <option value="1-5-lakh">₹1 - 5 Lakhs</option>
                  <option value="5-10-lakh">₹5 - 10 Lakhs</option>
                  <option value="10-25-lakh">₹10 - 25 Lakhs</option>
                  <option value="25-50-lakh">₹25 - 50 Lakhs</option>
                  <option value="above-50-lakh">Above ₹50 Lakhs</option>
                </select>
              </div> <br />

              <div>
                <label>Message *</label>
                <textarea name="message" rows="5" value={formData.message} onChange={handleChange}></textarea>
                {errors.message && <p className="error">{errors.message}</p>}
              </div> <br />

          
              {errors.consent && <p className="error">{errors.consent}</p>}

              <div className="d-flex justify-content-center mt-3">
                  <button type="submit" className="btn btn-primary">Send Message</button>
            </div>

            </form>
          </div>

         
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
