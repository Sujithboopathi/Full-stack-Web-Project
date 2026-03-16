import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './components/Login';
import Menu from './components/Menu';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import Bill from './components/Bill';
import './styles/App.css';

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (savedUser) {
      setUser(savedUser);
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
    navigate('/');
    window.location.reload();
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="App">
      <div className="navbar">
        <div className="brand">
          <img src="/logo.svg" alt="College Food Court" className="logo" />
          <h1>College Food Court</h1>
        </div>
        <div className="user-info">
          <span>👤 {user.name} • {user.department}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Menu user={user} />} />
          <Route path="/cart" element={<Cart user={user} />} />
          <Route path="/checkout" element={<Checkout user={user} />} />
          <Route path="/bill" element={<Bill user={user} />} />
        </Routes>
      </div>
    </div>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;