import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

// Sample menu data for development/fallback
const sampleMenuItems = [
  { id: 1, name: 'Masala Dosa', price: 80, image: 'https://t3.ftcdn.net/jpg/04/73/77/79/360_F_473777916_8jLRp3i9l4l2y6i6i6i6i6i6i6i6i6i.jpg' },
  { id: 2, name: 'Sambar Idli', price: 60, image: 'https://t3.ftcdn.net/jpg/04/73/77/79/360_F_473777916_8jLRp3i9l4l2y6i6i6i6i6i6i6i6i6.jpg' },
  { id: 3, name: 'Ven Pongal', price: 70, image: 'https://t3.ftcdn.net/jpg/04/73/77/79/360_F_473777916_8jLRp3i9l4l2y6i6i6i6i6i6i6i6i6.jpg' },
  { id: 4, name: 'Chicken Biryani', price: 180, image: 'https://t3.ftcdn.net/jpg/04/73/77/79/360_F_473777916_8jLRp3i9l4l2y6i6i6i6i6i6i6i6i6.jpg' },
  { id: 5, name: 'Filter Coffee', price: 30, image: 'https://t3.ftcdn.net/jpg/04/73/77/79/360_F_473777916_8jLRp3i9l4l2y6i6i6i6i6i6i6i6i6.jpg' },
  { id: 6, name: 'Plain Dosa', price: 60, image: 'https://t3.ftcdn.net/jpg/04/73/77/79/360_F_473777916_8jLRp3i9l4l2y6i6i6i6i6i6i6i6i6.jpg' },
];

function Menu({ user }) {
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/menu')
      .then(res => {
        console.log('Menu items:', res.data);
        // If API returns empty or null, use sample data
        if (res.data && res.data.length > 0) {
          setMenuItems(res.data);
        } else {
          console.log('No menu items from API, using sample data');
          setMenuItems(sampleMenuItems);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching menu:', err);
        // On error, use sample data
        setMenuItems(sampleMenuItems);
        setLoading(false);
      });

    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(savedCart);
  }, []);

  const addToCart = (item) => {
    const newCart = [...cart, item];
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    alert(`${item.name} added to cart!`);
  };

  return (
    <div>
      <div className="menu-header">
        <h2>Our Menu</h2>
        <p>Fresh & Delicious South Indian Food</p>
      </div>
      <div className="menu-grid">
        {loading ? (
          <p>Loading menu...</p>
        ) : menuItems && menuItems.length > 0 ? (
          menuItems.map(item => (
            <div key={item.id} className="menu-item">
              <img src={item.image || 'https://via.placeholder.com/200'} alt={item.name} />
              <h3>{item.name}</h3>
              <p className="price">₹{item.price}</p>
              <button onClick={() => addToCart(item)}>Add to Cart</button>
            </div>
          ))
        ) : (
          <p>No menu items available</p>
        )}
      </div>
      <div style={{ textAlign: 'center', marginTop: '30px' }}>
        <Link to="/cart" style={{
          padding: '12px 30px',
          background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '8px',
          fontWeight: '600',
          display: 'inline-block'
        }}>
          View Cart ({cart.length})
        </Link>
      </div>
    </div>
  );
}

export default Menu;