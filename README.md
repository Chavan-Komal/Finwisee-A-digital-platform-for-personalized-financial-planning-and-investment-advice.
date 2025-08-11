# Finwisee - Financial Planning Platform

A comprehensive financial planning platform with user and admin dashboards, featuring modern UI/UX design and full functionality.

## Features

### Landing Page
- Modern, clean design with professional color scheme
- Hero section with compelling call-to-action
- Features showcase with icons and descriptions
- Services preview section
- Responsive design for all devices

### Authentication System
- **Login Page**: Modern design with role-based authentication
- **Registration Page**: Complete user registration with form validation
- **Demo Credentials**:
  - **Admin**: admin@finwisee.com / admin123
  - **User**: user@finwisee.com / user123

### Admin Dashboard
- **User Management**: Add/remove users, view user details
- **Appointment Management**: Schedule and manage appointments
- **Messaging System**: Send messages to users
- **Document Management**: Review uploaded documents
- **Overview**: Statistics and recent activity

### User Dashboard
- **Profile Management**: View and edit personal information
- **Appointment Booking**: Schedule appointments with advisors
- **Messaging**: Send messages to admin
- **Document Upload**: Drag-and-drop file upload with multiple format support
- **Overview**: Quick actions and statistics

## Technology Stack

- **Frontend**: React 19.1.0
- **Build Tool**: Vite 6.3.5
- **Routing**: React Router DOM
- **Styling**: Custom CSS with modern design patterns
- **Icons**: Font Awesome & Bootstrap Icons
- **UI Framework**: Tailwind CSS (dev dependency)

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```

3. **Access the Application**:
   - Open `http://localhost:5173` in your browser
   - Navigate to `/main/login` to access the login page
   - Use the demo credentials to test different roles

## Project Structure

```
src/
├── components/
│   ├── Header/          # Navigation header
│   ├── Hero/           # Landing page hero section
│   └── Footer/         # Footer component
├── pages/
│   ├── admin/          # Admin dashboard
│   ├── user/           # User dashboard
│   ├── login/          # Authentication pages
│   ├── register/       # User registration
│   └── ...             # Other pages
├── layout/
│   └── MainLayout.jsx  # Main layout wrapper
└── App.jsx             # Main application component
```

## Key Features

### Authentication & Authorization
- Role-based access control (Admin/User)
- Session management with localStorage
- Protected routes for dashboards

### Admin Capabilities
- **User Management**: Add, remove, and view users
- **Appointment Scheduling**: Create appointments for users
- **Messaging**: Send messages to individual users
- **Document Review**: Mark documents as reviewed

### User Capabilities
- **Profile Management**: Complete profile with financial information
- **Appointment Booking**: Schedule appointments with different types
- **Messaging**: Send messages to admin
- **Document Upload**: Drag-and-drop interface supporting multiple formats

### UI/UX Features
- **Responsive Design**: Works on all screen sizes
- **Modern Design**: Clean, professional interface
- **Interactive Elements**: Hover effects, animations, and transitions
- **Accessibility**: Proper contrast and keyboard navigation

## Demo Credentials

### Admin Access
- **Email**: admin@finwisee.com
- **Password**: admin123
- **Features**: Full administrative access

### User Access
- **Email**: user@finwisee.com
- **Password**: user123
- **Features**: User dashboard access

## Development Notes

- All data is stored in localStorage for demo purposes
- File uploads are simulated (no actual file storage)
- Authentication is client-side for demonstration
- Responsive design tested on multiple screen sizes

## Future Enhancements

- Backend integration with real database
- File upload to cloud storage
- Real-time messaging system
- Advanced analytics and reporting
- Multi-language support
- Advanced security features

## License

This project is for demonstration purposes.
