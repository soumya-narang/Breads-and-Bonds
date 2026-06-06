import React, { useState, useMemo, useEffect } from 'react';
import type { Page } from '../App';
import { menuData } from '../data/menu';
import type { MenuItem } from '../data/menu';
import { ArrowLeft, ChevronRight, Check, ShoppingBag, Wheat, Leaf, Sprout, Coffee, Sparkles, Gift, Flame, Droplet, Star, Award } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import './OrderFlow.css';

interface Props {
  onNavigate: (page: Page) => void;
}

type OrderType = 'bestseller' | 'custom';

type OrderState = {
  orderType: OrderType;
  bestseller: MenuItem | null;
  base: MenuItem | null;
  sweetener: MenuItem | null;
  flavour: MenuItem | null;
  additionals: MenuItem[];
  date: string;
  time: string;
  phone: string;
  requests: string;
};

const ICON_MAP: Record<string, React.ReactNode> = {
  'bs1': <Star size={32} strokeWidth={1.5} />,
  'bs2': <Sparkles size={32} strokeWidth={1.5} />,
  'bs3': <Gift size={32} strokeWidth={1.5} />,
  'bs4': <Coffee size={32} strokeWidth={1.5} />,
  'bs5': <Leaf size={32} strokeWidth={1.5} />,
  'b1': <Wheat size={32} strokeWidth={1.5} />,
  'b2': <Leaf size={32} strokeWidth={1.5} />,
  'b3': <Sprout size={32} strokeWidth={1.5} />,
  'f1': <Star size={32} strokeWidth={1.5} />,
  'f2': <Flame size={32} strokeWidth={1.5} />,
  'f3': <Coffee size={32} strokeWidth={1.5} />,
  'f4': <Sparkles size={32} strokeWidth={1.5} />,
  'f5': <Droplet size={32} strokeWidth={1.5} />,
  's1': <Sparkles size={32} strokeWidth={1.5} />,
  's2': <Leaf size={32} strokeWidth={1.5} />,
  's3': <Sparkles size={32} strokeWidth={1.5} />,
  's4': <Leaf size={32} strokeWidth={1.5} />,
  'a1': <Droplet size={32} strokeWidth={1.5} />,
  'a2': <Sprout size={32} strokeWidth={1.5} />,
  'a3': <Sprout size={32} strokeWidth={1.5} />,
  'a4': <Sprout size={32} strokeWidth={1.5} />,
  'a5': <Star size={32} strokeWidth={1.5} />,
  'a6': <Gift size={32} strokeWidth={1.5} />,
};

// 1. Particle Burst components
interface Particle {
  id: number;
  x: number;
  y: number;
}

const ParticleBurst: React.FC<{ particles: Particle[] }> = ({ particles }) => {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 99 }}>
      {particles.map(p => (
        <motion.span
          key={p.id}
          initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
          animate={{
            x: p.x,
            y: p.y,
            scale: 0.25,
            opacity: 0
          }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-accent)',
          }}
        />
      ))}
    </div>
  );
};

// 2. Interactive Card Component (Tilt, Spotlight Border, Active state)
interface InteractiveCardProps {
  item: MenuItem;
  isSelected: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
  isBento?: boolean;
  index: number;
  pricePrefix?: string;
}

const InteractiveCard: React.FC<InteractiveCardProps> = ({ item, isSelected, onClick, icon, isBento = false, index, pricePrefix = '' }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const spotlightX = useMotionValue(0);
  const spotlightY = useMotionValue(0);

  const rotateX = useTransform(y, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-8, 8]);

  const springRotateX = useSpring(rotateX, { stiffness: 120, damping: 18 });
  const springRotateY = useSpring(rotateY, { stiffness: 120, damping: 18 });

  const spotlightBg = useTransform(
    [spotlightX, spotlightY],
    ([sx, sy]) => `radial-gradient(150px circle at ${sx}px ${sy}px, rgba(181, 90, 68, 0.12), transparent 85%)`
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    x.set((mouseX / rect.width) - 0.5);
    y.set((mouseY / rect.height) - 0.5);
    
    spotlightX.set(mouseX);
    spotlightY.set(mouseY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const bentoClass = isBento ? `bento-card bento-card-${(index % 5) + 1}` : '';

  return (
    <motion.div
      className={`menu-card ${isSelected ? 'selected' : ''} ${bentoClass}`}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
      style={{
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformStyle: 'preserve-3d',
        perspective: '1000px',
        position: 'relative'
      }}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      {/* Spotlight illumination border effect */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          background: spotlightBg,
          pointerEvents: 'none',
          zIndex: 1,
          borderRadius: 'inherit'
        }}
      />
      
      <div className="card-check" style={{ transform: 'translateZ(15px)' }}>
        {isSelected && <Check size={14} />}
      </div>
      
      {icon && (
        <div className="card-icon" style={{ transform: 'translateZ(20px)' }}>
          {icon}
        </div>
      )}
      
      <h4 className="card-name font-serif" style={{ transform: 'translateZ(15px)' }}>
        {item.name}
      </h4>
      
      {item.description && (
        <p className="card-desc font-sans" style={{ transform: 'translateZ(10px)' }}>
          {item.description}
        </p>
      )}
      
      <span className="card-price font-sans" style={{ transform: 'translateZ(15px)' }}>
        {pricePrefix}₹{item.price}
      </span>
    </motion.div>
  );
};

