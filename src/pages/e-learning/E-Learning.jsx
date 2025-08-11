import React, { useState } from 'react';
import './E-Learning.css';

const ELearning = () => {
  const [activeTab, setActiveTab] = useState('courses');
  const [selectedCourse, setSelectedCourse] = useState(null);

  const courses = [
    {
      id: 1,
      title: "Investment Fundamentals",
      description: "Learn the basics of investing, different asset classes, and risk management strategies.",
      duration: "8 weeks",
      level: "Beginner",
      modules: 12,
      rating: 4.8,
      students: 1250,
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop",
      price: "Free",
      instructor: "Dr. Sarah Johnson",
      topics: ["Stock Market Basics", "Bond Investing", "Risk Management", "Portfolio Diversification"]
    },
    {
      id: 2,
      title: "Advanced Portfolio Management",
      description: "Master portfolio construction, asset allocation, and advanced investment strategies.",
      duration: "10 weeks",
      level: "Advanced",
      modules: 15,
      rating: 4.9,
      students: 890,
      image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=250&fit=crop",
      price: "₹7999",
      instructor: "Mr. Vishwas kawar ",
      topics: ["Modern Portfolio Theory", "Alternative Investments", "Hedge Fund Strategies", "Risk Metrics"]
    },
    {
      id: 3,
      title: "Financial Planning & Retirement",
      description: "Comprehensive guide to financial planning, retirement strategies, and wealth preservation.",
      duration: "6 weeks",
      level: "Intermediate",
      modules: 10,
      rating: 4.7,
      students: 2100,
      image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&h=250&fit=crop",
      price: "₹4999",
      instructor: "Lisa Rodriguez",
      topics: ["Retirement Planning", "Tax Strategies", "Estate Planning", "Insurance Planning"]
    },
    {
      id: 4,
      title: "Cryptocurrency & Blockchain",
      description: "Understand digital currencies, blockchain technology, and their impact on finance.",
      duration: "4 weeks",
      level: "Intermediate",
      modules: 8,
      rating: 4.6,
      students: 3400,
      image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&h=250&fit=crop",
      price: "₹4999",
      instructor: "CA Rupali Kawar",
      topics: ["Blockchain Basics", "Crypto Trading", "DeFi Protocols", "Regulatory Landscape"]
    },
    {
      id: 5,
      title: "Technical Analysis Mastery",
      description: "Learn chart patterns, indicators, and technical analysis for trading success.",
      duration: "5 weeks",
      level: "Intermediate",
      modules: 14,
      rating: 4.8,
      students: 1650,
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=250&fit=crop",
      price: "₹4999",
      instructor: "Mr. Vishwas Kawar ",
      topics: ["Chart Patterns", "Technical Indicators", "Market Psychology", "Trading Strategies"]
    },
    {
      id: 6,
      title: "Real Estate Investment",
      description: "Comprehensive guide to real estate investing, from residential to commercial properties.",
      duration: "7 weeks",
      level: "Intermediate",
      modules: 11,
      rating: 4.7,
      students: 980,
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=250&fit=crop",
      price: "₹2999",
      instructor: "CA Rupali Kawar",
      topics: ["Property Analysis", "Financing Options", "Market Research", "Investment Strategies"]
    }
  ];

  const webinars = [
    {
      id: 1,
      title: "Market Outlook 2024",
      date: "Dec 15, 2024",
      time: "2:00 PM IST",
      speaker: "Dr. Sarah Johnson",
      attendees: 450,
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop"
    },
    {
      id: 2,
      title: "Tax Planning Strategies",
      date: "Dec 20, 2024",
      time: "3:30 PM IST",
      speaker: "Lisa Rodriguez",
      attendees: 320,
      image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=300&h=200&fit=crop"
    },
    {
      id: 3,
      title: "Crypto Market Analysis",
      date: "Dec 25, 2024",
      time: "4:00 PM IST",
      speaker: "Alex Thompson",
      attendees: 680,
      image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=300&h=200&fit=crop"
    }
  ];

  const resources = [
    {
      id: 1,
      title: "Investment Guide 2024",
      type: "PDF",
      size: "2.5 MB",
      downloads: 1250,
      image: "📄"
    },
    {
      id: 2,
      title: "Portfolio Templates",
      type: "Excel",
      size: "1.8 MB",
      downloads: 890,
      image: "📊"
    },
    {
      id: 3,
      title: "Market Analysis Tools",
      type: "Tools",
      size: "5.2 MB",
      downloads: 650,
      image: "🔧"
    },
    {
      id: 4,
      title: "Tax Planning Checklist",
      type: "PDF",
      size: "1.2 MB",
      downloads: 2100,
      image: "✅"
    }
  ];

  const handleCourseClick = (course) => {
    setSelectedCourse(course);
  };

  const closeModal = () => {
    setSelectedCourse(null);
  };

  return (
    <div className="e-learning-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">Master Financial Education</h1>
            <p className="hero-description">
              Learn from industry experts with our comprehensive e-learning platform. 
              From beginner basics to advanced strategies, we've got you covered.
            </p>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">50+</span>
                <span className="stat-label">Courses</span>
              </div>
              <div className="stat">
                <span className="stat-number">25K+</span>
                <span className="stat-label">Students</span>
              </div>
              <div className="stat">
                <span className="stat-number">4.8</span>
                <span className="stat-label">Rating</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="tabs-section">
        <div className="container">
          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'courses' ? 'active' : ''}`}
              onClick={() => setActiveTab('courses')}
            >
              <i className="fas fa-graduation-cap"></i>
              Courses
            </button>
            <button 
              className={`tab ${activeTab === 'webinars' ? 'active' : ''}`}
              onClick={() => setActiveTab('webinars')}
            >
              <i className="fas fa-video"></i>
              Live Webinars
            </button>
            <button 
              className={`tab ${activeTab === 'resources' ? 'active' : ''}`}
              onClick={() => setActiveTab('resources')}
            >
              <i className="fas fa-download"></i>
              Resources
            </button>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="content-section">
        <div className="container">
          {activeTab === 'courses' && (
            <div className="courses-grid">
              {courses.map((course) => (
                <div key={course.id} className="course-card" onClick={() => handleCourseClick(course)}>
                  <div className="course-image">
                    <img src={course.image} alt={course.title} />
                    <div className="course-level">{course.level}</div>
                  </div>
                  <div className="course-content">
                    <h3 className="course-title">{course.title}</h3>
                    <p className="course-description">{course.description}</p>
                    <div className="course-meta">
                      <span className="duration">
                        <i className="fas fa-clock"></i>
                        {course.duration}
                      </span>
                      <span className="modules">
                        <i className="fas fa-book"></i>
                        {course.modules} modules
                      </span>
                      <span className="rating">
                        <i className="fas fa-star"></i>
                        {course.rating}
                      </span>
                    </div>
                    <div className="course-footer">
                      <span className="price">{course.price}</span>
                      <span className="students">{course.students} students</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'webinars' && (
            <div className="webinars-grid">
              {webinars.map((webinar) => (
                <div key={webinar.id} className="webinar-card">
                  <div className="webinar-image">
                    <img src={webinar.image} alt={webinar.title} />
                    <div className="webinar-live">LIVE</div>
                  </div>
                  <div className="webinar-content">
                    <h3 className="webinar-title">{webinar.title}</h3>
                    <div className="webinar-meta">
                      <span className="date">
                        <i className="fas fa-calendar"></i>
                        {webinar.date}
                      </span>
                      <span className="time">
                        <i className="fas fa-clock"></i>
                        {webinar.time}
                      </span>
                    </div>
                    <p className="speaker">Speaker: {webinar.speaker}</p>
                    <p className="attendees">{webinar.attendees} registered</p>
                    <button className="register-btn">Register Now</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'resources' && (
            <div className="resources-grid">
              {resources.map((resource) => (
                <div key={resource.id} className="resource-card">
                  <div className="resource-icon">{resource.image}</div>
                  <div className="resource-content">
                    <h3 className="resource-title">{resource.title}</h3>
                    <div className="resource-meta">
                      <span className="type">{resource.type}</span>
                      <span className="size">{resource.size}</span>
                    </div>
                    <p className="downloads">{resource.downloads} downloads</p>
                    <button className="download-btn">Download</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Course Modal */}
      {selectedCourse && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              <i className="fas fa-times"></i>
            </button>
            <div className="modal-header">
              <img src={selectedCourse.image} alt={selectedCourse.title} className="modal-image" />
              <div className="modal-info">
                <h2>{selectedCourse.title}</h2>
                <p>{selectedCourse.description}</p>
                <div className="modal-meta">
                  <span><i className="fas fa-user"></i> {selectedCourse.instructor}</span>
                  <span><i className="fas fa-clock"></i> {selectedCourse.duration}</span>
                  <span><i className="fas fa-star"></i> {selectedCourse.rating}</span>
                </div>
              </div>
            </div>
            <div className="modal-body">
              <h3>What you'll learn:</h3>
              <ul className="topics-list">
                {selectedCourse.topics.map((topic, index) => (
                  <li key={index}>
                    <i className="fas fa-check"></i>
                    {topic}
                  </li>
                ))}
              </ul>
              <div className="modal-actions">
                <button className="enroll-btn">Enroll Now - {selectedCourse.price}</button>
                <button className="preview-btn">Preview Course</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ELearning; 