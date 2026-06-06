import React, { useRef } from 'react';
import type { Page } from '../App';
import type { Session } from '@supabase/supabase-js';
import { motion, useScroll, useTransform, useMotionValue, useSpring, useInView } from 'framer-motion';
import './Home.css';

interface HomeProps {
  onNavigate: (page: Page) => void;
  session?: Session | null;
}

// 1. Isolated perpetual floating bread visual - React.memo for high performance
const FloatingBread = React.memo(() => {
  return (
    <motion.div
      className="hero-floating-visual"
      animate={{
        y: [-14, 14],
        rotate: [-2, 2],
      }}
      transition={{
        y: {
          duration: 4.2,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        },
        rotate: {
          duration: 6.5,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }
      }}
      style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
    >
      <div className="hero-image-placeholder">
        <div className="placeholder-inner">
          <img src="/Breads-and-Bonds/hero-cake.png" alt="Breads & Bonds Artisanal Cake" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
        </div>
      </div>
    </motion.div>
  );
});
FloatingBread.displayName = 'FloatingBread';


// 3. Magnetic CTA Button component
const MagneticButton: React.FC<{ children: React.ReactNode; onClick: () => void; className?: string }> = ({ children, onClick, className = '' }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e.clientX - rect.left - rect.width / 2;
    const clientY = e.clientY - rect.top - rect.height / 2;
    x.set(clientX * 0.35);
    y.set(clientY * 0.35);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      className={className}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY, position: 'relative' }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.button>
  );
};

// 4. Scroll Entry Drawing Heading
const ScrollDrawHeading: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  return (
    <div className={`scroll-heading-container ${className}`} style={{ position: 'relative', display: 'inline-block' }}>
      <motion.h2
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        style={{ marginBottom: '8px' }}
      >
        {children}
      </motion.h2>
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        style={{
          height: '2px',
          backgroundColor: 'var(--color-accent)',
          transformOrigin: 'left',
          width: '100%'
        }}
      />
    </div>
  );
};

// 5. Scroll-bound SVG Wheat Stalk Separator (PathLength Animation)
const ScrollDrawStalk: React.FC = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const pathLength = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <div ref={ref} className="scroll-draw-svg-container">
      <svg width="40" height="80" viewBox="0 0 24 48" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.35 }}>
        <motion.path
          d="M12 48V4M12 8c2-2 4-2 4 1s-2 3-4 4M12 8c-2-2-4-2-4 1s2 3 4 4M12 16c2-2 4-2 4 1s-2 3-4 4M12 16c-2-2-4-2-4 1s2 3 4 4M12 24c2-2 4-2 4 1s-2 3-4 4M12 24c-2-2-4-2-4 1s2 3 4 4"
          stroke="var(--color-accent)"
          strokeWidth="1.5"
          strokeLinecap="round"
          style={{ pathLength }}
        />
      </svg>
    </div>
  );
};

// 6. Split-Row Philosophy Item Component (Kiran style)
interface PhilosophyRowProps {
  num: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
}

