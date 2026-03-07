import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase'; // імпортуємо наш auth

const Header = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/'); // після виходу перенаправляємо на головну
    } catch (error) {
      console.error("Помилка при виході:", error);
    }
  };

  return (
    <header>
      <nav>
        <div className="logo">TravelPlan</div>
        <ul className="nav-links">
          <li><Link to="/">Місця для відвідування</Link></li>
          
          {/* Показуємо ці посилання тільки якщо користувач залогінений */}
          {user && (
            <>
              <li><Link to="/trips">Мої подорожі</Link></li>
              <li><Link to="/budget">Бюджет</Link></li>
            </>
          )}

          {/* Кнопки входу / виходу */}
          {!user ? (
            <li><Link to="/auth" className="login-link" style={{ fontWeight: 'bold', color: '#f39c12' }}>Увійти</Link></li>
          ) : (
            <li style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span className="user-email" style={{ fontSize: '0.9rem', color: '#ccc' }}>
                {user.email}
              </span>
              <button onClick={handleLogout} style={{ background: 'transparent', color: '#e74c3c', border: '1px solid #e74c3c', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}>
                Вийти
              </button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;