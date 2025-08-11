import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './UserDashboard.css';

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [userInfo, setUserInfo] = useState(null);
  const [profile, setProfile] = useState({});
  const [appointments, setAppointments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showBookAppointment, setShowBookAppointment] = useState(false);
  const [showSendMessage, setShowSendMessage] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    // Check if user is logged in and has appropriate role
    if (!user || (user.role !== 'USER' && user.role !== 'ADMIN')) {
      navigate('/auth/login');
      return;
    }
    setUserInfo(user); // Set userInfo from useAuth

    // Load demo data
    loadDemoData();
  }, [user, navigate]);

  const loadDemoData = () => {
    // Demo profile
    const demoProfile = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '1234567890',
      address: '123 Main St, City, State 12345',
      dateOfBirth: '1990-01-15',
      occupation: 'Software Engineer',
      income: '$75,000 - $100,000',
      investmentGoals: 'Retirement Planning',
      riskTolerance: 'Moderate'
    };

    // Demo appointments
    const demoAppointments = [
      { id: 'apt-001', date: '2024-02-15', time: '10:00 AM', type: 'Financial Planning', status: 'confirmed', advisor: 'Sarah Johnson' },
      { id: 'apt-002', date: '2024-02-20', time: '2:00 PM', type: 'Investment Review', status: 'pending', advisor: 'Mike Smith' },
      { id: 'apt-003', date: '2024-02-25', time: '11:30 AM', type: 'Tax Consultation', status: 'cancelled', advisor: 'Lisa Brown' }
    ];

    // Demo messages
    const demoMessages = [
      { id: 'msg-001', from: 'Admin', subject: 'Appointment Confirmation', message: 'Your appointment has been confirmed for February 15th...', date: '2024-02-14', read: false },
      { id: 'msg-002', from: 'Admin', subject: 'Document Review Complete', message: 'We have reviewed your uploaded documents...', date: '2024-02-13', read: true }
    ];

    // Demo documents
    const demoDocuments = [
      { id: 'doc-001', fileName: 'Tax_Returns_2023.pdf', fileSize: '2.5 MB', uploadDate: '2024-02-10', status: 'reviewed' },
      { id: 'doc-002', fileName: 'Investment_Portfolio.xlsx', fileSize: '1.8 MB', uploadDate: '2024-02-12', status: 'pending' },
      { id: 'doc-003', fileName: 'Bank_Statements.pdf', fileSize: '3.2 MB', uploadDate: '2024-02-14', status: 'reviewed' }
    ];

    setProfile(demoProfile);
    setAppointments(demoAppointments);
    setMessages(demoMessages);
    setDocuments(demoDocuments);
  };

  const handleLogout = () => {
    logout(); // Use logout from useAuth
    navigate('/auth/login');
  };

  const updateProfile = (profileData) => {
    setProfile({ ...profile, ...profileData });
    setShowEditProfile(false);
  };

  const bookAppointment = (appointmentData) => {
    const newAppointment = {
      id: `apt-${Date.now()}`,
      ...appointmentData,
      status: 'pending',
      advisor: 'Available Advisor'
    };
    setAppointments([...appointments, newAppointment]);
    setShowBookAppointment(false);
  };

  const sendMessage = (messageData) => {
    const newMessage = {
      id: `msg-${Date.now()}`,
      to: 'Admin',
      subject: messageData.subject,
      message: messageData.message,
      date: new Date().toISOString().split('T')[0],
      read: false
    };
    setMessages([newMessage, ...messages]);
    setShowSendMessage(false);
  };

  const handleFileUpload = (files) => {
    const newFiles = Array.from(files).map(file => ({
      id: `file-${Date.now()}-${Math.random()}`,
      fileName: file.name,
      fileSize: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
      uploadDate: new Date().toISOString().split('T')[0],
      status: 'pending',
      file: file
    }));
    setUploadedFiles([...uploadedFiles, ...newFiles]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    handleFileUpload(files);
  };

  const handleFileInputChange = (e) => {
    const files = e.target.files;
    handleFileUpload(files);
  };

  const removeFile = (fileId) => {
    setUploadedFiles(uploadedFiles.filter(file => file.id !== fileId));
  };

  const renderOverview = () => (
    <div className="overview-section">
      <div className="welcome-card">
        <div className="welcome-content">
          <h2>Welcome back, {profile.firstName}!</h2>
          <p>Here's what's happening with your financial planning</p>
        </div>
        <div className="welcome-avatar">
          <span>{userInfo?.avatar || '👤'}</span>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon appointments">
            <i className="fas fa-calendar-check"></i>
          </div>
          <div className="stat-content">
            <h3>{appointments.length}</h3>
            <p>Appointments</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon messages">
            <i className="fas fa-envelope"></i>
          </div>
          <div className="stat-content">
            <h3>{messages.filter(m => !m.read).length}</h3>
            <p>Unread Messages</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon documents">
            <i className="fas fa-file-alt"></i>
          </div>
          <div className="stat-content">
            <h3>{documents.length + uploadedFiles.length}</h3>
            <p>Documents</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon progress">
            <i className="fas fa-chart-line"></i>
          </div>
          <div className="stat-content">
            <h3>75%</h3>
            <p>Profile Complete</p>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="actions-grid">
          <button className="action-card" onClick={() => setShowBookAppointment(true)}>
            <i className="fas fa-calendar-plus"></i>
            <span>Book Appointment</span>
          </button>
          <button className="action-card" onClick={() => setShowSendMessage(true)}>
            <i className="fas fa-paper-plane"></i>
            <span>Send Message</span>
          </button>
          <button className="action-card" onClick={() => setActiveTab('documents')}>
            <i className="fas fa-upload"></i>
            <span>Upload Documents</span>
          </button>
          <button className="action-card" onClick={() => setShowEditProfile(true)}>
            <i className="fas fa-user-edit"></i>
            <span>Edit Profile</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="profile-section">
      <div className="section-header">
        <h3>My Profile</h3>
        <button className="btn-primary" onClick={() => setShowEditProfile(true)}>
          <i className="fas fa-edit"></i>
          Edit Profile
        </button>
      </div>

      <div className="profile-grid">
        <div className="profile-card">
          <h4>Personal Information</h4>
          <div className="profile-info">
            <div className="info-item">
              <label>Full Name</label>
              <span>{profile.firstName} {profile.lastName}</span>
            </div>
            <div className="info-item">
              <label>Email</label>
              <span>{profile.email}</span>
            </div>
            <div className="info-item">
              <label>Phone</label>
              <span>{profile.phone}</span>
            </div>
            <div className="info-item">
              <label>Date of Birth</label>
              <span>{profile.dateOfBirth}</span>
            </div>
            <div className="info-item">
              <label>Address</label>
              <span>{profile.address}</span>
            </div>
          </div>
        </div>

        <div className="profile-card">
          <h4>Financial Information</h4>
          <div className="profile-info">
            <div className="info-item">
              <label>Occupation</label>
              <span>{profile.occupation}</span>
            </div>
            <div className="info-item">
              <label>Annual Income</label>
              <span>{profile.income}</span>
            </div>
            <div className="info-item">
              <label>Investment Goals</label>
              <span>{profile.investmentGoals}</span>
            </div>
            <div className="info-item">
              <label>Risk Tolerance</label>
              <span>{profile.riskTolerance}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAppointments = () => (
    <div className="appointments-section">
      <div className="section-header">
        <h3>My Appointments</h3>
        <button className="btn-primary" onClick={() => setShowBookAppointment(true)}>
          <i className="fas fa-plus"></i>
          Book Appointment
        </button>
      </div>

      <div className="appointments-list">
        {appointments.map(apt => (
          <div key={apt.id} className={`appointment-item ${apt.status}`}>
            <div className="appointment-header">
              <h4>{apt.type}</h4>
              <span className={`status-badge ${apt.status}`}>
                {apt.status}
              </span>
            </div>
            <div className="appointment-details">
              <p><i className="fas fa-calendar"></i> {apt.date} at {apt.time}</p>
              <p><i className="fas fa-user-tie"></i> {apt.advisor}</p>
            </div>
            <div className="appointment-actions">
              {apt.status === 'pending' && (
                <button className="btn-danger btn-sm">
                  <i className="fas fa-times"></i>
                  Cancel
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMessages = () => (
    <div className="messages-section">
      <div className="section-header">
        <h3>Messages</h3>
        <button className="btn-primary" onClick={() => setShowSendMessage(true)}>
          <i className="fas fa-paper-plane"></i>
          Send Message
        </button>
      </div>

      <div className="messages-list">
        {messages.map(msg => (
          <div key={msg.id} className={`message-item ${!msg.read ? 'unread' : ''}`}>
            <div className="message-header">
              <h4>{msg.subject}</h4>
              <span className="message-date">{msg.date}</span>
            </div>
            <p className="message-from">From: {msg.from}</p>
            <p className="message-preview">{msg.message}</p>
            <div className="message-actions">
              <button className="btn-secondary btn-sm">
                <i className="fas fa-reply"></i>
                Reply
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDocuments = () => (
    <div className="documents-section">
      <div className="section-header">
        <h3>Documents</h3>
      </div>

      <div className="upload-area">
        <div 
          className={`drop-zone ${isDragOver ? 'drag-over' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <i className="fas fa-cloud-upload-alt"></i>
          <h4>Upload Documents</h4>
          <p>Drag and drop files here or click to browse</p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileInputChange}
            style={{ display: 'none' }}
          />
        </div>
      </div>

      <div className="documents-list">
        <h4>Uploaded Documents</h4>
        <div className="documents-grid">
          {[...documents, ...uploadedFiles].map(doc => (
            <div key={doc.id} className="document-item">
              <div className="document-icon">
                <i className="fas fa-file-pdf"></i>
              </div>
              <div className="document-info">
                <h5>{doc.fileName}</h5>
                <p>{doc.fileSize} • {doc.uploadDate}</p>
                <span className={`status-badge ${doc.status}`}>
                  {doc.status}
                </span>
              </div>
              <div className="document-actions">
                <button className="btn-secondary btn-sm">
                  <i className="fas fa-download"></i>
                </button>
                {uploadedFiles.some(f => f.id === doc.id) && (
                  <button 
                    className="btn-danger btn-sm"
                    onClick={() => removeFile(doc.id)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (!userInfo) return null;

  return (
    <div className="user-dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <i className="fas fa-chart-line"></i>
            <span>Finwisee</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <i className="fas fa-tachometer-alt"></i>
            Overview
          </button>
          <button 
            className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <i className="fas fa-user"></i>
            Profile
          </button>
          <button 
            className={`nav-item ${activeTab === 'appointments' ? 'active' : ''}`}
            onClick={() => setActiveTab('appointments')}
          >
            <i className="fas fa-calendar"></i>
            Appointments
          </button>
          <button 
            className={`nav-item ${activeTab === 'messages' ? 'active' : ''}`}
            onClick={() => setActiveTab('messages')}
          >
            <i className="fas fa-envelope"></i>
            Messages
          </button>
          <button 
            className={`nav-item ${activeTab === 'documents' ? 'active' : ''}`}
            onClick={() => setActiveTab('documents')}
          >
            <i className="fas fa-file-alt"></i>
            Documents
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <header className="dashboard-header">
          <div className="header-content">
            <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
            <div className="user-menu">
              <span>Welcome, {profile.firstName}</span>
              <button className="btn-logout" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt"></i>
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="dashboard-content">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'profile' && renderProfile()}
          {activeTab === 'appointments' && renderAppointments()}
          {activeTab === 'messages' && renderMessages()}
          {activeTab === 'documents' && renderDocuments()}
        </main>
      </div>

      {/* Modals */}
      {showEditProfile && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Edit Profile</h3>
              <button className="modal-close" onClick={() => setShowEditProfile(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              updateProfile({
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                address: formData.get('address'),
                occupation: formData.get('occupation'),
                income: formData.get('income'),
                investmentGoals: formData.get('investmentGoals'),
                riskTolerance: formData.get('riskTolerance')
              });
            }}>
              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input type="text" name="firstName" defaultValue={profile.firstName} required />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input type="text" name="lastName" defaultValue={profile.lastName} required />
                </div>
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" name="email" defaultValue={profile.email} required />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input type="tel" name="phone" defaultValue={profile.phone} required />
              </div>
              <div className="form-group">
                <label>Address</label>
                <textarea name="address" rows="3" defaultValue={profile.address} required></textarea>
              </div>
              <div className="form-group">
                <label>Occupation</label>
                <input type="text" name="occupation" defaultValue={profile.occupation} required />
              </div>
              <div className="form-group">
                <label>Annual Income</label>
                <select name="income" defaultValue={profile.income} required>
                  <option value="">Select Income Range</option>
                  <option value="$25,000 - $50,000">$25,000 - $50,000</option>
                  <option value="$50,000 - $75,000">$50,000 - $75,000</option>
                  <option value="$75,000 - $100,000">$75,000 - $100,000</option>
                  <option value="$100,000+">$100,000+</option>
                </select>
              </div>
              <div className="form-group">
                <label>Investment Goals</label>
                <select name="investmentGoals" defaultValue={profile.investmentGoals} required>
                  <option value="">Select Goal</option>
                  <option value="Retirement Planning">Retirement Planning</option>
                  <option value="Wealth Building">Wealth Building</option>
                  <option value="Tax Planning">Tax Planning</option>
                  <option value="Education Funding">Education Funding</option>
                </select>
              </div>
              <div className="form-group">
                <label>Risk Tolerance</label>
                <select name="riskTolerance" defaultValue={profile.riskTolerance} required>
                  <option value="">Select Risk Level</option>
                  <option value="Conservative">Conservative</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Aggressive">Aggressive</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowEditProfile(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Update Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showBookAppointment && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Book Appointment</h3>
              <button className="modal-close" onClick={() => setShowBookAppointment(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              bookAppointment({
                date: formData.get('date'),
                time: formData.get('time'),
                type: formData.get('type')
              });
            }}>
              <div className="form-group">
                <label>Appointment Type</label>
                <select name="type" required>
                  <option value="">Select Type</option>
                  <option value="Financial Planning">Financial Planning</option>
                  <option value="Investment Review">Investment Review</option>
                  <option value="Tax Consultation">Tax Consultation</option>
                  <option value="Retirement Planning">Retirement Planning</option>
                </select>
              </div>
              <div className="form-group">
                <label>Date</label>
                <input type="date" name="date" required />
              </div>
              <div className="form-group">
                <label>Time</label>
                <select name="time" required>
                  <option value="">Select Time</option>
                  <option value="9:00 AM">9:00 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="2:00 PM">2:00 PM</option>
                  <option value="3:00 PM">3:00 PM</option>
                  <option value="4:00 PM">4:00 PM</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowBookAppointment(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Book Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showSendMessage && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Send Message</h3>
              <button className="modal-close" onClick={() => setShowSendMessage(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              sendMessage({
                subject: formData.get('subject'),
                message: formData.get('message')
              });
            }}>
              <div className="form-group">
                <label>Subject</label>
                <input type="text" name="subject" required />
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea name="message" rows="4" required></textarea>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowSendMessage(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard; 