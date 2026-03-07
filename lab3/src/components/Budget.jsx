import React, { useState } from 'react';

const Budget = ({ trips }) => {
    const [filterCategory, setFilterCategory] = useState('Всі');

    const allExpenses = trips.flatMap(trip => 
        (trip.expenses || []).map(exp => ({
            ...exp,
            tripName: trip.name,
            tripInstanceId: trip.instanceId
        }))
    );

    const filteredExpenses = allExpenses.filter(exp => 
        filterCategory === 'Всі' || exp.category === filterCategory
    );

    const calculateTotal = () => {
        const total = filteredExpenses.reduce((sum, item) => sum + (item.amount || 0), 0);
        return total.toFixed(2);
    };

    return (
        <section id="budget">
            <div className="section-header">
                <h2>Загальна фінансова аналітика</h2>
            </div>

            <div className="budget-container">
                <p style={{ marginBottom: '20px', color: '#666' }}>
                    У цьому розділі автоматично підсумовуються всі витрати, які ви додали до своїх індивідуальних подорожей.
                </p>

                {/* Блок фільтрації */}
                <div className="filter-section" style={{ marginBottom: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '10px' }}>
                    <label></label>
                    <select 
                        value={filterCategory} 
                        onChange={(e) => setFilterCategory(e.target.value)}
                        style={{ marginLeft: '10px', padding: '5px' }}
                    >
                        <option value="Всі">Всі витрати</option>
                        <option value="Транспорт">Транспорт</option>
                        <option value="Проживання">Проживання</option>
                        <option value="Харчування">Харчування</option>
                        <option value="Розваги">Розваги</option>
                    </select>
                </div>

                <div className="table-wrapper">
                    <table className="budget-table">
                        <thead>
                            <tr>
                                <th>Подорож</th>
                                <th>Назва витрати</th>
                                <th>Категорія</th>
                                <th>Сума (UAH)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredExpenses.length > 0 ? (
                                filteredExpenses.map((item, index) => (
                                    <tr key={`${item.tripInstanceId}-${index}`}>
                                        <td><strong>{item.tripName}</strong></td>
                                        <td>{item.name}</td>
                                        <td>
                                            <span className="category-tag" style={{ 
                                                fontSize: '0.8rem', 
                                                padding: '2px 8px', 
                                                background: '#eee', 
                                                borderRadius: '10px' 
                                            }}>
                                                {item.category || 'Загальне'}
                                            </span>
                                        </td>
                                        <td>{item.amount} грн</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: 'center', padding: '30px', color: '#999' }}>
                                        Витрат не знайдено. Додайте витрати безпосередньо у картках "Моїх подорожей".
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Підсумок */}
            <div id="total-budget-container" style={{ 
                marginTop: '30px', 
                padding: '20px', 
                background: '#2c3e50', 
                color: 'white', 
                borderRadius: '12px',
                textAlign: 'right'
            }}>
                <span style={{ fontSize: '1rem', opacity: 0.8 }}>Загальна сума ({filterCategory}):</span>
                <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                    {calculateTotal()} <span style={{ fontSize: '1rem' }}>UAH</span>
                </div>
            </div>
        </section>
    );
};

export default Budget;