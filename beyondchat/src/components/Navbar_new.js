import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { path: '/', label: 'Dashboard', icon: '🏠' },
    { path: '/quiz', label: 'Quiz', icon: '📝' },
    { path: '/chat', label: 'Chat', icon: '💬' },
    { path: '/progress', label: 'Progress', icon: '📊' }
  ];

  return (
    <>
      {/* Professional Educational Navigation */}
      <nav className="navbar">
        <div className="responsive-container">
          <div className="flex justify-between items-center py-4">
            {/* Brand */}
            <Link to="/" className="navbar-brand">
              <span>🎓</span>
              BeyondChat
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                >
                  <span>{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden btn btn-outline p-2"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-menu open">
          <div 
            className="absolute inset-0" 
            onClick={closeMobileMenu}
          />
          <div className="mobile-menu-content">
            {/* Mobile Brand */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
              <Link 
                to="/" 
                className="navbar-brand"
                onClick={closeMobileMenu}
              >
                <span>🎓</span>
                BeyondChat
              </Link>
              <button
                onClick={closeMobileMenu}
                className="btn btn-outline p-2"
                aria-label="Close menu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Mobile Navigation Links */}
            <div className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-link w-full justify-start text-left p-3 ${
                    isActive(item.path) ? 'active' : ''
                  }`}
                  onClick={closeMobileMenu}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Mobile Footer */}
            <div className="mt-auto pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
              <p>© 2024 BeyondChat - Educational Platform</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
