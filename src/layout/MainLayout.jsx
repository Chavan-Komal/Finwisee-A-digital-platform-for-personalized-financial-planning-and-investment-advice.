import React, { useState, useEffect } from 'react'
import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'
import SignupPrompt from '../components/SignupPrompt/SignupPrompt'
import { useAuth } from '../context/AuthContext'
import { useLocation, Outlet } from 'react-router-dom'
import "../App.css"
import "./MainLayout.css"

const MainLayout = () => {
  const { user, isAuthenticated } = useAuth();
  const [showSignupPrompt, setShowSignupPrompt] = useState(false);
  const location = useLocation();

  // Pages where we don't want to show the signup prompt
  const excludedPages = ['/auth/login', '/auth/register', '/admin', '/user'];

  useEffect(() => {
    // Check if user has already seen the popup today
    const lastPopupDate = localStorage.getItem('lastSignupPopup');
    const today = new Date().toDateString();
    
    // Show signup prompt for unregistered users after 5 seconds
    // Only if they're not on login/register pages, not already authenticated, and haven't seen it today
    if (!excludedPages.includes(location.pathname) && 
        !isAuthenticated() && 
        lastPopupDate !== today) {
      const timer = setTimeout(() => {
        setShowSignupPrompt(true);
        // Mark that user has seen the popup today
        localStorage.setItem('lastSignupPopup', today);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [location.pathname, isAuthenticated]);

  const handleCloseSignupPrompt = () => {
    setShowSignupPrompt(false);
  };

  return (
    <div className="main-layout">
      <Header />
      <main className="">
        <Outlet />
      </main>
      <Footer />
      
      {showSignupPrompt && (
        <SignupPrompt 
          show={showSignupPrompt} 
          onClose={handleCloseSignupPrompt}
        />
      )}
    </div>
  )
}

export default MainLayout
