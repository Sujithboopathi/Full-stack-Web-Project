import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Bill({ user }) {
  const [orderData, setOrderData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const storedRaw = localStorage.getItem('orderData');
      if (!storedRaw) {
        setOrderData(null);
        return;
      }
      const stored = JSON.parse(storedRaw);

      // Normalize different shapes:
      // 1) { order: {...}, user: {...} }
      // 2) { id, user, items, total, created_at } (direct row)
      // 3) [ {...} ] (array returned by some endpoints)
      let normalizedOrder = null;
      let normalizedUser = null;

      if (stored === null) {
        normalizedOrder = null;
      } else if (Array.isArray(stored) && stored.length > 0) {
        normalizedOrder = stored[0];
        normalizedUser = normalizedOrder.user || null;
      } else if (stored.order) {
        normalizedOrder = stored.order;
        normalizedUser = stored.user || null;
      } else if (stored.items || stored.total) {
        normalizedOrder = stored;
        normalizedUser = stored.user || null;
      } else {
        // Unknown shape — keep raw for debugging
        normalizedOrder = stored;
      }

      setOrderData({ order: normalizedOrder, user: normalizedUser });
    } catch (err) {
      console.error('Failed to parse orderData from localStorage:', err);
      setOrderData(null);
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleNewOrder = () => {
    localStorage.removeItem('orderData');
    navigate('/');
  };

  if (!orderData || !orderData.order) {
    return (
      <div className="bill-container">
        <div className="success-message">❌ No order found</div>
      </div>
    );
  }

  const { order, user: userData } = orderData;

  // Compute total safely: prefer explicit total, otherwise sum items (price * quantity)
  const total = (typeof order.total === 'number' && order.total >= 0)
    ? order.total
    : (order.items && Array.isArray(order.items)
      ? order.items.reduce((sum, item) => sum + (Number(item.price || 0) * (Number(item.quantity || 1))), 0)
      : 0);

  return (
    <div className="bill-container">
      <div className="success-message">✅ Order Placed Successfully!</div>

      <div className="bill-header">
        <h1>🧾 Bill Receipt</h1>
        <p style={{ fontSize: '1.2em', fontWeight: 'bold', color: 'var(--primary)', margin: '10px 0' }}>
          <strong>Order ID:</strong> {order.id || 'N/A'}
        </p>
      </div>

      <div className="bill-section">
        <h3>Customer Details</h3>
        <div className="bill-row">
          <span>Name:</span>
          <span>{userData?.name || user?.name || '—'}</span>
        </div>
        <div className="bill-row">
          <span>Department:</span>
          <span>{userData?.department || user?.department || '—'}</span>
        </div>
        <div className="bill-row">
          <span>Year:</span>
          <span>{userData?.year || user?.year || '—'}</span>
        </div>
        <div className="bill-row">
          <span>Phone:</span>
          <span>{userData?.phone || user?.phone || '—'}</span>
        </div>
      </div>

      <div className="bill-section">
        <h3>Order Items</h3>
        {order.items && Array.isArray(order.items) && order.items.length > 0 ? (
          order.items.map((item, index) => (
            <div key={index} className="bill-row">
              <span>{item.name || item.title || 'Item'}</span>
              <span>₹{(Number(item.price || 0) * (Number(item.quantity || 1))).toFixed(2)}</span>
            </div>
          ))
        ) : (
          <div className="bill-row">
            <span>No items found</span>
            <span>₹0.00</span>
          </div>
        )}
      </div>

      <div className="bill-row total">
        <span>Total Amount:</span>
        <span>₹{Number(total).toFixed(2)}</span>
      </div>

      <div className="bill-section">
        <p style={{ textAlign: 'center', color: '#999', fontSize: '0.9em', marginTop: '20px' }}>
          Thank you for ordering! Pick up from Food Court Counter
        </p>
        <p style={{ textAlign: 'center', color: '#999', fontSize: '0.85em' }}>
          {order.created_at ? new Date(order.created_at).toLocaleString() : new Date().toLocaleString()}
        </p>
      </div>

      <div className="bill-actions">
        <button onClick={handlePrint}>🖨️ Print Bill</button>
        <button onClick={handleNewOrder}>🏠 New Order</button>
      </div>
    </div>
  );
}

export default Bill;