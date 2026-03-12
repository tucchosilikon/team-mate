import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../landing.css';

export const PublicHeader = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const navLinks = [
        { href: '/', label: 'Home' },
        { href: '#services', label: 'Services' },
        { href: '#about', label: 'About' },
        { href: '#contact', label: 'Contact' },
        { href: '/become-an-owner', label: 'Become an Owner' },
    ];

    return (
        <header className="landing-header">
            <div className="landing-container landing-header-container">
                <Link to="/" className="landing-logo-text">
                    Organized Host Partners
                </Link>
                
                <nav className="landing-nav">
                    <ul className="landing-nav-list">
                        {navLinks.map((link) => (
                            <li key={link.label}>
                                <a href={link.href} className="landing-nav-link">
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                    <a href="#contact" className="landing-btn landing-btn-primary" style={{ padding: '10px 24px', fontSize: '0.9rem' }}>
                        Get Started
                    </a>
                </nav>
            </div>
        </header>
    );
};

export const PublicFooter = () => {
    return (
        <footer className="landing-footer">
            <div className="landing-container">
                <div className="landing-footer-grid">
                    <div className="landing-footer-brand">
                        <h3 className="landing-footer-logo">Organized Host Partners</h3>
                        <p style={{ opacity: 0.85, lineHeight: 1.8 }}>
                            Professional property management services dedicated to protecting your investment and maximizing your returns.
                        </p>
                    </div>

                    <div className="landing-footer-links">
                        <h4 className="landing-h4" style={{ color: 'white', marginBottom: '24px' }}>Quick Links</h4>
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li><a href="#about">About Us</a></li>
                            <li><a href="#services">Services</a></li>
                            <li><a href="#contact">Contact</a></li>
                            <li style={{ marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '10px' }}>
                                <Link to="/login" style={{ fontWeight: 'bold', color: 'var(--landing-primary)' }}>Login to TeamMate</Link>
                            </li>
                        </ul>
                    </div>

                    <div className="landing-footer-links">
                        <h4 className="landing-h4" style={{ color: 'white', marginBottom: '24px' }}>Services</h4>
                        <ul>
                            <li>Property Management</li>
                            <li>Tenant Screening</li>
                            <li>Maintenance & Repairs</li>
                            <li>Financial Reporting</li>
                        </ul>
                    </div>

                    <div className="landing-footer-links">
                        <h4 className="landing-h4" style={{ color: 'white', marginBottom: '24px' }}>Contact Us</h4>
                        <p style={{ opacity: 0.85, marginBottom: '12px' }}>House #42, Road #12, Banani<br />Dhaka 1213, Bangladesh</p>
                        <p><a href="tel:+8801712345678" style={{ color: 'var(--landing-primary)' }}>+880 1712 345678</a></p>
                        <p><a href="mailto:info@organizedhost.com" style={{ color: 'var(--landing-primary)' }}>info@organizedhost.com</a></p>
                    </div>
                </div>

                <div className="landing-footer-bottom">
                    <p>&copy; 2026 Organized Host Partners. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

const PublicLayout = ({ children }) => {
    return (
        <div className="landing-body">
            <PublicHeader />
            <main>{children}</main>
            <PublicFooter />
        </div>
    );
};

export default PublicLayout;
