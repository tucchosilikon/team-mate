import React from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';

const BecomeOwner = () => {
  return (
    <PublicLayout>
      <section className="landing-hero" style={{ minHeight: '70vh', display: 'flex', alignItems: 'center' }}>
        <div className="landing-hero-bg"></div>
        <div className="landing-hero-overlay"></div>
        <div className="landing-container" style={{ position: 'relative', textAlign: 'center' }}>
          <h1 className="landing-h1" style={{ color: 'white', marginBottom: '24px', fontSize: '3rem' }}>Vacation rental management just got better</h1>
          <p className="landing-p" style={{ fontSize: '1.25rem', maxWidth: '800px', margin: '0 auto 40px', opacity: 0.9 }}>
            Put your property in front of millions, book up your calendar, and get the edge to earn more with our professional management services.
          </p>
          <a href="#contact" className="landing-btn landing-btn-primary" style={{ padding: '14px 32px', fontSize: '1.1rem' }}>
            See if you qualify
          </a>
        </div>
      </section>

      <section className="landing-section">
        <div className="landing-container">
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 className="landing-h2" style={{ marginBottom: '20px' }}>Proven profits. Less pressure.</h2>
            <p style={{ maxWidth: '700px', margin: '0 auto', fontSize: '1.1rem', color: '#666' }}>
              With 3+ years of experience and industry experts to support your business, we can strategically help you reach your vacation rental goals in an always-changing market.
            </p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px', textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: '3rem', fontWeight: '700', color: 'var(--landing-primary)', marginBottom: '8px' }}>18%</div>
              <div style={{ fontSize: '1.1rem', color: '#666' }}>more revenue than the market average</div>
            </div>
            <div>
              <div style={{ fontSize: '3rem', fontWeight: '700', color: 'var(--landing-primary)', marginBottom: '8px' }}>200+</div>
              <div style={{ fontSize: '1.1rem', color: '#666' }}>owners with thriving properties</div>
            </div>
            <div>
              <div style={{ fontSize: '3rem', fontWeight: '700', color: 'var(--landing-primary)', marginBottom: '8px' }}>98%</div>
              <div style={{ fontSize: '1.1rem', color: '#666' }}>client satisfaction</div>
            </div>
            <div>
              <div style={{ fontSize: '3rem', fontWeight: '700', color: 'var(--landing-primary)', marginBottom: '8px' }}>4.8</div>
              <div style={{ fontSize: '1.1rem', color: '#666' }}>stars earned from guests on average</div>
            </div>
          </div>
        </div>
      </section>

      <section id="plans" className="landing-section" style={{ background: '#f9fafb' }}>
        <div className="landing-container">
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 className="landing-h2" style={{ marginBottom: '20px' }}>Plans built for your needs</h2>
            <p style={{ maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem', color: '#666' }}>
              Get the quality service, proven strategies, industry expertise, and peace of mind you need to maximize your earnings.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
            <div className="landing-service-card" style={{ textAlign: 'center', position: 'relative' }}>
              <h3 className="landing-h3" style={{ marginBottom: '10px' }}>Core</h3>
              <p style={{ color: '#666', marginBottom: '20px' }}>Essential support and flexible tools to simplify vacation rental management</p>
              <div style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '24px', color: 'var(--landing-primary)' }}>
                10%<span style={{ fontSize: '1rem', fontWeight: '400', color: '#666' }}> management fee</span>
              </div>
              <a href="#contact" className="landing-btn landing-btn-primary" style={{ display: 'block', marginBottom: '24px' }}>Get started</a>
              <ul style={{ textAlign: 'left', listStyle: 'none', padding: 0 }}>
                <li style={{ marginBottom: '12px', paddingLeft: '24px', position: 'relative' }}>✓ Professional photos & custom listing</li>
                <li style={{ marginBottom: '12px', paddingLeft: '24px', position: 'relative' }}>✓ Promotion across all top booking sites</li>
                <li style={{ marginBottom: '12px', paddingLeft: '24px', position: 'relative' }}>✓ Guest booking & communication support</li>
                <li style={{ marginBottom: '12px', paddingLeft: '24px', position: 'relative' }}>✓ AI-powered dynamic pricing & revenue management</li>
                <li style={{ marginBottom: '12px', paddingLeft: '24px', position: 'relative' }}>✓ Access to vetted on-the-ground support network</li>
                <li style={{ marginBottom: '12px', paddingLeft: '24px', position: 'relative' }}>✓ $5,000 damage protection & $1M liability insurance</li>
                <li style={{ marginBottom: '12px', paddingLeft: '24px', position: 'relative' }}>✓ 24/7 owner & guest support</li>
              </ul>
            </div>

            <div className="landing-service-card" style={{ textAlign: 'center', position: 'relative', border: '2px solid var(--landing-primary)' }}>
              <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: 'var(--landing-primary)', color: 'white', padding: '4px 16px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600' }}>MOST POPULAR</div>
              <h3 className="landing-h3" style={{ marginBottom: '10px', marginTop: '12px' }}>Plus</h3>
              <p style={{ color: '#666', marginBottom: '20px' }}>More personalized support and expanded benefits to boost your performance</p>
              <div style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '24px', color: 'var(--landing-primary)' }}>
                15%<span style={{ fontSize: '1rem', fontWeight: '400', color: '#666' }}> management fee</span>
              </div>
              <a href="#contact" className="landing-btn landing-btn-primary" style={{ display: 'block', marginBottom: '24px' }}>Get started</a>
              <ul style={{ textAlign: 'left', listStyle: 'none', padding: 0 }}>
                <li style={{ marginBottom: '12px', paddingLeft: '24px', position: 'relative' }}>✓ Professional photos & custom listing</li>
                <li style={{ marginBottom: '12px', paddingLeft: '24px', position: 'relative' }}>✓ Promotion across all top booking sites</li>
                <li style={{ marginBottom: '12px', paddingLeft: '24px', position: 'relative' }}>✓ Guest booking & communication support</li>
                <li style={{ marginBottom: '12px', paddingLeft: '24px', position: 'relative' }}>✓ AI-powered dynamic pricing & revenue management</li>
                <li style={{ marginBottom: '12px', paddingLeft: '24px', position: 'relative' }}>✓ Access to vetted on-the-ground support network</li>
                <li style={{ marginBottom: '12px', paddingLeft: '24px', position: 'relative' }}>✓ $10,000 damage protection & $1M liability insurance</li>
                <li style={{ marginBottom: '12px', paddingLeft: '24px', position: 'relative' }}>✓ 24/7 Premium Support Desk</li>
                <li style={{ marginBottom: '12px', paddingLeft: '24px', position: 'relative' }}>✓ Dedicated Performance Advisor</li>
                <li style={{ marginBottom: '12px', paddingLeft: '24px', position: 'relative' }}>✓ Increased listing exposure</li>
                <li style={{ marginBottom: '12px', paddingLeft: '24px', position: 'relative' }}>✓ Save on decor, supplies & amenities</li>
                <li style={{ marginBottom: '12px', paddingLeft: '24px', position: 'relative' }}>✓ Discounted tax & permit support</li>
                <li style={{ marginBottom: '12px', paddingLeft: '24px', position: 'relative' }}>✓ 10% travel discount</li>
              </ul>
            </div>

            <div className="landing-service-card" style={{ textAlign: 'center', position: 'relative' }}>
              <h3 className="landing-h3" style={{ marginBottom: '10px' }}>Pro</h3>
              <p style={{ color: '#666', marginBottom: '20px' }}>Scaled-up services for investors and operators with multiple rental properties</p>
              <div style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '24px', color: 'var(--landing-primary)' }}>
                Custom<span style={{ fontSize: '1rem', fontWeight: '400', color: '#666' }}> management fee</span>
              </div>
              <a href="#contact" className="landing-btn landing-btn-primary" style={{ display: 'block', marginBottom: '24px' }}>Get started</a>
              <ul style={{ textAlign: 'left', listStyle: 'none', padding: 0 }}>
                <li style={{ marginBottom: '12px', paddingLeft: '24px', position: 'relative' }}>✓ Everything in Plus plan</li>
                <li style={{ marginBottom: '12px', paddingLeft: '24px', position: 'relative' }}>✓ Dedicated booking website</li>
                <li style={{ marginBottom: '12px', paddingLeft: '24px', position: 'relative' }}>✓ Multi-property management tools</li>
                <li style={{ marginBottom: '12px', paddingLeft: '24px', position: 'relative' }}>✓ Management fee based on portfolio size</li>
                <li style={{ marginBottom: '12px', paddingLeft: '24px', position: 'relative' }}>✓ Priority support & dedicated account manager</li>
                <li style={{ marginBottom: '12px', paddingLeft: '24px', position: 'relative' }}>✓ Custom marketing strategies</li>
                <li style={{ marginBottom: '12px', paddingLeft: '24px', position: 'relative' }}>✓ Volume discounts on services</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-section">
        <div className="landing-container">
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 className="landing-h2" style={{ marginBottom: '20px' }}>Why choose Organized Host Partners?</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
            <div className="landing-service-card">
              <h3 className="landing-h3" style={{ marginBottom: '16px' }}>Smart Pricing Technology</h3>
              <p style={{ color: '#666' }}>Our SmartRates technology analyzes billions of data points daily, factoring in seasonality, demand, and guest reviews to automatically adjust rates and policies to lock in the most bookings.</p>
            </div>
            <div className="landing-service-card">
              <h3 className="landing-h3" style={{ marginBottom: '16px' }}>Revenue Experts</h3>
              <p style={{ color: '#666' }}>Our team assesses your property as soon as you sign up, creates a custom strategy that makes your home more competitive, and closely monitors your performance over time.</p>
            </div>
            <div className="landing-service-card">
              <h3 className="landing-h3" style={{ marginBottom: '16px' }}>Full Guest Support</h3>
              <p style={{ color: '#666' }}>We handle inquiries, send confirmation emails, and provide pre-stay details. During their stay, guests can get on-the-ground assistance from our local support network, with our remote team available 24/7.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-section" style={{ background: 'var(--landing-navy)', color: 'white' }}>
        <div className="landing-container" style={{ textAlign: 'center' }}>
          <h2 className="landing-h2" style={{ color: 'white', marginBottom: '20px' }}>Be seen by millions</h2>
          <p style={{ marginBottom: '40px', opacity: 0.9 }}>Your property will be listed on all major booking platforms</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '40px', opacity: 0.8 }}>
            <span style={{ fontSize: '1.5rem', fontWeight: '600' }}>Airbnb</span>
            <span style={{ fontSize: '1.5rem', fontWeight: '600' }}>Booking.com</span>
            <span style={{ fontSize: '1.5rem', fontWeight: '600' }}>Vrbo</span>
            <span style={{ fontSize: '1.5rem', fontWeight: '600' }}>Expedia</span>
            <span style={{ fontSize: '1.5rem', fontWeight: '600' }}>Google</span>
          </div>
        </div>
      </section>

      <section className="landing-section">
        <div className="landing-container">
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 className="landing-h2" style={{ marginBottom: '20px' }}>Get started in a few easy steps</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '30px', textAlign: 'center' }}>
            <div>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--landing-primary)', color: 'white', fontSize: '1.5rem', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>1</div>
              <h4 style={{ marginBottom: '8px' }}>Tell us about your property</h4>
              <p style={{ color: '#666', fontSize: '0.95rem' }}>Share details about your home to get qualified</p>
            </div>
            <div>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--landing-primary)', color: 'white', fontSize: '1.5rem', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>2</div>
              <h4 style={{ marginBottom: '8px' }}>Talk with an advisor</h4>
              <p style={{ color: '#666', fontSize: '0.95rem' }}>Answer your questions and learn what we can do for you</p>
            </div>
            <div>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--landing-primary)', color: 'white', fontSize: '1.5rem', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>3</div>
              <h4 style={{ marginBottom: '8px' }}>Sign up</h4>
              <p style={{ color: '#666', fontSize: '0.95rem' }}>No long-term contract required</p>
            </div>
            <div>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--landing-primary)', color: 'white', fontSize: '1.5rem', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>4</div>
              <h4 style={{ marginBottom: '8px' }}>Professional photoshoot</h4>
              <p style={{ color: '#666', fontSize: '0.95rem' }}>We set up your property for success</p>
            </div>
            <div>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--landing-primary)', color: 'white', fontSize: '1.5rem', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>5</div>
              <h4 style={{ marginBottom: '8px' }}>Go live</h4>
              <p style={{ color: '#666', fontSize: '0.95rem' }}>List on all major booking sites</p>
            </div>
            <div>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--landing-primary)', color: 'white', fontSize: '1.5rem', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>6</div>
              <h4 style={{ marginBottom: '8px' }}>Start earning</h4>
              <p style={{ color: '#666', fontSize: '0.95rem' }}>With customized strategy and expert support</p>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="landing-section landing-section-alt" style={{ textAlign: 'center' }}>
        <div className="landing-container">
          <h2 className="landing-h2" style={{ marginBottom: '20px' }}>Make your investment pay for itself</h2>
          <p style={{ marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}>Ready to maximize your property's potential? Contact us today to get started.</p>
          <a href="mailto:info@organizedhost.com" className="landing-btn landing-btn-primary">Contact Us Today</a>
        </div>
      </section>
    </PublicLayout>
  );
};

export default BecomeOwner;
