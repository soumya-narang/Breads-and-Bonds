import React from 'react';
import type { Page } from '../App';
import type { Session } from '@supabase/supabase-js';
import './Home.css';

interface HomeProps {
  onNavigate: (page: Page) => void;
  session?: Session | null;
}

export const Home: React.FC<HomeProps> = ({ onNavigate, session }) => {
  return (
    <div className="home-page page-transition">
      <section className="hero-section">
        <div className="container hero-container">
          <div className="hero-content animate-fade-up">
            <div className="hero-label font-sans">Artisanal Bakery</div>
            <h1 className="hero-heading font-serif">
              Exceptional Bread,<br />
              Lasting Bonds.
            </h1>
            <p className="hero-subheading font-sans">
              Handcrafted daily using organic, locally sourced ingredients. 
              Delivered fresh to your doorstep.
            </p>
            <div className="hero-actions">
              <button className="btn-primary" onClick={() => onNavigate('order')}>
                Start Your Order
              </button>
              {!session && (
                <button className="btn-secondary" onClick={() => onNavigate('auth')}>
                  Sign In
                </button>
              )}
            </div>
          </div>
          <div className="hero-visual animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <div className="hero-image-placeholder">
              {/* In a real app, this would be a stunning high-res photo of bread */}
              <div className="placeholder-inner">
                <span className="font-serif">B&B</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <div className="features-header text-center">
            <h2 className="font-serif features-heading">Our Philosophy</h2>
            <p className="font-sans features-subheading">Simple ingredients, time-honored techniques.</p>
          </div>
          
          <div className="features-list">
            <div className="feature-item">
              <div className="feature-number font-serif">01</div>
              <h3 className="feature-title font-sans">Organic Ingredients</h3>
              <p className="feature-desc font-sans">We use only the finest, naturally sourced flour and wild yeast.</p>
            </div>
            
            <div className="feature-divider" />
            
            <div className="feature-item">
              <div className="feature-number font-serif">02</div>
              <h3 className="feature-title font-sans">Baked Fresh Daily</h3>
              <p className="feature-desc font-sans">Every loaf is baked the morning of your delivery for maximum freshness.</p>
            </div>
            
            <div className="feature-divider" />
            
            <div className="feature-item">
              <div className="feature-number font-serif">03</div>
              <h3 className="feature-title font-sans">Community First</h3>
              <p className="feature-desc font-sans">A portion of every sale goes directly to local community kitchens.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
