import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

function Login({ onLogin }) {
  const [formData, setFormData] = useState({
    name: '',
    department: '',
    year: '',
    phone: ''
  });
  const navigate = useNavigate();

  const departments = ['AI&DS' , 'CSE' , 'IT', 'ECE', 'Mechanical', 'Civil', 'Electrical' , 'BME' , 'Agri'];
  const years = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.department && formData.year && formData.phone) {
      onLogin(formData);
      navigate('/');
    } else {
      alert('Please fill all fields');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="brand">
          <img src="/logo.svg" alt="College Food Court" className="logo" />
          <h1>College Food Court</h1>
        </div>
        <div className="quality-section">
          <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=200&h=200&fit=crop" alt="Best Quality Food" />
          <h2>BEST QUALITY FOOD</h2>
        </div>
        <p className="tagline">Quick Bites, Fresh Delights</p>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="department">Department</label>
            <select
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
            >
              <option value="">Select Department</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="year">Year</label>
            <select
              id="year"
              name="year"
              value={formData.year}
              onChange={handleChange}
              required
            >
              <option value="">Select Year</option>
              {years.map(yr => (
                <option key={yr} value={yr}>{yr}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
              pattern="[0-9]{10}"
              required
            />
          </div>

          <button type="submit" className="login-btn">Let's Eat!</button>
        </form>
      </div>
    </div>
  );
}

export default Login;