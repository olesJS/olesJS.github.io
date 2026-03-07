import React, { useState } from 'react';
import { FaEdit, FaTrashAlt, FaMoneyBillWave, FaCalendarAlt, FaTimes, FaPlus, FaFilter } from 'react-icons/fa';

const TripList = ({ trips, onAddExpense, onDeleteTrip, onUpdateTrip, onDeleteExpense }) => {
  const [editingTripId, setEditingTripId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('Всі');
  const currentTrip = trips.find(t => t.instanceId === editingTripId);

  const filteredTrips = trips.filter(trip => 
    statusFilter === 'Всі' || trip.status === statusFilter
  );

  return (
    <section id="trips">
      <div className="section-header">
        <h2>Мої подорожі</h2>
        
        {/* Блок фільтрації */}
        <div className="list-filter-box">
          <FaFilter style={{ color: '#7f8c8d', fontSize: '0.8rem' }} />
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="select-filter-mini"
          >
            <option value="Всі">Всі подорожі</option>
            <option value="Заплановано">Заплановані</option>
            <option value="Відвідано">Відвідані</option>
          </select>
        </div>
      </div>
      
      <div className="trips-grid">
        {filteredTrips.length > 0 ? (
          filteredTrips.map((trip) => (
            <TripCard 
              key={trip.instanceId} 
              trip={trip} 
              onDeleteTrip={onDeleteTrip}
              onOpenEdit={() => setEditingTripId(trip.instanceId)} 
            />
          ))
        ) : (
          <p className="empty-message">
            {statusFilter === 'Всі' 
              ? "Список подорожей порожній." 
              : `Немає подорожей зі статусом "${statusFilter}".`}
          </p>
        )}
      </div>

      {currentTrip && (
        <EditTripModal 
          trip={currentTrip} 
          onClose={() => setEditingTripId(null)} 
          onAddExpense={onAddExpense}
          onUpdateTrip={onUpdateTrip}
          onDeleteExpense={onDeleteExpense}
        />
      )}
    </section>
  );
};

const TripCard = ({ trip, onDeleteTrip, onOpenEdit }) => {
  const totalBudget = (trip.expenses || []).reduce((sum, item) => sum + item.amount, 0);

  return (
    <article className="trip-card">
      <div className="trip-image">
        <img src={trip.img} alt={trip.name} />
        <span className={`status-badge ${trip.status === 'Відвідано' ? 'completed' : 'planned'}`}>
          {trip.status}
        </span>
        <button className="delete-trip-btn" onClick={() => onDeleteTrip(trip.instanceId)}>
          <FaTrashAlt />
        </button>
      </div>
      <div className="trip-content">
        <h3>{trip.name}</h3>
        <p className="trip-date"><FaCalendarAlt /> {trip.date}</p>
        <div className="trip-budget-info">
          <span>Бюджет:</span>
          <strong>{totalBudget.toFixed(2)} ₴</strong>
        </div>
        <button className="open-edit-btn" onClick={onOpenEdit}>
          <FaEdit /> Керувати подорожжю
        </button>
      </div>
    </article>
  );
};

const EditTripModal = ({ trip, onClose, onAddExpense, onUpdateTrip, onDeleteExpense }) => {
  // Розбиваємо дату для редагування
  const dates = (trip.date || "").split(' — ');
  const [startDate, setStartDate] = useState(dates[0] || '');
  const [endDate, setEndDate] = useState(dates[1] || '');
  const [newStatus, setNewStatus] = useState(trip.status);

  const [expName, setExpName] = useState('');
  const [expAmount, setExpAmount] = useState('');
  const [expCategory, setExpCategory] = useState('Транспорт');

  const handleUpdateInfo = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (end < start) return alert("Помилка: Дата завершення не може бути раніше початку!");

    onUpdateTrip(trip.instanceId, { 
      date: `${startDate} — ${endDate}`, 
      status: newStatus 
    });
    alert("Дані подорожі оновлено!");
  };

  const handleAddExp = (e) => {
    e.preventDefault();
    if (!expName || !expAmount) return;
    onAddExpense(trip.instanceId, {
      id: Date.now(),
      name: expName,
      amount: parseFloat(expAmount),
      category: expCategory
    });
    setExpName(''); 
    setExpAmount('');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content wide-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Керування: {trip.name}</h3>
          <button className="close-modal" onClick={onClose}><FaTimes /></button>
        </div>

        <div className="modal-grid">
          {/* Ліва колонка: Параметри подорожі */}
          <div className="modal-col">
            <h4><FaEdit /> Параметри</h4>
            <div className="form-group">
              <label>Дата початку:</label>
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Дата завершення:</label>
              <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Статус:</label>
              <select value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                <option value="Заплановано">Заплановано</option>
                <option value="Відвідано">Відвідано</option>
              </select>
            </div>
            <button className="save-info-btn" onClick={handleUpdateInfo}>Зберегти зміни</button>
          </div>

          {/* Права колонка: Бюджет */}
          <div className="modal-col">
            <h4><FaMoneyBillWave /> Деталізація бюджету</h4>
            <div className="expense-manager">
              <div className="expense-list-scroll">
                {(trip.expenses || []).length > 0 ? (
                  trip.expenses.map(exp => (
                    <div key={exp.id} className="expense-item-row">
                      <div className="exp-details">
                        <span className="exp-title">{exp.name}</span>
                        <small className="exp-cat">{exp.category}</small>
                      </div>
                      <div className="exp-actions">
                        <span className="exp-val">{exp.amount} ₴</span>
                        <button className="del-exp-btn" onClick={() => onDeleteExpense(trip.instanceId, exp.id)}>
                          <FaTimes />
                        </button>
                      </div>
                    </div>
                  ))
                ) : <p style={{ color: '#999', fontSize: '0.9rem' }}>Витрат поки немає.</p>}
              </div>
              
              <form onSubmit={handleAddExp} className="add-expense-inline">
                <input type="text" placeholder="Назва" value={expName} onChange={e => setExpName(e.target.value)} />
                <input type="number" placeholder="Сума" value={expAmount} onChange={e => setExpAmount(e.target.value)} />
                <select value={expCategory} onChange={e => setExpCategory(e.target.value)}>
                  <option value="Транспорт">Транспорт</option>
                  <option value="Харчування">Харчування</option>
                  <option value="Проживання">Проживання</option>
                  <option value="Розваги">Розваги</option>
                </select>
                <button type="submit" title="Додати витрату"><FaPlus /></button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripList;