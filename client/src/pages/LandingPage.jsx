import React from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';

const services = [
  {
    icon: '🏠',
    title: 'Property Management',
    description: 'Comprehensive management services tailored to protect your investment and maximize returns.',
  },
  {
    icon: '✓',
    title: 'Tenant Screening',
    description: 'Thorough background checks and credit evaluations to place quality tenants.',
  },
  {
    icon: '🔧',
    title: 'Maintenance & Repairs',
    description: '24/7 emergency response and regular maintenance to keep your properties in top condition.',
  },
  {
    icon: '📊',
    title: 'Financial Reporting',
    description: 'Transparent monthly statements and annual reports for complete financial clarity.',
  },
];

const stats = [
  { number: '200+', label: 'Properties Managed' },
  { number: '3+', label: 'Years Experience' },
  { number: '98%', label: 'Client Satisfaction' },
  { number: '$25M+', label: 'Property Value' },
];

const LandingPage = () => {
  return (
    <PublicLayout>
      <section className="landing-hero">
        <div className="landing-hero-bg"></div>
        <div className="landing-hero-overlay"></div>
        <div className="landing-container" style={{ position: 'relative', textAlign: 'center' }}>
          <h1 className="landing-h1" style={{ color: 'white', marginBottom: '24px' }}>Professional Property Management You Can Trust</h1>
          <p className="landing-p" style={{ fontSize: '1.25rem', maxWidth: '800px', margin: '0 auto 40px', opacity: 0.9 }}>
            Based in Bangladesh, serving since 2022. We help property owners maximize their investments 
            while we handle the day-to-day responsibilities of managing their properties.
          </p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
            <a href="#contact" className="landing-btn landing-btn-primary">Get Started</a>
            <a href="#services" className="landing-btn landing-btn-outline" style={{ color: 'white', borderColor: 'white' }}>Our Services</a>
          </div>
        </div>
      </section>

      <section id="services" className="landing-section landing-section-alt">
        <div className="landing-container">
          <div className="landing-section-header">
            <h2 className="landing-h2">Our Services</h2>
            <p>Comprehensive property management solutions designed to protect your investment and simplify your life.</p>
          </div>
          <div className="landing-services-grid">
            {services.map((service, index) => (
              <div key={index} className="landing-service-card">
                <div style={{ fontSize: '2.5rem', marginBottom: '20px' }}>{service.icon}</div>
                <h3 className="landing-h3" style={{ marginBottom: '16px' }}>{service.title}</h3>
                <p>{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-section" style={{ background: 'var(--landing-navy)', color: 'white' }}>
        <div className="landing-container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', textAlign: 'center' }}>
            {stats.map((stat, index) => (
              <div key={index}>
                <div style={{ fontSize: '3rem', fontWeight: '700', color: 'var(--landing-primary)', marginBottom: '8px' }}>{stat.number}</div>
                <div style={{ fontSize: '1.1rem', opacity: 0.8 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="landing-section">
        <div className="landing-container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '60px', alignItems: 'center' }}>
            <div>
              <h2 className="landing-h2" style={{ marginBottom: '24px' }}>Why Choose Organized Host Partners?</h2>
              <p style={{ marginBottom: '24px' }}>
                We understand that your property is more than just an investment—it's your legacy. 
                That's why we approach every property with the care and attention it deserves.
              </p>
              <ul style={{ listStyle: 'none', marginBottom: '32px' }}>
                {['Personalized service tailored to your needs', 'Transparent communication every step of the way', 'Proven expertise in the local market', 'Strong relationships with quality tenants'].map(item => (
                  <li key={item} style={{ marginBottom: '12px', display: 'flex', gap: '12px' }}>
                    <span style={{ color: 'var(--landing-primary)' }}>✓</span> {item}
                  </li>
                ))}
              </ul>
              <a href="#contact" className="landing-btn landing-btn-primary">Learn More About Us</a>
            </div>
            <div>
                <img 
                    src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80" alt="Modern property" 
                    style={{ width: '100%', borderRadius: '4px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} 
                />
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="landing-section landing-section-alt" style={{ textAlign: 'center' }}>
        <div className="landing-container">
          <h2 className="landing-h2" style={{ marginBottom: '20px' }}>Ready to Simplify Your Property Management?</h2>
          <p style={{ marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}>Let us help you protect your investment and maximize your returns.</p>
          <a href="mailto:info@organizedhost.com" className="landing-btn landing-btn-primary">Contact Us Today</a>
        </div>
      </section>
    </PublicLayout>
  );
};

export default LandingPage;
