import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
  const { items, removeFromCart, clearCart, getCartTotal, getCartSavings } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');

  const handleCheckout = async () => {
    if (items.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Here you would integrate with your backend to create a Stripe payment intent
      // For now, we'll simulate the payment process
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real implementation, you would:
      // 1. Call your backend to create a payment intent
      // 2. Redirect to Stripe Checkout or handle payment with Stripe Elements
      // 3. Process the payment result
      
      alert('Payment processed successfully! (This is a demo)');
      clearCart();
      navigate('/home');
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleContinueShopping = () => {
    navigate('/home/pricing');
  };

  if (items.length === 0) {
    return (
      <div className="cart-empty">
        <div className="empty-container">
          <div className="empty-icon">
            <i className="fas fa-shopping-cart"></i>
          </div>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added any services to your cart yet.</p>
          <button className="btn-continue-shopping" onClick={handleContinueShopping}>
            <i className="fas fa-arrow-left"></i>
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-header">
          <h1>
            <i className="fas fa-shopping-cart"></i>
            Shopping Cart
          </h1>
          <span className="cart-count">{items.length} {items.length === 1 ? 'item' : 'items'}</span>
        </div>

        <div className="cart-content">
          <div className="cart-items-section">
            <div className="items-header">
              <h3>Your Services</h3>
              <button className="btn-clear-cart" onClick={clearCart}>
                <i className="fas fa-trash"></i>
                Clear Cart
              </button>
            </div>

            <div className="cart-items">
              {items.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="item-details">
                    <div className="item-icon">{item.icon}</div>
                    <div className="item-info">
                      <h4>{item.title}</h4>
                      <p>{item.description}</p>
                      {item.badge && (
                        <span className="item-badge">{item.badge}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="item-pricing">
                    <div className="price-info">
                      <span className="current-price">₹{item.price.toLocaleString()}</span>
                      {item.originalPrice > item.price && (
                        <span className="original-price">₹{item.originalPrice.toLocaleString()}</span>
                      )}
                    </div>
                    <button 
                      className="btn-remove-item"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="cart-summary">
            <div className="summary-header">
              <h3>Order Summary</h3>
            </div>

            <div className="summary-details">
              <div className="summary-row">
                <span>Subtotal ({items.length} {items.length === 1 ? 'item' : 'items'}):</span>
                <span>₹{getCartTotal().toLocaleString()}</span>
              </div>
              
              {getCartSavings() > 0 && (
                <div className="summary-row savings">
                  <span>You Save:</span>
                  <span>₹{getCartSavings().toLocaleString()}</span>
                </div>
              )}
              
              <div className="summary-row total">
                <span>Total:</span>
                <span>₹{getCartTotal().toLocaleString()}</span>
              </div>
            </div>

            <div className="payment-section">
              <h4>Payment Method</h4>
              <div className="payment-options">
                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span className="radio-custom"></span>
                  <i className="fas fa-credit-card"></i>
                  Credit/Debit Card
                </label>
                
                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span className="radio-custom"></span>
                  <i className="fas fa-mobile-alt"></i>
                  UPI
                </label>
                
                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="netbanking"
                    checked={paymentMethod === 'netbanking'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span className="radio-custom"></span>
                  <i className="fas fa-university"></i>
                  Net Banking
                </label>
              </div>
            </div>

            <div className="checkout-actions">
              <button 
                className="btn-continue-shopping secondary"
                onClick={handleContinueShopping}
              >
                <i className="fas fa-arrow-left"></i>
                Continue Shopping
              </button>
              
              <button 
                className="btn-checkout"
                onClick={handleCheckout}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Processing...
                  </>
                ) : (
                  <>
                    <i className="fas fa-credit-card"></i>
                    Proceed to Payment
                  </>
                )}
              </button>
            </div>

            <div className="security-info">
              <div className="security-badges">
                <span className="security-badge">
                  <i className="fas fa-lock"></i>
                  Secure Payment
                </span>
                <span className="security-badge">
                  <i className="fas fa-shield-alt"></i>
                  SSL Encrypted
                </span>
                <span className="security-badge">
                  <i className="fas fa-undo"></i>
                  Money Back Guarantee
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart; 