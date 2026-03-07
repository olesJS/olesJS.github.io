import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import PlaceCard from './components/PlaceCard';
import TripList from './components/TripList';
import Budget from './components/Budget';
import AddTripModal from './components/AddTripModal';
import './style.css';

const locationsData = [
	{
		id: 1,
		name: "Амальфійське узбережжя",
		country: "Італія",
		img: "img/italy.jpg",
		desc: "Неймовірні краєвиди, скелі та італійська кухня.",
		price: 800,
		rating: 4,
		type: "пляжі",
	},
	{
		id: 2,
		name: "Кіото",
		country: "Японія",
		img: "img/kyoto.jpg",
		desc: "Стародавнє місто з тисячами храмів та традиційними чайними будиночками.",
		price: 1200,
		rating: 5,
		type: "міста",
	},
	{
		id: 3,
		name: "Санторіні",
		country: "Греція",
		img: "img/greece.jpg",
		desc: "Білосніжні будинки на фоні моря та незабутні заходи сонця.",
		price: 600,
		rating: 5,
		type: "пляжі",
	},
	{
		id: 4,
		name: "Балі",
		country: "Індонезія",
		img: "img/bali.jpg",
		desc: "Тропічний рай з густими джунглями та рисовими терасами.",
		price: 950,
		rating: 4,
		type: "пляжі",
	},
	{
		id: 5,
		name: "Нью-Йорк",
		country: "США",
		img: "img/new_york.jpg",
		desc: "Мегаполіс, що ніколи не спить. Таймс-сквер, Центральний парк та хмарочоси.",
		price: 1100,
		rating: 4,
		type: "міста",
	},
	{
		id: 6,
		name: "Рейк'явік",
		country: "Ісландія",
		img: "img/iceland.jpg",
		desc: "Країна льоду та вогню. Побачте північне сяйво та величні водоспади своїми очима.",
		price: 1300,
		rating: 5,
		type: "гори",
	},
	{
		id: 7,
		name: "Лондон",
		country: "Англія",
		img: "img/london.jpg",
		desc: "Класика та сучасність. Відвідайте Біг-Бен, Тауерський міст та насолодіться традиційним англійським чаєм.",
		price: 850,
		rating: 4,
		type: "міста",
	}
];

function App() {
	// Головний стан додатка
	const [myTrips, setMyTrips] = useState([]);
	const [filter, setFilter] = useState('Всі');
	
	// Стан для модального вікна додавання подорожі
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedPlace, setSelectedPlace] = useState(null);

	useEffect(() => {
		document.title = "TravelPlan — Плануй свою подорож";
	}, []);

	const openModal = (place) => {
		setSelectedPlace(place);
		setIsModalOpen(true);
	};

	const handleConfirmAdd = (newTripData) => {
		const newTrip = {
		...newTripData,
		instanceId: Date.now(),
		expenses: []
		};
		setMyTrips([newTrip, ...myTrips]);
		setIsModalOpen(false);
		setSelectedPlace(null);
	};

	const addExpenseToTrip = (tripId, expense) => {
		setMyTrips(prevTrips => prevTrips.map(trip => {
		if (trip.instanceId === tripId) {
			return {
			...trip,
			expenses: [...(trip.expenses || []), expense]
			};
		}
		return trip;
		}));
	};

	const updateTrip = (tripId, updatedData) => {
		setMyTrips(prev => prev.map(trip => 
		trip.instanceId === tripId ? { ...trip, ...updatedData } : trip
		));
	};

	const deleteTrip = (tripId) => {
		if (window.confirm("Ви впевнені, що хочете видалити цю подорож?")) {
		setMyTrips(myTrips.filter(trip => trip.instanceId !== tripId));
		}
	};

	const deleteExpense = (tripId, expenseId) => {
		setMyTrips(prev => prev.map(trip => {
		if (trip.instanceId === tripId) {
			return {
			...trip,
			expenses: trip.expenses.filter(e => e.id !== expenseId)
			};
		}
		return trip;
		}));
	};

	const filteredLocations = locationsData.filter(loc => 
		filter === 'Всі' || loc.type === filter
	);

	return (
		<Router>
		<div className="app-container">
			<Header />
			
			<main className="content-wrap">
			<Routes>
				{/* Головна сторінка: Список місць */}
				<Route path="/" element={
				<section id="places">
					<h2>Місця для відвідування</h2>
					<div className="filter-section" style={{ marginBottom: '30px' }}>
					<select onChange={(e) => setFilter(e.target.value)} className="select-filter">
						<option value="Всі">Всі напрямки</option>
						<option value="пляжі">🏖️ Пляжі</option>
						<option value="міста">🏙️ Міста</option>
						<option value="гори">🏔️ Гірські курорти</option>
					</select>
					</div>
					<div className="places-container">
					{filteredLocations.map(loc => (
						<PlaceCard key={loc.id} place={loc} onAdd={openModal} />
					))}
					</div>
				</section>
				} />

				{/* Сторінка "Мої подорожі" */}
				<Route path="/trips" element={
				<TripList 
					trips={myTrips} 
					onAddExpense={addExpenseToTrip} 
					onDeleteTrip={deleteTrip}
					onUpdateTrip={updateTrip}
					onDeleteExpense={deleteExpense}
				/>
				} />

				{/* Сторінка "Загальний Бюджет" */}
				<Route path="/budget" element={<Budget trips={myTrips} />} />
			</Routes>
			</main>

			{/* Компонент модального вікна */}
			<AddTripModal 
			isOpen={isModalOpen} 
			onClose={() => setIsModalOpen(false)} 
			place={selectedPlace} 
			onConfirm={handleConfirmAdd} 
			/>
	
			<Footer />
		</div>
		</Router>
	);
}

export default App;