// 3. Burst Button Component
interface BurstButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
}

const BurstButton: React.FC<BurstButtonProps> = ({ children, onClick, className = '', disabled = false }) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  const handleTrigger = () => {
    if (disabled) return;
    
    const burstParticles = Array.from({ length: 16 }).map((_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const distance = 35 + Math.random() * 55;
      return {
        id: Date.now() + i,
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance
      };
    });

    setParticles(burstParticles);
    setTimeout(() => setParticles([]), 750);
    
    onClick();
  };

  return (
    <button className={className} onClick={handleTrigger} disabled={disabled} style={{ position: 'relative' }}>
      {children}
      <ParticleBurst particles={particles} />
    </button>
  );
};

// 4. Freshness Dot Badge for Steps
const FreshnessDot = React.memo(() => (
  <motion.span
    animate={{
      scale: [1, 1.4, 1],
      opacity: [1, 0.4, 1]
    }}
    transition={{
      duration: 1.8,
      repeat: Infinity,
      ease: "easeInOut"
    }}
    style={{
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      backgroundColor: 'var(--color-sage)',
      display: 'inline-block',
      marginRight: '8px',
      verticalAlign: 'middle'
    }}
  />
));
FreshnessDot.displayName = 'FreshnessDot';

export const OrderFlow: React.FC<Props> = ({ onNavigate }) => {
  const [step, setStep] = useState(1);
  const [order, setOrder] = useState<OrderState>({
    orderType: 'bestseller',
    bestseller: null,
    base: null,
    sweetener: null,
    flavour: null,
    additionals: [],
    date: '',
    time: '',
    phone: '',
    requests: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);

  // Auto-scroll on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  const toggleAdditional = (item: MenuItem) => {
    setOrder(prev => {
      const exists = prev.additionals.find(a => a.id === item.id);
      if (exists) {
        return { ...prev, additionals: prev.additionals.filter(a => a.id !== item.id) };
      }
      return { ...prev, additionals: [...prev.additionals, item] };
    });
  };

  const total = useMemo(() => {
    let sum = 0;
    if (order.orderType === 'bestseller') {
      if (order.bestseller) sum += order.bestseller.price;
    } else {
      if (order.base) sum += order.base.price;
      if (order.sweetener) sum += order.sweetener.price;
      if (order.flavour) sum += order.flavour.price;
    }
    order.additionals.forEach(a => sum += a.price);
    return sum;
  }, [order]);

  const itemCount = useMemo(() => {
    let count = 0;
    if (order.orderType === 'bestseller') {
      if (order.bestseller) count++;
    } else {
      if (order.base) count++;
      if (order.sweetener) count++;
      if (order.flavour) count++;
    }
    count += order.additionals.length;
    return count;
  }, [order]);

  const handleNext = () => {
    if (step === 1) {
      if (order.orderType === 'bestseller' && !order.bestseller) {
        setErrors({ step1: "Please select a Signature Bestseller to continue." });
        return;
      }
      if (order.orderType === 'custom' && (!order.base || !order.sweetener || !order.flavour)) {
        setErrors({ step1: "Please select a Base, Sweetener, and Flavour to continue." });
        return;
      }
      setErrors({});
      setStep(2);
    } else if (step === 2) {
      setErrors({});
      setStep(3);
    } else if (step === 3) {
      const newErrors: Record<string, string> = {};
      if (!order.date) newErrors.date = "Please pick a date for your celebration.";
      if (!order.time) newErrors.time = "What time works best for you?";
      if (!order.phone || order.phone.length < 10) newErrors.phone = "We need your phone number to confirm your order!";
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
      setErrors({});
      setIsSubmitted(true);
    }
  };

  const handleBack = () => {
    setErrors({});
    setStep(step - 1);
  };

  /* ====== RECEIPT VIEW ====== */
  if (isSubmitted) {
    return (
      <div className="receipt-page page-transition min-h-[100dvh]">
        <div className="receipt-container">
          <div className="receipt-paper">
            <div className="receipt-body">
              <div className="receipt-brand">
                <h2 className="font-serif">Breads & Bonds</h2>
                <p className="receipt-type font-sans">Order Confirmation</p>
              </div>

              <div className="receipt-divider"></div>

              <div className="receipt-items">
                {order.orderType === 'bestseller' && order.bestseller && (
                  <div className="receipt-line">
                    <span>{order.bestseller.name}</span>
                    <span className="receipt-dots"></span>
                    <span>₹{order.bestseller.price}</span>
                  </div>
                )}
                {order.orderType === 'custom' && (
                  <>
                    {order.base && (
                      <div className="receipt-line">
                        <span>Base: {order.base.name}</span>
                        <span className="receipt-dots"></span>
                        <span>₹{order.base.price}</span>
                      </div>
                    )}
                    {order.sweetener && (
                      <div className="receipt-line">
                        <span>Sweetener: {order.sweetener.name}</span>
                        <span className="receipt-dots"></span>
                        <span>₹{order.sweetener.price}</span>
                      </div>
                    )}
                    {order.flavour && (
                      <div className="receipt-line">
                        <span>Flavour: {order.flavour.name}</span>
                        <span className="receipt-dots"></span>
                        <span>₹{order.flavour.price}</span>
                      </div>
                    )}
                  </>
                )}
                {order.additionals.map(a => (
                  <div key={a.id} className="receipt-line receipt-line-add">
                    <span>+ {a.name}</span>
                    <span className="receipt-dots"></span>
                    <span>₹{a.price}</span>
                  </div>
                ))}
              </div>

              <div className="receipt-divider"></div>

              <div className="receipt-total-row">
                <span className="font-serif">Total</span>
                <span className="receipt-total-amount font-serif">₹{total}</span>
              </div>

              <div className="receipt-divider"></div>

              <div className="receipt-details font-sans">
                <p><strong>Date:</strong> {order.date}</p>
                <p><strong>Time:</strong> {order.time}</p>
                <p><strong>Phone:</strong> {order.phone}</p>
                {order.requests && <p><strong>Notes:</strong> {order.requests}</p>}
              </div>

              <p className="receipt-whatsapp font-sans">
                You will receive confirmation via WhatsApp shortly.
              </p>

              <BurstButton className="btn-primary receipt-btn" onClick={() => onNavigate('home')}>
                Back to Home
              </BurstButton>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ====== ORDER FORM ====== */
  return (
    <div className="order-page page-transition min-h-[100dvh]">
      <div className="order-header">
        <button className="back-link font-sans" onClick={() => onNavigate('home')}>
          <ArrowLeft size={18} />
          <span>Back to Menu</span>
        </button>
      </div>

      <div className="order-layout">
        {/* Main Form Area */}
        <div className="order-main">
          {/* Step Progress */}
          <div className="progress-bar">
            {[1, 2, 3].map(s => (
              <React.Fragment key={s}>
                <div className={`progress-step ${step >= s ? 'active' : ''} ${step === s ? 'current' : ''}`}>
                  <div className="progress-circle font-sans">
                    {step > s ? <Check size={14} /> : s}
                  </div>
                  <span className="progress-label font-sans">
                    {s === 1 && 'Cake Selection'}
                    {s === 2 && 'Extras'}
                    {s === 3 && 'Details'}
                  </span>
                </div>
                {s < 3 && <div className={`progress-connector ${step > s ? 'done' : ''}`}></div>}
              </React.Fragment>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--space-xl)' }}>
            <h2 className="order-step-title font-serif" style={{ margin: 0, textAlign: 'center' }}>
              {step === 1 && "Choose Your Cake"}
              {step === 2 && "Add Extras & Finishings"}
              {step === 3 && "Final Details"}
            </h2>
          </div>

          {errors[`step${step}`] && (
            <div className="order-error font-sans">
              <span>{errors[`step${step}`]}</span>
            </div>
          )}

          <div className="step-body" key={step}>
            {step === 1 && (
              <>
                {/* Flow Selection Tabs */}
                <div className="order-tabs font-sans">
                  <button 
                    className={`order-tab ${order.orderType === 'bestseller' ? 'active' : ''}`}
                    onClick={() => {
                      setOrder(prev => ({ ...prev, orderType: 'bestseller', base: null, sweetener: null, flavour: null }));
                      setErrors({});
                    }}
                  >
                    Signature Bestsellers
                  </button>
                  <button 
                    className={`order-tab ${order.orderType === 'custom' ? 'active' : ''}`}
                    onClick={() => {
                      setOrder(prev => ({ ...prev, orderType: 'custom', bestseller: null }));
                      setErrors({});
                    }}
                  >
                    Build Your Own
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  {order.orderType === 'bestseller' ? (
                    <motion.div 
                      className="bento-grid"
                      key="bestseller-grid"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {menuData.bestsellers.map((item, index) => (
                        <InteractiveCard
                          key={item.id}
                          item={item}
                          isSelected={order.bestseller?.id === item.id}
                          onClick={() => setOrder({ ...order, bestseller: item })}
                          icon={<Award size={32} strokeWidth={1.5} />}
                          isBento={true}
                          index={index}
                        />
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div 
                      className="custom-build-sections"
                      key="custom-grid"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Section 1: Choose a Base (Zig-Zag) */}
                      <div className="zigzag-section">
                        <div className="zigzag-info">
                          <h3 className="section-label font-serif">1. Choose a Base</h3>
                          <p className="section-desc font-sans">Select the grains and texture that form the soul of your artisanal cake base.</p>
                        </div>
                        <div className="zigzag-cards card-grid-2">
                          {menuData.bases.map((item, index) => (
                            <InteractiveCard
                              key={item.id}
                              item={item}
                              isSelected={order.base?.id === item.id}
                              onClick={() => setOrder({ ...order, base: item })}
                              icon={ICON_MAP[item.id]}
                              index={index}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Section 2: Choose a Sweetener (Zig-Zag Reversed) */}
                      <div className="zigzag-section">
                        <div className="zigzag-info">
                          <h3 className="section-label font-serif">2. Choose a Sweetener</h3>
                          <p className="section-desc font-sans">Sweeten your cake naturally with clean organic sugars, honey, or dates.</p>
                        </div>
                        <div className="zigzag-cards card-grid-2">
                          {menuData.sweeteners.map((item, index) => (
                            <InteractiveCard
                              key={item.id}
                              item={item}
                              isSelected={order.sweetener?.id === item.id}
                              onClick={() => setOrder({ ...order, sweetener: item })}
                              icon={ICON_MAP[item.id]}
                              index={index}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Section 3: Pick a Flavour (Zig-Zag) */}
                      <div className="zigzag-section">
                        <div className="zigzag-info">
                          <h3 className="section-label font-serif">3. Pick a Flavour</h3>
                          <p className="section-desc font-sans">Infuse your creation with fine chocolates, classic vanilla, or warm butterscotch notes.</p>
                        </div>
                        <div className="zigzag-cards card-grid-2">
                          {menuData.flavours.map((item, index) => (
                            <InteractiveCard
                              key={item.id}
                              item={item}
                              isSelected={order.flavour?.id === item.id}
                              onClick={() => setOrder({ ...order, flavour: item })}
                              icon={ICON_MAP[item.id]}
                              index={index}
                            />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}

            {step === 2 && (
              <AnimatePresence mode="wait">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  key="step2-content"
                >
                  <h3 className="section-label font-serif">Add Extras <span className="label-optional font-sans">(optional, multi-select)</span></h3>
                  <div className="card-grid-2">
                    {menuData.additionals.map((item, index) => {
                      const sel = order.additionals.some(a => a.id === item.id);
                      return (
                        <InteractiveCard
                          key={item.id}
                          item={item}
                          isSelected={sel}
                          onClick={() => toggleAdditional(item)}
                          icon={ICON_MAP[item.id]}
                          index={index}
                          pricePrefix="+"
                        />
                      );
                    })}
                  </div>
                </motion.div>
              </AnimatePresence>
            )}

            {step === 3 && (
              <AnimatePresence mode="wait">
                <motion.div
                  className="details-form font-sans"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  key="step3-content"
                >
                  <div className="form-row">
                    <div className="form-field">
                      <label>Pickup/Delivery Date <span className="required">*</span></label>
                      <input type="date" value={order.date} onChange={e => setOrder({ ...order, date: e.target.value })} />
                      {errors.date && <span className="field-error">{errors.date}</span>}
                    </div>
                    <div className="form-field">
                      <label>Preferred Time <span className="required">*</span></label>
                      <input type="time" value={order.time} onChange={e => setOrder({ ...order, time: e.target.value })} />
                      {errors.time && <span className="field-error">{errors.time}</span>}
                    </div>
                  </div>

                  <div className="form-field">
                    <label>Phone Number <span className="required">*</span></label>
                    <input
                      type="tel"
                      placeholder="e.g. 9876543210"
                      value={order.phone}
                      onChange={e => setOrder({ ...order, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                    />
                    {errors.phone && <span className="field-error">{errors.phone}</span>}
                  </div>

                  <div className="form-field">
                    <label>Special Requests</label>
                    <textarea
                      rows={3}
                      placeholder="Any message, allergy info, or decorations..."
                      value={order.requests}
                      onChange={e => setOrder({ ...order, requests: e.target.value })}
                    ></textarea>
                  </div>

                  <div className="form-note">
                    <p>You will receive an order confirmation via <strong>WhatsApp</strong>.</p>
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
          </div>

          <div className="step-nav">
            {step > 1 && (
              <button className="btn-secondary font-sans" onClick={handleBack}>
                Back
              </button>
            )}
            <BurstButton className="btn-primary ml-auto font-sans" onClick={handleNext}>
              {step === 3 ? 'Place Order' : 'Continue'}
              {step < 3 && <ChevronRight size={18} style={{ marginLeft: '4px' }} />}
            </BurstButton>
          </div>
        </div>

        {/* Desktop Sidebar */}
        <aside className="order-sidebar">
          <OrderSummaryContent order={order} total={total} />
        </aside>
      </div>

      {/* Mobile Bottom Bar */}
      <div className="mobile-bar" onClick={() => setMobileSheetOpen(!mobileSheetOpen)}>
        <div className="mobile-bar-info">
          <ShoppingBag size={18} />
          <span className="font-sans">{itemCount} item{itemCount !== 1 ? 's' : ''}</span>
        </div>
        <span className="mobile-bar-total font-serif">₹{total}</span>
      </div>

      {/* Mobile Bottom Sheet */}
      {mobileSheetOpen && (
        <>
          <div className="sheet-overlay" onClick={() => setMobileSheetOpen(false)}></div>
          <div className="mobile-sheet">
            <div className="sheet-handle" onClick={() => setMobileSheetOpen(false)}></div>
            <OrderSummaryContent order={order} total={total} />
          </div>
        </>
      )}
    </div>
  );
};

/* Extracted summary content for reuse */
const OrderSummaryContent: React.FC<{ order: OrderState; total: number }> = ({ order, total }) => (
  <>
    <h3 className="sidebar-title font-serif">Your Order</h3>
    <div className="sidebar-tags">
      <span className="sidebar-tag font-sans">✓ All cakes are eggless</span>
      <span className="sidebar-tag font-sans">✓ Prices inclusive of taxes</span>
    </div>

    <div className="sidebar-items font-sans">
      {order.orderType === 'bestseller' ? (
        order.bestseller ? (
          <div className="sidebar-item">
            <span>{order.bestseller.name}</span>
            <span>₹{order.bestseller.price}</span>
          </div>
        ) : (
          <div className="sidebar-item sidebar-item-empty">Select a signature cake...</div>
        )
      ) : (
        <>
          {order.base ? (
            <div className="sidebar-item">
              <span>{order.base.name}</span>
              <span>₹{order.base.price}</span>
            </div>
          ) : (
            <div className="sidebar-item sidebar-item-empty">Select a base...</div>
          )}

          {order.sweetener && (
            <div className="sidebar-item">
              <span>{order.sweetener.name}</span>
              <span>₹{order.sweetener.price}</span>
            </div>
          )}

          {order.flavour && (
            <div className="sidebar-item">
              <span>{order.flavour.name}</span>
              <span>₹{order.flavour.price}</span>
            </div>
          )}
        </>
      )}

      {order.additionals.map(a => (
        <div key={a.id} className="sidebar-item sidebar-item-add">
          <span>+ {a.name}</span>
          <span>₹{a.price}</span>
        </div>
      ))}
    </div>

    <div className="sidebar-total">
      <span className="font-serif">Total</span>
      <span className="font-serif">₹{total}</span>
    </div>
  </>
);