const PhilosophyRow: React.FC<PhilosophyRowProps> = ({ num, title, desc, icon }) => {
  const rowRef = useRef(null);
  const isInView = useInView(rowRef, { once: true, margin: "-120px" });

  return (
    <div ref={rowRef} className="philosophy-row-split">
      {/* 1px separator line that draws itself */}
      <motion.div
        className="philosophy-row-line"
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        style={{
          transformOrigin: 'left',
          height: '1px',
          backgroundColor: 'rgba(181, 90, 68, 0.25)',
          width: '100%',
          position: 'absolute',
          top: 0,
          left: 0
        }}
      />
      
      {/* Enormous ghosted mono background number */}
      <motion.span
        className="philosophy-row-ghost font-mono"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.04 } : {}}
        transition={{ duration: 1.2 }}
        style={{ pointerEvents: 'none', userSelect: 'none' }}
      >
        {num}
      </motion.span>

      <div className="philosophy-row-content">
        {/* Left Column - Large Serif Title */}
        <motion.div
          className="philosophy-row-left"
          initial={{ x: -50, opacity: 0 }}
          animate={isInView ? { x: 0, opacity: 1 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
        >
          <span className="philosophy-row-num-small font-mono">{num}</span>
          <h3 className="philosophy-row-title font-serif">{title}</h3>
          <div className="philosophy-row-icon">{icon}</div>
        </motion.div>

        {/* Right Column - Small Grotesk Description */}
        <motion.div
          className="philosophy-row-right font-sans"
          initial={{ x: 50, opacity: 0 }}
          animate={isInView ? { x: 0, opacity: 1 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        >
          <p className="philosophy-row-desc">{desc}</p>
        </motion.div>
      </div>
    </div>
  );
};

// 7. Kinetic Infinitely-Scrolling Ticker
const FooterMarquee = React.memo(() => {
  return (
    <div className="footer-marquee-wrapper">
      <div className="marquee-track">
        <span>Baked Fresh · Organic · Community · Est. 2024 ·&nbsp;</span>
        <span>Baked Fresh · Organic · Community · Est. 2024 ·&nbsp;</span>
        <span>Baked Fresh · Organic · Community · Est. 2024 ·&nbsp;</span>
        <span>Baked Fresh · Organic · Community · Est. 2024 ·&nbsp;</span>
      </div>
    </div>
  );
});
FooterMarquee.displayName = 'FooterMarquee';

export const Home: React.FC<HomeProps> = ({ onNavigate, session }) => {
  const { scrollY } = useScroll();

  // Scroll parallax rotating ampersand values
  const ampersandRotate = useTransform(scrollY, [0, 800], [0, 8]);
  const ampersandY = useTransform(scrollY, [0, 800], [0, 50]);

  // Words list for clipPath wipe title entrance
  const titleWords = "Baked with intention.".split(" ");

  const wordContainerVariant = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.12,
      }
    }
  };

  const wordInnerVariant = {
    hidden: {
      y: 90,
      clipPath: "inset(100% 0 0 0)"
    },
    visible: {
      y: 0,
      clipPath: "inset(0% 0 0 0)",
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as const
      }
    }
  };

  return (
    <div className="home-page min-h-[100dvh]">
      
      {/* Enormous parallax ghosted ampersand */}
      <motion.div 
        className="hero-ampersand font-serif" 
        style={{ rotate: ampersandRotate, y: ampersandY, pointerEvents: 'none' }}
      >
        &
      </motion.div>

      <section className="hero-section">
        <div className="container hero-container">
          {/* Asymmetric layout - Text left */}
          <div className="hero-content">
            <div className="hero-label font-sans">Artisanal Bakery</div>
            
            {/* Word-by-word clipPath title reveal */}
            <motion.h1 
              className="hero-heading font-serif"
              variants={wordContainerVariant}
              initial="hidden"
              animate="visible"
            >
              {titleWords.map((word, i) => (
                <span key={i} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom', marginRight: '0.22em' }}>
                  <motion.span variants={wordInnerVariant} style={{ display: 'inline-block' }}>
                    {word}
                  </motion.span>
                </span>
              ))}
            </motion.h1>

            {/* Small uppercase spaced sub-label fading in after delay */}
            <motion.p 
              className="hero-spaced-label font-sans"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              ORGANIC DAILY CELEBRATION BREADS AND BAKED GOODS · EST. 2024
            </motion.p>

            <motion.p 
              className="hero-subheading font-sans"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
            >
              Handcrafted daily using organic, locally sourced ingredients. 
              Delivered fresh to your doorstep.
            </motion.p>

            <motion.div 
              className="hero-actions"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.5 }}
            >
              <MagneticButton className="btn-primary" onClick={() => onNavigate('order')}>
                Start Your Order
              </MagneticButton>
              {!session && (
                <button className="btn-secondary" onClick={() => onNavigate('auth')}>
                  Sign In
                </button>
              )}
            </motion.div>
          </div>

          {/* Asymmetric layout - Visual right */}
          <div className="hero-visual">
            <FloatingBread />
          </div>
        </div>
      </section>

      {/* Philosophy Section Rebuilt as split row magazine grids */}
      <section className="features-section">
        <div className="container">
          <div className="features-header text-center">
            <ScrollDrawHeading>Our Philosophy</ScrollDrawHeading>
            <p className="font-sans features-subheading text-xs tracking-[0.2em] uppercase">Simple ingredients, time-honored techniques.</p>
          </div>
          
          <div className="philosophy-asymmetric-list">
            
            {/* Split row 1 */}
            <PhilosophyRow
              num="01"
              title="Organic Ingredients"
              desc="We use only the finest, naturally sourced flour and wild yeast."
              icon={
                <svg width="120" height="120" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.8 }}>
                  <circle cx="50" cy="50" r="30" stroke="var(--color-sage)" strokeWidth="1" strokeDasharray="4 4" />
                  <path d="M40 60C45 45 55 45 60 60M50 35V65M35 50H65" stroke="var(--color-accent)" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              }
            />

            <ScrollDrawStalk />

            {/* Split row 2 */}
            <PhilosophyRow
              num="02"
              title="Baked Fresh Daily"
              desc="Every loaf is baked the morning of your delivery for maximum freshness."
              icon={
                <svg width="120" height="120" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.8 }}>
                  <path d="M30 65C30 55 38 48 50 48C62 48 70 55 70 65H30Z" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" />
                  <path d="M40 38C40 33 44 30 44 26" stroke="var(--color-sage)" strokeWidth="1.2" strokeLinecap="round" />
                  <path d="M50 35C50 30 54 27 54 23" stroke="var(--color-sage)" strokeWidth="1.2" strokeLinecap="round" />
                  <path d="M60 38C60 33 64 30 64 26" stroke="var(--color-sage)" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              }
            />

            <ScrollDrawStalk />

            {/* Split row 3 */}
            <PhilosophyRow
              num="03"
              title="Community First"
              desc="A portion of every sale goes directly to local community kitchens."
              icon={
                <svg width="120" height="120" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.8 }}>
                  <path d="M50 70C50 70 32 52 32 40C32 30 40 24 50 34C60 24 68 30 68 40C68 52 50 70 50 70Z" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinejoin="round" />
                  <path d="M42 42C44 46 48 48 50 48" stroke="var(--color-sage)" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              }
            />

          </div>
        </div>
      </section>

      {/* Footer Kinetic Marquee Ticker */}
      <section className="marquee-footer-section">
        <FooterMarquee />
      </section>
    </div>
  );
};
