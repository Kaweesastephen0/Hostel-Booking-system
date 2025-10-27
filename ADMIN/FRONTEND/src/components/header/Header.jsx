import React from 'react';
import './Header.css';

/**
 * This is a reusable header component for pages.
 * @param {object} props - The component props.
 * @param {string} props.title - The main title of the page.
 * @param {string} [props.subtitle] - An optional subtitle or description.
 * @param {React.ReactNode} [props.children] - Optional action items like buttons.
 * @param {React.ReactNode} [props.centerContent] - Content for the center zone (e.g., search/filters).
 */
const Header = ({ title, subtitle, centerContent, children }) => {
  return (
    <div className="page-header">
      <div className="header-left">
        <h1 className="header-title">{title}</h1>
        {subtitle && <p className="header-subtitle">{subtitle}</p>}
      </div>
      {centerContent && <div className="header-center">{centerContent}</div>}
      {children && <div className="header-right">{children}</div>}
    </div>
  );
};

export default Header;