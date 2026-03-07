import React, { useState } from 'react';

const AddTripModal = ({ isOpen, onClose, place, onConfirm }) => {
    // Внутрішні стани форми модалки
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
    const [tripStatus, setTripStatus] = useState('Заплановано');

    if (!isOpen) return null;

    const handleConfirm = () => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Перевірки на коректність
        if (!startDate || !endDate) {
            alert("Будь ласка, вкажіть обидві дати!");
            return;
        }

        if (end < start) {
            alert("Помилка: Дата завершення не може бути раніше за дату початку!");
            return;
        }

        if (tripStatus === 'Заплановано' && start < today) {
            alert("Помилка: Запланована подорож не може починатися в минулому!");
            return;
        }

        if (tripStatus === 'Відвідано' && end > today) {
            alert("Помилка: Ви не можете позначити подорож як 'Відвідану', якщо вона ще не завершилася!");
            return;
        }

        // Надсилаємо дані в App.js
        onConfirm({
            ...place,
            date: `${startDate} — ${endDate}`,
            status: tripStatus
        });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            {/* onClick={e => e.stopPropagation()} зупиняє закриття при кліку всередині форми */}
            <div className="modal-content add-trip-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Параметри подорожі</h3>
                </div>
                
                <div className="add-trip-form">
                    <p style={{marginBottom: '20px', color: '#2c3e50'}}>
                        <strong>{place?.name}</strong>
                    </p>
                    
                    <div className="form-group">
                        <label>Дата початку:</label>
                        <input 
                            type="date" 
                            value={startDate} 
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Дата завершення:</label>
                        <input 
                            type="date" 
                            value={endDate} 
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Статус подорожі:</label>
                        <select 
                            value={tripStatus} 
                            onChange={(e) => setTripStatus(e.target.value)}
                        >
                            <option value="Заплановано">Заплановано</option>
                            <option value="Відвідано">Відвідано</option>
                        </select>
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn-submit" onClick={handleConfirm}>
                            Підтвердити
                        </button>
                        <button type="button" className="btn-cancel" onClick={onClose}>
                            Скасувати
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddTripModal;