import React, { useState, useEffect } from 'react';
import type { Page } from '../App';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { motion, useScroll, useSpring, useMotionValue } from 'framer-motion';
import { ShoppingBag, BookOpen, ScrollText } from 'lucide-react';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: Page;
  onNavigate: (page: Page) => void;
  session: Session | null;
}

interface NavLinkProps {
  children: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
  className?: string;
}

const NavLink: React.FC<NavLinkProps> = ({ children, isActive, onClick, className = '' }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      className={`nav-link-custom ${isActive ? 'active' : ''} ${className}`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      <span className="nav-link-text">{children}</span>
      <motion.span
        className="nav-link-underline"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isHovered || isActive ? 1 : 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '2px',
          backgroundColor: 'var(--color-accent)',
          transformOrigin: isHovered ? 'left' : 'right', // Slide in from left, slide out to right
          zIndex: 1,
        }}
      />
    </button>
  );
};

export const Layout: React.FC<LayoutProps> = ({ children, currentPage, onNavigate, session }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isIntroActive, setIsIntroActive] = useState(true);

  // Custom cursor states
  const [isHovering, setIsHovering] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(false);
  const [isFinePointer, setIsFinePointer] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    }
    return false;
  });

  // Mouse coordinate motion values
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Spring options for cursor lag
  const cursorX = useSpring(mouseX, { stiffness: 450, damping: 30 });
  const cursorY = useSpring(mouseY, { stiffness: 450, damping: 30 });

  const { scrollY } = useScroll();

  // Track page scroll depth
  const { scrollYProgress } = useScroll();
  const progressScaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    // 1. Detect if the cursor is controlled by a fine pointer device (like a mouse)
    const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    const handler = (e: MediaQueryListEvent) => setIsFinePointer(e.matches);
    mediaQuery.addEventListener('change', handler);

    // 2. Track page scroll
    const unsubscribeScroll = scrollY.onChange((latest) => {
      setScrolled(latest > 80);
    });

    // 3. Intro loader shimmer for stripe
    const timer = setTimeout(() => {
      setIsIntroActive(false);
    }, 800);

    return () => {
      mediaQuery.removeEventListener('change', handler);
      unsubscribeScroll();
      clearTimeout(timer);
    };
  }, [scrollY]);

  // Handle cursor mouse events
  useEffect(() => {
    if (!isFinePointer) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!cursorVisible) setCursorVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = target.closest('a, button, select, input, textarea, [role="button"], .menu-card');
      setIsHovering(!!isInteractive);
    };

    const handleMouseLeaveWindow = () => {
      setCursorVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseleave', handleMouseLeaveWindow);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeaveWindow);
    };
  }, [isFinePointer, cursorVisible, mouseX, mouseY]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    onNavigate('home');
  };

  return (
    <div className="layout-root">
      {/* 1. Custom Spring Cursor */}
      {isFinePointer && cursorVisible && (
        <motion.div
          className="custom-cursor"
          style={{
            position: 'fixed',
            left: 0,
            top: 0,
            x: cursorX,
            y: cursorY,
            translateX: '-50%',
            translateY: '-50%',
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-accent)',
            pointerEvents: 'none',
            zIndex: 99999,
          }}
          animate={{
            scale: isHovering ? 2.5 : 1,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        />
      )}

      {/* 2. Top Progress Stripe / Intro Shimmer */}
      <motion.div
        className="scroll-progress-bar"
        style={{
          scaleX: isIntroActive ? undefined : progressScaleX,
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '2.5px',
          backgroundColor: 'var(--color-accent)',
          transformOrigin: '0%',
          zIndex: 1000
        }}
        initial={{ scaleX: 0 }}
        animate={isIntroActive ? { scaleX: [0, 1] } : {}}
        transition={isIntroActive ? { duration: 0.8, ease: "easeInOut" } : undefined}
      />

      <header className={`global-header ${scrolled ? 'scrolled' : 'transparent'}`}>
        <div className="container header-container">
          <div className="header-logo" onClick={() => onNavigate('home')}>
            
          </div>
          <nav className="header-nav font-sans">
            <NavLink 
              isActive={currentPage === 'order'}
              onClick={() => onNavigate('order')}
            >
              Order
            </NavLink>
            <NavLink 
              isActive={currentPage === 'story'}
              onClick={() => onNavigate('story')}
            >
              Our Story
            </NavLink>
            <NavLink 
              isActive={currentPage === 'policies'}
              onClick={() => onNavigate('policies')}
            >
              Policies
            </NavLink>
            
            <div className="nav-divider" />
            
            {session ? (
              <NavLink className="auth-link" isActive={currentPage === 'account'} onClick={() => onNavigate('account')}>
                My Account
              </NavLink>
            ) : (
              <NavLink className="auth-link" isActive={currentPage === 'auth'} onClick={() => onNavigate('auth')}>
                Sign In
              </NavLink>
            )}
          </nav>
        </div>
      </header>
      
      <main className="main-content">
        {children}
      </main>

      {/* Mobile Bottom Navigation - visible only on ≤768px */}
      <nav className="mobile-bottom-nav font-sans">
        <button
          className={`mobile-nav-item ${currentPage === 'order' ? 'active' : ''}`}
          onClick={() => onNavigate('order')}
        >
          <ShoppingBag size={20} strokeWidth={1.8} />
          <span>Order</span>
        </button>
        <button
          className={`mobile-nav-item ${currentPage === 'story' ? 'active' : ''}`}
          onClick={() => onNavigate('story')}
        >
          <BookOpen size={20} strokeWidth={1.8} />
          <span>Our Story</span>
        </button>
        <button
          className={`mobile-nav-item ${currentPage === 'policies' ? 'active' : ''}`}
          onClick={() => onNavigate('policies')}
        >
          <ScrollText size={20} strokeWidth={1.8} />
          <span>Policies</span>
        </button>
      </nav>

      <footer className="global-footer font-sans">
        <div className="container footer-container">
          <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
            © {new Date().getFullYear()} Breads & Bonds. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};
