import React, { useState } from 'react';
import type { Page } from '../App';
import { supabase } from '../lib/supabase';
import type { Session } from '@supabase/supabase-js';
import './Auth.css';
import './Pages.css'; 

interface AuthProps {
  onNavigate: (page: Page) => void;
  session?: Session | null;
}

export const Auth: React.FC<AuthProps> = ({ onNavigate, session }) => {
  // isLogin determines if we are on the "Sign In" tab or "Sign Up" tab
  const [isLogin, setIsLogin] = useState(true);
  
  // step determines if we are asking for details/email or the 6-digit code
  const [step, setStep] = useState<'details' | 'otp'>('details');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');

  // If already logged in, redirect immediately to order flow
  React.useEffect(() => {
    if (session) {
      onNavigate('order');
    }
  }, [session, onNavigate]);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Both Sign In and Sign Up use OTP
      const { error } = await supabase.auth.signInWithOtp({
        email,
      });
      if (error) throw error;
      setStep('otp');
    } catch (err) {
      const errorObject = err as Error;
      setError(errorObject.message || 'Could not send verification code.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'email'
      });
      
      if (error) throw error;

      // If this was a Sign Up, we now have a session and a user ID, so we upsert the profile!
      // Upsert ensures that if they accidentally used "Sign Up" instead of "Sign In" again,
      // it just updates their delivery address/phone instead of throwing a unique constraint error.
      if (!isLogin && data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            full_name: fullName,
            phone_number: phoneNumber,
            delivery_address: deliveryAddress
          }, { onConflict: 'id' });
          
        if (profileError) {
          console.error("Profile creation error:", profileError);
        }
      }

      // Successfully verified and profile created (if signup)
      onNavigate('order');
    } catch (err) {
      const errorObject = err as Error;
      setError(errorObject.message || 'Invalid verification code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell page-transition auth-page">
      <div className="page-body auth-body">
        <div className="auth-container">
          <header className="auth-header">
            <h1 className="page-heading text-serif">
              {step === 'otp' ? 'Check your email' : isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="page-subheading auth-subheading">
              {step === 'otp'
                ? `We sent a secure code to ${email}`
                : isLogin
                  ? 'Sign in instantly with a secure email code.'
                  : 'Create an account for faster checkout next time.'}
            </p>
          </header>

          {error && <div className="auth-error">{error}</div>}

          {step === 'details' ? (
            <form className="auth-form" onSubmit={handleSendCode}>
              {!isLogin && (
                <>
                  <div className="form-group">
                    <label htmlFor="fullName">Full Name</label>
                    <input
                      id="fullName"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Jane Doe"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phoneNumber">Phone Number</label>
                    <input
                      id="phoneNumber"
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="9876543210"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="deliveryAddress">Delivery Address</label>
                    <textarea
                      id="deliveryAddress"
                      required
                      rows={2}
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="123 Bakery Lane"
                    />
                  </div>
                </>
              )}

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hello@example.com"
                />
              </div>

              <button
                type="submit"
                className="auth-submit-btn text-serif"
                disabled={loading}
              >
                {loading ? 'Sending code...' : 'Send Magic Code'}
              </button>
            </form>
          ) : (
            <form className="auth-form" onSubmit={handleVerifyCode}>
              <div className="form-group">
                <label htmlFor="token">Verification Code</label>
                <input
                  id="token"
                  type="text"
                  required
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="123456"
                  maxLength={6}
                  style={{ letterSpacing: '0.5em', textAlign: 'center', fontSize: '1.2rem' }}
                />
              </div>

              <button
                type="submit"
                className="auth-submit-btn text-serif"
                disabled={loading}
              >
                {loading ? 'Verifying...' : 'Verify & Sign In'}
              </button>
              
              <div style={{ textAlign: 'center', marginTop: '16px' }}>
                <button 
                  type="button" 
                  className="auth-toggle-btn" 
                  onClick={() => setStep('details')}
                >
                  Use a different email
                </button>
              </div>
            </form>
          )}

          {step === 'details' && (
            <div className="auth-footer">
              <p>
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button
                  className="auth-toggle-btn"
                  onClick={() => setIsLogin(!isLogin)}
                  type="button"
                >
                  {isLogin ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
