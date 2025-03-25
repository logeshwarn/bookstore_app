import { Link, useLocation } from 'react-router-dom';
import { FaBook, FaPlus, FaHome } from 'react-icons/fa';
import { useState } from 'react';

const Navbar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };
  
  return (
    <nav className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <Link to="/" className="sidebar-brand">
          <FaBook className="brand-icon" />
          {!collapsed && <span>BookStore</span>}
        </Link>
      </div>
      
      <div className="sidebar-menu">
        <Link to="/" className={`nav-item ${isActive('/')}`}>
          <FaHome className="nav-icon" />
          {!collapsed && <span>Home</span>}
        </Link>
        <Link to="/books/new" className={`nav-item ${isActive('/books/new')}`}>
          <FaPlus className="nav-icon" />
          {!collapsed && <span>Add Book</span>}
        </Link>
      </div>
    </nav>
  );
};

export default Navbar; 