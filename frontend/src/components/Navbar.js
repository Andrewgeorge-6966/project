import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <h2>HR Management System</h2>
        </Link>
        <ul className="navbar-menu">
          <li>
            <Link to="/" className={isActive('/')}>
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/employees" className={isActive('/employees')}>
              Employees
            </Link>
          </li>
          <li>
            <Link to="/jobs" className={isActive('/jobs')}>
              Jobs
            </Link>
          </li>
          <li>
            <Link to="/departments" className={isActive('/departments')}>
              Departments
            </Link>
          </li>
          <li>
            <Link to="/performance" className={isActive('/performance')}>
              Performance
            </Link>
          </li>
          <li>
            <Link to="/training" className={isActive('/training')}>
              Training
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

