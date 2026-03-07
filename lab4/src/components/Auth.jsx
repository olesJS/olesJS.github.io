import React, { useState } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true); // Перемикач вхід/реєстрація
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (isLogin) {
                // Вхід існуючого користувача
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                // Реєстрація нового користувача
                await createUserWithEmailAndPassword(auth, email, password);
            }
        } catch (err) {
            setError("Помилка: " + err.message);
        }
    };

    return (
        <div className="auth-container" style={{ padding: '20px', maxWidth: '400px', margin: '40px auto', background: '#f8f9fa', borderRadius: '10px' }}>
            <h2>{isLogin ? 'Вхід у систему' : 'Реєстрація'}</h2>
            
            {error && <p style={{ color: 'red', fontSize: '0.9rem' }}>{error}</p>}
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
                <div className="form-group">
                    <label>Email:</label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                </div>
                <div className="form-group">
                    <label>Пароль:</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                </div>
                <button type="submit" className="btn-submit" style={{ padding: '10px', background: '#2c3e50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                    {isLogin ? 'Увійти' : 'Зареєструватися'}
                </button>
            </form>

            <p 
                style={{ marginTop: '15px', textAlign: 'center', cursor: 'pointer', color: '#3498db', textDecoration: 'underline' }} 
                onClick={() => setIsLogin(!isLogin)}
            >
                {isLogin ? 'Немає акаунта? Зареєструйтесь' : 'Вже є акаунт? Увійдіть'}
            </p>
        </div>
    );
};

export default Auth;