import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Cart({ user }) {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(savedCart);
  }, []);

  const removeFromCart = (index) => {
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="cart-container">
      <h2>🛒 Your Cart</h2>
      {cart.length === 0 ? (
        <div className="cart-empty">
          <p>Your cart is empty. Start ordering!</p>
          <Link to="/" style={{
            marginTop: '15px',
            padding: '10px 20px',
            background: '#ff6b35',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '6px',
            display: 'inline-block'
          }}>Back to Menu</Link>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cart.map((item, index) => (
              <div key={index} className="cart-item">
                <div className="cart-item-info">
                  <h4>{item.name}</h4>
                  <p>ID: {item.id}</p>
                </div>
                <div className="cart-item-price">₹{item.price}</div>
                <button className="cart-item-remove" onClick={() => removeFromCart(index)}>
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="cart-total">Total: ₹{total}</div>
          <div className="cart-actions">
            <Link to="/" className="btn-continue">Continue Shopping</Link>
            <Link to="/checkout" className="btn-checkout">Proceed to Checkout</Link>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;