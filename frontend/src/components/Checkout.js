import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/App.css';

function Checkout({ user }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const total = cart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);

  const [form, setForm] = useState({
    name: user?.name || '',
    department: user?.department || '',
    year: user?.year || '',
    phone: user?.phone || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(s => ({ ...s, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert('Cart is empty.');
      return;
    }
    if (!form.name || !form.department || !form.year || !form.phone) {
      alert('Please fill all details.');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        user: form,
        items: cart,
        total,
        date: new Date().toISOString()
      };

      const res = await axios.post('/api/orders', orderData);
      console.log('Order response:', res.data);
      // Save order info and clear cart
      localStorage.setItem('orderData', JSON.stringify(res.data));
      localStorage.removeItem('cart');
      navigate('/bill');
    } catch (err) {
      console.error('Order error:', err.response?.data || err.message || err);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      <form className="checkout-form" onSubmit={handlePlaceOrder}>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Full name"
          required
        />
        <input
          name="department"
          value={form.department}
          onChange={handleChange}
          placeholder="Department"
          required
        />
        <input
          name="year"
          value={form.year}
          onChange={handleChange}
          placeholder="Year"
          required
        />
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone number"
          required
        />

        <div style={{ marginTop: 8, marginBottom: 12 }}>
          <strong>Items:</strong> {cart.length} • <strong>Total:</strong> ₹{total.toFixed(2)}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Placing order...' : `Place Order - ₹${total.toFixed(2)}`}
        </button>
      </form>
    </div>
  );
}

export default Checkout;