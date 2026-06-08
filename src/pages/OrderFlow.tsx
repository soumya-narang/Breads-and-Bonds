import React, { useState, useMemo, useEffect } from 'react';
import type { Page } from '../App';
import type { Session } from '@supabase/supabase-js';
import { menuData } from '../data/menu';
import type { MenuItem } from '../data/menu';
import { ArrowLeft, ChevronRight, Check, ShoppingBag, Wheat, Leaf, Sprout, Coffee, Sparkles, Gift, Flame, Droplet, Star, Award, Minus, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import './OrderFlow.css';

interface Props {
  onNavigate: (page: Page) => void;
  session?: Session | null;
}

type OrderType = 'bestseller' | 'custom';

export interface CartItem {
  id: string;
  orderType: OrderType;
  bestseller: MenuItem | null;
  base: MenuItem | null;
  sweetener: MenuItem | null;
  flavour: MenuItem | null;
  additionals: MenuItem[];
  quantity: number;
}

type CheckoutDetails = {
  date: string;
  time: string;
  phone: string;
  requests: string;
  fullName: string;
  deliveryAddress: string;
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

const initialCurrentItem: Omit<CartItem, 'id'> = {
  orderType: 'bestseller',
  bestseller: null,
  base: null,
  sweetener: null,
  flavour: null,
  additionals: [],
  quantity: 1
};

export const OrderFlow: React.FC<Props> = ({ onNavigate, session }) => {
  const [step, setStep] = useState(1);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentItem, setCurrentItem] = useState<Omit<CartItem, 'id'>>(initialCurrentItem);
  const [checkoutDetails, setCheckoutDetails] = useState<CheckoutDetails>({
    date: '',
    time: '',
    phone: '',
    requests: '',
    fullName: '',
    deliveryAddress: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
  const [showProceedModal, setShowProceedModal] = useState(false);
  const [quickAddBestseller, setQuickAddBestseller] = useState<MenuItem | null>(null);
  const [quickAddExtras, setQuickAddExtras] = useState<MenuItem[]>([]);
  const [quickAddQuantity, setQuickAddQuantity] = useState(1);

  useEffect(() => {
    const saved = localStorage.getItem('bbCartState');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCart(parsed.cart || []);
        setCurrentItem(parsed.currentItem || initialCurrentItem);
        setCheckoutDetails(parsed.checkoutDetails || {
          date: '', time: '', phone: '', requests: '', fullName: '', deliveryAddress: ''
        });
        setStep(parsed.step || 1);
        localStorage.removeItem('bbCartState');
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    if (!showProceedModal) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [step]);

  const toggleAdditional = (item: MenuItem) => {
    setCurrentItem(prev => {
      const exists = prev.additionals.find(a => a.id === item.id);
      if (exists) {
        return { ...prev, additionals: prev.additionals.filter(a => a.id !== item.id) };
      }
      return { ...prev, additionals: [...prev.additionals, item] };
    });
  };

  const calculateItemPrice = (item: Omit<CartItem, 'id'> | CartItem) => {
    let sum = 0;
    if (item.orderType === 'bestseller' && item.bestseller) {
      sum += item.bestseller.price;
    } else if (item.orderType === 'custom') {
      if (item.base) sum += item.base.price;
      if (item.sweetener) sum += item.sweetener.price;
      if (item.flavour) sum += item.flavour.price;
    }
    item.additionals.forEach(a => sum += a.price);
    return sum * item.quantity;
  };

  const currentItemTotal = useMemo(() => calculateItemPrice(currentItem), [currentItem]);

  const cartTotal = useMemo(() => {
    return cart.reduce((total, item) => total + calculateItemPrice(item), 0);
  }, [cart]);

  const displayTotal = useMemo(() => {
    return step === 3 ? cartTotal : cartTotal + currentItemTotal;
  }, [step, cartTotal, currentItemTotal]);

  const displayItemCount = useMemo(() => {
    let count = cart.reduce((acc, item) => acc + item.quantity, 0);
    if (step < 3) {
      count += currentItem.quantity;
    }
    return count;
  }, [cart, currentItem, step]);

  const handleNext = () => {
    if (step === 1) {
      if (currentItem.orderType === 'bestseller') {
        if (cart.length === 0) {
          setErrors({ step1: "Please add at least one item to your cart before proceeding." });
          return;
        }
        setErrors({});
        setStep(3);
        return;
      }
      if (currentItem.orderType === 'custom' && (!currentItem.base || !currentItem.sweetener || !currentItem.flavour)) {
        setErrors({ step1: "Please select a Base, Sweetener, and Flavour to continue." });
        return;
      }
      setErrors({});
      setStep(2);
    } else if (step === 2) {
      setShowProceedModal(true);
    } else if (step === 3) {
      const newErrors: Record<string, string> = {};
      if (!session) {
        if (!checkoutDetails.fullName) newErrors.fullName = "Please enter your name.";
        if (!checkoutDetails.deliveryAddress) newErrors.deliveryAddress = "Please enter a delivery address.";
      }
      if (!checkoutDetails.date) newErrors.date = "Please pick a date for your celebration.";
      if (!checkoutDetails.time) newErrors.time = "What time works best for you?";
      if (!checkoutDetails.phone || checkoutDetails.phone.length < 10) newErrors.phone = "We need your phone number to confirm your order!";
      
      if (cart.length === 0) {
        newErrors.cart = "Your cart is empty. Please go back and add a cake.";
      }

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
    if (step === 3 && cart.length > 0) {
      // Wait, if they go back from step 3, maybe we shouldn't force them to rebuild. 
      // But we can go back to step 1 to let them add another.
      setCurrentItem(initialCurrentItem);
      setStep(1);
    } else {
      setStep(step - 1);
    }
  };

  const addToCartAndProceed = (nextStep: number) => {
    // Only add to cart if we have a valid cake built (we are coming from step 2)
    if (currentItem.bestseller || (currentItem.base && currentItem.sweetener && currentItem.flavour)) {
      setCart(prev => [...prev, { ...currentItem, id: Date.now().toString() }]);
    }
    
    if (nextStep === 1) {
      setCurrentItem(initialCurrentItem);
    }
    
    setStep(nextStep);
    setShowProceedModal(false);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(c => c.id !== id));
  };

  const handleAddBestsellerToCart = () => {
    if (quickAddBestseller) {
      setCart(prev => [...prev, {
        id: Date.now().toString(),
        orderType: 'bestseller',
        bestseller: quickAddBestseller,
        base: null,
        sweetener: null,
        flavour: null,
        additionals: quickAddExtras,
        quantity: quickAddQuantity
      }]);
      setQuickAddBestseller(null);
      setQuickAddExtras([]);
      setQuickAddQuantity(1);
    }
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
                {cart.map((item, idx) => (
                  <div key={item.id} style={{ marginBottom: '16px' }}>
                    <div className="font-serif" style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '8px' }}>
                      Item {idx + 1} {item.quantity > 1 ? `(x${item.quantity})` : ''}
                    </div>
                    {item.orderType === 'bestseller' && item.bestseller && (
                      <div className="receipt-line">
                        <span>{item.bestseller.name}</span>
                        <span className="receipt-dots"></span>
                        <span>₹{item.bestseller.price * item.quantity}</span>
                      </div>
                    )}
                    {item.orderType === 'custom' && (
                      <>
                        {item.base && (
                          <div className="receipt-line">
                            <span>Base: {item.base.name}</span>
                            <span className="receipt-dots"></span>
                            <span>₹{item.base.price * item.quantity}</span>
                          </div>
                        )}
                        {item.sweetener && (
                          <div className="receipt-line">
                            <span>Sweetener: {item.sweetener.name}</span>
                            <span className="receipt-dots"></span>
                            <span>₹{item.sweetener.price * item.quantity}</span>
                          </div>
                        )}
                        {item.flavour && (
                          <div className="receipt-line">
                            <span>Flavour: {item.flavour.name}</span>
                            <span className="receipt-dots"></span>
                            <span>₹{item.flavour.price * item.quantity}</span>
                          </div>
                        )}
                      </>
                    )}
                    {item.additionals.map(a => (
                      <div key={a.id} className="receipt-line receipt-line-add">
                        <span>+ {a.name}</span>
                        <span className="receipt-dots"></span>
                        <span>₹{a.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              <div className="receipt-divider"></div>

              <div className="receipt-total-row">
                <span className="font-serif">Total</span>
                <span className="receipt-total-amount font-serif">₹{cartTotal}</span>
              </div>

              <div className="receipt-divider"></div>

              <div className="receipt-details font-sans">
                <p><strong>Date:</strong> {checkoutDetails.date}</p>
                <p><strong>Time:</strong> {checkoutDetails.time}</p>
                <p><strong>Phone:</strong> {checkoutDetails.phone}</p>
                {checkoutDetails.requests && <p><strong>Notes:</strong> {checkoutDetails.requests}</p>}
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
      {/* Proceed Modal */}
      <AnimatePresence>
        {showProceedModal && (
          <div className="modal-overlay">
            <motion.div 
              className="modal-content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h3 className="font-serif" style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Cake Ready!</h3>
              <p className="font-sans" style={{ marginBottom: '24px', color: 'var(--color-text-light)' }}>
                Would you like to build another cake, or are you ready to checkout?
              </p>
              
              <div className="modal-actions">
                <button className="btn-secondary font-sans" onClick={() => addToCartAndProceed(1)}>
                  Customize Another Cake
                </button>
                <BurstButton className="btn-primary font-sans" onClick={() => addToCartAndProceed(3)}>
                  Proceed to Checkout
                </BurstButton>
              </div>
              <div style={{ textAlign: 'center', marginTop: '16px' }}>
                <button className="back-link font-sans" onClick={() => setShowProceedModal(false)}>
                  Wait, let me edit this one
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Quick Add Bestseller Modal */}
      <AnimatePresence>
        {quickAddBestseller && (
          <div className="modal-overlay">
            <motion.div 
              className="modal-content"
              style={{ maxWidth: '600px', padding: '24px' }}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 className="font-serif" style={{ fontSize: '1.5rem', margin: 0 }}>{quickAddBestseller.name}</h3>
                <span className="font-serif" style={{ fontSize: '1.2rem', color: 'var(--color-accent)' }}>
                  ₹{(quickAddBestseller.price + quickAddExtras.reduce((s, a) => s + a.price, 0)) * quickAddQuantity}
                </span>
              </div>
              
              <div style={{ textAlign: 'left', marginBottom: '16px' }}>
                <h4 className="font-sans" style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '8px' }}>Add Extras (optional)</h4>
                <div className="card-grid-2" style={{ maxHeight: '250px', overflowY: 'auto', padding: '4px' }}>
                  {menuData.additionals.map((item, index) => {
                    const sel = quickAddExtras.some(a => a.id === item.id);
                    return (
                      <InteractiveCard
                        key={item.id}
                        item={item}
                        isSelected={sel}
                        onClick={() => setQuickAddExtras(prev => sel ? prev.filter(a => a.id !== item.id) : [...prev, item])}
                        icon={ICON_MAP[item.id]}
                        index={index}
                        pricePrefix="+"
                      />
                    );
                  })}
                </div>
              </div>

              <div className="quantity-section font-sans" style={{ background: 'var(--color-bg)', padding: '16px', borderRadius: '8px', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', textAlign: 'left' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--color-text)' }}>Quantity</h4>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <button 
                    className="btn-icon" 
                    onClick={() => setQuickAddQuantity(prev => Math.max(1, prev - 1))}
                    disabled={quickAddQuantity <= 1}
                    style={{ padding: '8px', borderRadius: '50%', background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
                  >
                    <Minus size={18} />
                  </button>
                  <span style={{ fontSize: '1.2rem', fontWeight: 600 }}>{quickAddQuantity}</span>
                  <button 
                    className="btn-icon" 
                    onClick={() => setQuickAddQuantity(prev => prev + 1)}
                    style={{ padding: '8px', borderRadius: '50%', background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
              
              <div className="modal-actions">
                <button className="btn-secondary font-sans" onClick={() => setQuickAddBestseller(null)}>
                  Cancel
                </button>
                <BurstButton className="btn-primary font-sans" onClick={handleAddBestsellerToCart}>
                  Add to Cart
                </BurstButton>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="order-header">
        <button className="back-link font-sans" onClick={() => onNavigate('home')}>
          <ArrowLeft size={18} />
          <span>Back to Menu</span>
        </button>
      </div>

      <div className="order-layout">
        <div className="order-main">
          <div className="progress-bar">
            {[1, 2, 3].map(s => (
              <React.Fragment key={s}>
                <div className={`progress-step ${step >= s ? 'active' : ''} ${step === s ? 'current' : ''}`}>
                  <div className="progress-circle font-sans">
                    {step > s ? <Check size={14} /> : s}
                  </div>
                  <span className="progress-label font-sans">
                    {s === 1 && 'Cake Selection'}
                    {s === 2 && 'Extras & Quantity'}
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
              {step === 2 && "Add Extras & Adjust Quantity"}
              {step === 3 && "Final Details"}
            </h2>
          </div>

          {errors[`step${step}`] && (
            <div className="order-error font-sans">
              <span>{errors[`step${step}`]}</span>
            </div>
          )}
          {errors.cart && (
            <div className="order-error font-sans">
              <span>{errors.cart}</span>
            </div>
          )}

          <div className="step-body" key={step}>
            {step === 1 && (
              <>
                <div className="order-tabs font-sans">
                  <button 
                    className={`order-tab ${currentItem.orderType === 'bestseller' ? 'active' : ''}`}
                    onClick={() => {
                      setCurrentItem(prev => ({ ...prev, orderType: 'bestseller', base: null, sweetener: null, flavour: null }));
                      setErrors({});
                    }}
                  >
                    Signature Bestsellers
                  </button>
                  <button 
                    className={`order-tab ${currentItem.orderType === 'custom' ? 'active' : ''}`}
                    onClick={() => {
                      setCurrentItem(prev => ({ ...prev, orderType: 'custom', bestseller: null }));
                      setErrors({});
                    }}
                  >
                    Build Your Own
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  {currentItem.orderType === 'bestseller' ? (
                    <motion.div 
                      className="bento-grid"
                      key="bestseller-grid"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {menuData.bestsellers.map((item, index) => {
                        const isInCart = cart.some(c => c.orderType === 'bestseller' && c.bestseller?.id === item.id);
                        return (
                          <InteractiveCard
                            key={item.id}
                            item={item}
                            isSelected={isInCart}
                            onClick={() => {
                              setQuickAddBestseller(item);
                              setQuickAddExtras([]);
                              setQuickAddQuantity(1);
                            }}
                            icon={<Award size={32} strokeWidth={1.5} />}
                            isBento={true}
                            index={index}
                          />
                        );
                      })}
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
                              isSelected={currentItem.base?.id === item.id}
                              onClick={() => setCurrentItem({ ...currentItem, base: item })}
                              icon={ICON_MAP[item.id]}
                              index={index}
                            />
                          ))}
                        </div>
                      </div>

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
                              isSelected={currentItem.sweetener?.id === item.id}
                              onClick={() => setCurrentItem({ ...currentItem, sweetener: item })}
                              icon={ICON_MAP[item.id]}
                              index={index}
                            />
                          ))}
                        </div>
                      </div>

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
                              isSelected={currentItem.flavour?.id === item.id}
                              onClick={() => setCurrentItem({ ...currentItem, flavour: item })}
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
                  <div className="card-grid-2" style={{ marginBottom: '2rem' }}>
                    {menuData.additionals.map((item, index) => {
                      const sel = currentItem.additionals.some(a => a.id === item.id);
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

                  <div className="quantity-section font-sans" style={{ background: 'var(--color-surface)', padding: '24px', borderRadius: '12px', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--color-text)' }}>Quantity</h4>
                      <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-light)' }}>How many of this exact cake do you want?</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <button 
                        className="btn-icon" 
                        onClick={() => setCurrentItem(prev => ({ ...prev, quantity: Math.max(1, prev.quantity - 1) }))}
                        disabled={currentItem.quantity <= 1}
                        style={{ padding: '8px', borderRadius: '50%', background: 'var(--color-background)', border: '1px solid var(--color-border)' }}
                      >
                        <Minus size={18} />
                      </button>
                      <span style={{ fontSize: '1.2rem', fontWeight: 600 }}>{currentItem.quantity}</span>
                      <button 
                        className="btn-icon" 
                        onClick={() => setCurrentItem(prev => ({ ...prev, quantity: prev.quantity + 1 }))}
                        style={{ padding: '8px', borderRadius: '50%', background: 'var(--color-background)', border: '1px solid var(--color-border)' }}
                      >
                        <Plus size={18} />
                      </button>
                    </div>
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
                  {!session && (
                    <div className="guest-banner font-sans" style={{ background: 'var(--color-surface)', padding: '16px', borderRadius: '8px', marginBottom: '24px', border: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                      <span>Returning customer?</span>
                      <button className="btn-secondary" onClick={() => {
                        localStorage.setItem('bbCartState', JSON.stringify({ cart, currentItem, checkoutDetails, step: 3 }));
                        onNavigate('auth');
                      }} style={{ padding: '8px 16px', fontSize: '0.9rem' }}>Sign in for faster checkout</button>
                    </div>
                  )}

                  {!session && (
                    <>
                      <div className="form-field">
                        <label>Full Name <span className="required">*</span></label>
                        <input type="text" value={checkoutDetails.fullName} onChange={e => setCheckoutDetails({ ...checkoutDetails, fullName: e.target.value })} />
                        {errors.fullName && <span className="field-error">{errors.fullName}</span>}
                      </div>
                      <div className="form-field">
                        <label>Delivery Address <span className="required">*</span></label>
                        <textarea rows={2} value={checkoutDetails.deliveryAddress} onChange={e => setCheckoutDetails({ ...checkoutDetails, deliveryAddress: e.target.value })}></textarea>
                        {errors.deliveryAddress && <span className="field-error">{errors.deliveryAddress}</span>}
                      </div>
                    </>
                  )}

                  <div className="form-row">
                    <div className="form-field">
                      <label>Pickup/Delivery Date <span className="required">*</span></label>
                      <input type="date" value={checkoutDetails.date} onChange={e => setCheckoutDetails({ ...checkoutDetails, date: e.target.value })} />
                      {errors.date && <span className="field-error">{errors.date}</span>}
                    </div>
                    <div className="form-field">
                      <label>Preferred Time <span className="required">*</span></label>
                      <input type="time" value={checkoutDetails.time} onChange={e => setCheckoutDetails({ ...checkoutDetails, time: e.target.value })} />
                      {errors.time && <span className="field-error">{errors.time}</span>}
                    </div>
                  </div>

                  <div className="form-field">
                    <label>Phone Number <span className="required">*</span></label>
                    <input
                      type="tel"
                      placeholder="e.g. 9876543210"
                      value={checkoutDetails.phone}
                      onChange={e => setCheckoutDetails({ ...checkoutDetails, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                    />
                    {errors.phone && <span className="field-error">{errors.phone}</span>}
                  </div>

                  <div className="form-field">
                    <label>Special Requests</label>
                    <textarea
                      rows={3}
                      placeholder="Any message, allergy info, or decorations..."
                      value={checkoutDetails.requests}
                      onChange={e => setCheckoutDetails({ ...checkoutDetails, requests: e.target.value })}
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
                {step === 3 ? 'Add another cake' : 'Back'}
              </button>
            )}
            <BurstButton className="btn-primary ml-auto font-sans" onClick={handleNext}>
              {step === 1 ? (currentItem.orderType === 'bestseller' ? 'Proceed to Checkout' : 'Continue') : step === 2 ? 'Proceed' : 'Place Order'}
              {step < 3 && <ChevronRight size={18} style={{ marginLeft: '4px' }} />}
            </BurstButton>
          </div>
        </div>

        <aside className="order-sidebar">
          <OrderSummaryContent 
            cart={cart} 
            currentItem={currentItem} 
            step={step} 
            total={displayTotal} 
            onRemove={removeFromCart} 
          />
        </aside>
      </div>

      <div className="mobile-bar" onClick={() => setMobileSheetOpen(!mobileSheetOpen)}>
        <div className="mobile-bar-info">
          <ShoppingBag size={18} />
          <span className="font-sans">{displayItemCount} item{displayItemCount !== 1 ? 's' : ''}</span>
        </div>
        <span className="mobile-bar-total font-serif">₹{displayTotal}</span>
      </div>

      {mobileSheetOpen && (
        <>
          <div className="sheet-overlay" onClick={() => setMobileSheetOpen(false)}></div>
          <div className="mobile-sheet">
            <div className="sheet-handle" onClick={() => setMobileSheetOpen(false)}></div>
            <OrderSummaryContent 
              cart={cart} 
              currentItem={currentItem} 
              step={step} 
              total={displayTotal} 
              onRemove={removeFromCart} 
            />
          </div>
        </>
      )}
    </div>
  );
};

const OrderSummaryContent: React.FC<{ 
  cart: CartItem[]; 
  currentItem: Omit<CartItem, 'id'>; 
  step: number; 
  total: number;
  onRemove: (id: string) => void;
}> = ({ cart, currentItem, step, total, onRemove }) => (
  <>
    <h3 className="sidebar-title font-serif">Your Order</h3>
    <div className="sidebar-tags">
      <span className="sidebar-tag font-sans">✓ All cakes are eggless</span>
      <span className="sidebar-tag font-sans">✓ Prices inclusive of taxes</span>
    </div>

    <div className="sidebar-items font-sans" style={{ maxHeight: 'calc(100vh - 300px)', overflowY: 'auto' }}>
      
      {/* Show existing cart items */}
      {cart.map((item, idx) => (
        <div key={item.id} className="sidebar-cart-item">
          <div className="sidebar-cart-item-header">
            <strong>Item {idx + 1}</strong> (Qty: {item.quantity})
            <button className="btn-icon remove-btn" onClick={() => onRemove(item.id)} title="Remove item">
              <Trash2 size={16} />
            </button>
          </div>
          {item.orderType === 'bestseller' ? (
            <div className="sidebar-item">
              <span>{item.bestseller?.name}</span>
            </div>
          ) : (
            <>
              <div className="sidebar-item"><span>{item.base?.name || 'Custom Base'}</span></div>
              {item.sweetener && <div className="sidebar-item"><span>{item.sweetener.name}</span></div>}
              {item.flavour && <div className="sidebar-item"><span>{item.flavour.name}</span></div>}
            </>
          )}
          {item.additionals.map(a => (
            <div key={a.id} className="sidebar-item sidebar-item-add">
              <span>+ {a.name}</span>
            </div>
          ))}
          <div className="sidebar-item" style={{ borderTop: '1px dashed var(--color-border)', marginTop: '4px', paddingTop: '4px' }}>
            <span>Subtotal</span>
            <span>₹{(
              (item.orderType === 'bestseller' ? (item.bestseller?.price || 0) : ((item.base?.price || 0) + (item.sweetener?.price || 0) + (item.flavour?.price || 0))) 
              + item.additionals.reduce((sum, a) => sum + a.price, 0)
            ) * item.quantity}</span>
          </div>
        </div>
      ))}

      {/* Show item currently being built if we are in step 1 or 2 */}
      {step < 3 && currentItem.orderType === 'custom' && (
        <div className="sidebar-cart-item current-building">
          <div className="sidebar-cart-item-header" style={{ color: 'var(--color-accent)' }}>
            <strong>Building New Item</strong> (Qty: {currentItem.quantity})
          </div>
          
          <>
            {currentItem.base ? (
              <div className="sidebar-item">
                <span>{currentItem.base.name}</span>
                <span>₹{currentItem.base.price}</span>
              </div>
            ) : (
              <div className="sidebar-item sidebar-item-empty">Select a base...</div>
            )}

            {currentItem.sweetener && (
              <div className="sidebar-item">
                <span>{currentItem.sweetener.name}</span>
                <span>₹{currentItem.sweetener.price}</span>
              </div>
            )}

            {currentItem.flavour && (
              <div className="sidebar-item">
                <span>{currentItem.flavour.name}</span>
                <span>₹{currentItem.flavour.price}</span>
              </div>
            )}
          </>

          {currentItem.additionals.map(a => (
            <div key={a.id} className="sidebar-item sidebar-item-add">
              <span>+ {a.name}</span>
              <span>₹{a.price}</span>
            </div>
          ))}
          <div className="sidebar-item" style={{ borderTop: '1px dashed var(--color-border)', marginTop: '4px', paddingTop: '4px' }}>
            <span>Subtotal</span>
            <span>₹{(
              ((currentItem.base?.price || 0) + (currentItem.sweetener?.price || 0) + (currentItem.flavour?.price || 0)) 
              + currentItem.additionals.reduce((sum, a) => sum + a.price, 0)
            ) * currentItem.quantity}</span>
          </div>
        </div>
      )}
    </div>

    <div className="sidebar-total">
      <span className="font-serif">Total</span>
      <span className="font-serif">₹{total}</span>
    </div>
  </>
);
