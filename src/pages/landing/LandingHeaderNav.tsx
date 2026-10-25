import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './LandingHeader.css';

export const LandingHeaderNav: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen((prev) => !prev);
    };

    return (
        <header className="landing-header">
            <div className="container landing-header-container" style={{ padding: '1rem' }}>
                <Link to="/list" className="landing-brand">
                    DayLoop Explorer
                </Link>

                <button 
                    className="mobile-menu-btn" 
                    onClick={toggleMenu}
                    aria-label="Toggle navigation menu"
                    aria-expanded={isMenuOpen}
                >
                    {isMenuOpen ? (
                        <svg fill="none" viewBox="0 0 24 24" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg fill="none" viewBox="0 0 24 24" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    )}
                </button>

                <nav className={`landing-nav ${isMenuOpen ? 'is-open' : ''}`}>
                    <Link 
                        to="/locations" 
                        className="nav-link"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Explore Locations
                    </Link>
                    <Link
                        to="/login"
                        className="btn btn-primary"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Admin Login
                    </Link>
                </nav>
            </div>
        </header>
    );
};

export default LandingHeaderNav;