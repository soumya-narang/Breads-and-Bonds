import React, { useState, useMemo } from 'react';
import type { Page } from '../App';
import { menuData } from '../data/menu';
import type { MenuItem } from '../data/menu';
import { ArrowLeft, ChevronRight, Check, ShoppingBag, Wheat, Leaf, Sprout, Coffee, Sparkles, Gift, Flame, Droplet, Star, Award } from 'lucide-react';
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
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (step === 2) {
      setErrors({});
      setStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setErrors({});
    setStep(step - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* ====== RECEIPT VIEW ====== */
  if (isSubmitted) {
    return (
      <div className="receipt-page page-transition">
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

              <div className="receipt-details">
                <p><strong>Date:</strong> {order.date}</p>
                <p><strong>Time:</strong> {order.time}</p>
                <p><strong>Phone:</strong> {order.phone}</p>
                {order.requests && <p><strong>Notes:</strong> {order.requests}</p>}
              </div>

              <p className="receipt-whatsapp">
                You will receive confirmation via WhatsApp shortly.
              </p>

              <button className="btn-primary receipt-btn" onClick={() => onNavigate('home')}>
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ====== ORDER FORM ====== */
  return (
    <div className="order-page page-transition">
      <div className="order-header">
        <button className="back-link" onClick={() => onNavigate('home')}>
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

          <h2 className="order-step-title font-serif">
            {step === 1 && "Choose Your Cake"}
            {step === 2 && "Add Extras & Finishings"}
            {step === 3 && "Final Details"}
          </h2>

          {errors[`step${step}`] && (
            <div className="order-error animate-fade-up">
              <span>{errors[`step${step}`]}</span>
            </div>
          )}

          <div className="step-body animate-fade-up" key={step}>
            {step === 1 && (
              <>
                {/* Flow Selection Tabs */}
                <div className="order-tabs">
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

                {order.orderType === 'bestseller' ? (
                  <div className="card-grid bestseller-grid">
                    {menuData.bestsellers.map(item => (
                      <div
                        key={item.id}
                        className={`menu-card hover-lift ${order.bestseller?.id === item.id ? 'selected' : ''}`}
                        onClick={() => setOrder({ ...order, bestseller: item })}
                      >
                        <div className="card-check">{order.bestseller?.id === item.id && <Check size={16} />}</div>
                        <div className="card-icon"><Award size={32} strokeWidth={1.5} /></div>
                        <h4 className="card-name">{item.name}</h4>
                        <p className="card-desc font-sans">{item.description}</p>
                        <span className="card-price">₹{item.price}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="custom-build-sections">
                    <div className="custom-section">
                      <h3 className="section-label font-serif">1. Choose a Base</h3>
                      <div className="card-grid">
                        {menuData.bases.map(item => (
                          <div
                            key={item.id}
                            className={`menu-card hover-lift ${order.base?.id === item.id ? 'selected' : ''}`}
                            onClick={() => setOrder({ ...order, base: item })}
                          >
                            <div className="card-check">{order.base?.id === item.id && <Check size={16} />}</div>
                            <div className="card-icon">{ICON_MAP[item.id]}</div>
                            <h4 className="card-name">{item.name}</h4>
                            <span className="card-price">₹{item.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="custom-section">
                      <h3 className="section-label font-serif">2. Choose a Sweetener</h3>
                      <div className="card-grid">
                        {menuData.sweeteners.map(item => (
                          <div
                            key={item.id}
                            className={`menu-card hover-lift ${order.sweetener?.id === item.id ? 'selected' : ''}`}
                            onClick={() => setOrder({ ...order, sweetener: item })}
                          >
                            <div className="card-check">{order.sweetener?.id === item.id && <Check size={16} />}</div>
                            <div className="card-icon">{ICON_MAP[item.id]}</div>
                            <h4 className="card-name">{item.name}</h4>
                            <span className="card-price">₹{item.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="custom-section">
                      <h3 className="section-label font-serif">3. Pick a Flavour</h3>
                      <div className="card-grid">
                        {menuData.flavours.map(item => (
                          <div
                            key={item.id}
                            className={`menu-card hover-lift ${order.flavour?.id === item.id ? 'selected' : ''}`}
                            onClick={() => setOrder({ ...order, flavour: item })}
                          >
                            <div className="card-check">{order.flavour?.id === item.id && <Check size={16} />}</div>
                            <div className="card-icon">{ICON_MAP[item.id]}</div>
                            <h4 className="card-name">{item.name}</h4>
                            <span className="card-price">₹{item.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {step === 2 && (
              <>
                <h3 className="section-label font-serif">Add Extras <span className="label-optional font-sans">(optional, multi-select)</span></h3>
                <div className="card-grid">
                  {menuData.additionals.map(item => {
                    const sel = order.additionals.some(a => a.id === item.id);
                    return (
                      <div
                        key={item.id}
                        className={`menu-card hover-lift ${sel ? 'selected' : ''}`}
                        onClick={() => toggleAdditional(item)}
                      >
                        <div className="card-check">{sel && <Check size={16} />}</div>
                        <div className="card-icon">{ICON_MAP[item.id]}</div>
                        <h4 className="card-name">{item.name}</h4>
                        <span className="card-price">+₹{item.price}</span>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {step === 3 && (
              <div className="details-form">
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
              </div>
            )}
          </div>

          <div className="step-nav">
            {step > 1 && (
              <button className="btn-secondary" onClick={handleBack}>
                Back
              </button>
            )}
            <button className="btn-primary ml-auto" onClick={handleNext}>
              {step === 3 ? 'Place Order' : 'Continue'}
              {step < 3 && <ChevronRight size={18} style={{ marginLeft: '4px' }} />}
            </button>
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
          <div className="mobile-sheet animate-fade-up">
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
