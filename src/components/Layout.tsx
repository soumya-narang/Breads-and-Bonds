import React from 'react';
import type { Page } from '../App';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: Page;
  onNavigate: (page: Page) => void;
  session: Session | null;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentPage, onNavigate, session }) => {
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    onNavigate('home');
  };

  return (
    <div className="layout-root">
      <header className="global-header">
        <div className="container header-container">
          <div className="header-logo" onClick={() => onNavigate('home')}>
            Breads & Bonds.
          </div>
          <nav className="header-nav">
            <button 
              className={`nav-link ${currentPage === 'order' ? 'active' : ''}`}
              onClick={() => onNavigate('order')}
            >
              Order
            </button>
            <button 
              className={`nav-link ${currentPage === 'story' ? 'active' : ''}`}
              onClick={() => onNavigate('story')}
            >
              Our Story
            </button>
            <button 
              className={`nav-link ${currentPage === 'policies' ? 'active' : ''}`}
              onClick={() => onNavigate('policies')}
            >
              Policies
            </button>
            
            <div className="nav-divider" />
            
            {session ? (
              <button className="nav-link auth-link" onClick={handleSignOut}>
                Log Out
              </button>
            ) : (
              <button className="nav-link auth-link" onClick={() => onNavigate('auth')}>
                Sign In
              </button>
            )}
          </nav>
        </div>
      </header>
      
      <main className="main-content">
        {children}
      </main>

      <footer className="global-footer">
        <div className="container footer-container">
          <p>© {new Date().getFullYear()} Breads & Bonds. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
