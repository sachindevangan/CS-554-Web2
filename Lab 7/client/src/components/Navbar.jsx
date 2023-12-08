import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; 

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul className="navbar-nav">
        <li className="nav-item">
          <Link to="/" className="nav-link">Home</Link>
        </li>
        <li className="nav-item">
          <Link to="/authors" className="nav-link">Authors</Link>
        </li>
        <li className="nav-item">
          <Link to="/books" className="nav-link">Books</Link>
        </li>
        <li className="nav-item">
          <Link to="/search" className="nav-link">Search</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
