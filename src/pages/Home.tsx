import React, { useState } from 'react';
import type { Page } from '../App';
import './Home.css';
import { Cake, BookOpen, ScrollText } from 'lucide-react';

interface HomeProps {
  onNavigate: (page: Page) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const [isOpening, setIsOpening] = useState(false);

  const handleNavigate = (page: Page) => {
    setIsOpening(true);
    setTimeout(() => {
      onNavigate(page);
    }, 600); // Wait for door opening animation
  };

  return (
    <div className="home-page page-transition">
      {/* Ambient background */}
      <div className="home-ambient"></div>

      <div className="home-content">
        {/* The Vintage Door */}
        <div className={`door-wrapper ${isOpening ? 'door-opening' : ''}`}>
          <div className="door-frame">
            <div className="door texture-wood">
              {/* Top panel */}
              <div className="door-panel door-panel-top">
                <div className="door-glass">
                  <div className="brand-lockup">
                    <div className="brand-ornament">✦</div>
                    <h1 className="brand-name">Breads<br /><span className="brand-ampersand">&</span><br />Bonds</h1>
                    <p className="brand-tagline">Handcrafted Home Bakery</p>
                    <div className="brand-ornament">✦</div>
                  </div>
                </div>
              </div>
              
              {/* Bottom panel */}
              <div className="door-panel door-panel-bottom">
                <div className="door-panel-inset"></div>
              </div>

              {/* Handle */}
              <div className="door-handle-area">
                <div className="door-handle"></div>
                <div className="door-keyhole"></div>
              </div>

              {/* Hinges */}
              <div className="door-hinge door-hinge-top"></div>
              <div className="door-hinge door-hinge-bottom"></div>
            </div>
          </div>
          {/* Door shadow on floor */}
          <div className="door-floor-shadow"></div>
        </div>

        {/* The Chalkboard Menu */}
        <div className="chalkboard-wrapper">
          <div className="chalkboard texture-chalkboard">
            <div className="chalk-header">
              <div className="chalk-flourish">~</div>
              <h2 className="chalk-title">Menu</h2>
              <div className="chalk-flourish">~</div>
            </div>
            
            <nav className="chalk-nav">
              <button className="chalk-btn" onClick={() => handleNavigate('order')}>
                <Cake size={22} strokeWidth={1.5} />
                <span className="chalk-btn-text">Order Now</span>
                <span className="chalk-arrow">→</span>
              </button>
              
              <div className="chalk-separator"></div>
              
              <button className="chalk-btn" onClick={() => handleNavigate('story')}>
                <BookOpen size={22} strokeWidth={1.5} />
                <span className="chalk-btn-text">Our Story</span>
                <span className="chalk-arrow">→</span>
              </button>
              
              <div className="chalk-separator"></div>
              
              <button className="chalk-btn" onClick={() => handleNavigate('policies')}>
                <ScrollText size={22} strokeWidth={1.5} />
                <span className="chalk-btn-text">Policies</span>
                <span className="chalk-arrow">→</span>
              </button>
            </nav>

            <div className="chalk-footer">
              <p className="chalk-note">Baked fresh, with love ♥</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
