import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header>
      <nav>
        <div className="logo">TravelPlan</div>
        <ul className="nav-links">
          {/* Використовуємо Link для SPA-навігації */}
          <li><Link to="/trips">Мої подорожі</Link></li>
          <li><Link to="/">Місця для відвідування</Link></li>
          <li><Link to="/budget">Бюджет</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;