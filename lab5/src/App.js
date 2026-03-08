import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import Auth from './components/Auth';
import { Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import PlaceCard from './components/PlaceCard';
import TripList from './components/TripList';
import Budget from './components/Budget';
import AddTripModal from './components/AddTripModal';
import './style.css';
import { db } from './firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, query, where } from 'firebase/firestore';

function App() {
	// Головний стан додатка
	const [myTrips, setMyTrips] = useState([]);
	const [filter, setFilter] = useState('Всі');

	// Авторизація
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	// Локації
	const [locationsData, setLocationsData] = useState([]);
	
	// Стан для модального вікна додавання подорожі
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedPlace, setSelectedPlace] = useState(null);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
			setUser(currentUser);
			setLoading(false); 
		});
		return () => unsubscribe();
	}, []);

	useEffect(() => {
		if (user) {
			const fetchMyTrips = async () => {
				try {
					const response = await fetch(`https://olesjs-github-io.onrender.com/api/trips/${user.uid}`);
					if (response.ok) {
						const tripsArray = await response.json();
						setMyTrips(tripsArray);
					}
				} catch (error) {
					console.error("Помилка завантаження подорожей із сервера:", error);
				}
			};
			fetchMyTrips();
		} else {
			setMyTrips([]);
		}
	}, [user]);

	useEffect(() => {
		document.title = "TravelPlan — Плануй свою подорож";
	}, []);

	const openModal = (place) => {
		setSelectedPlace(place);
		setIsModalOpen(true);
	};

	const handleConfirmAdd = async (newTripData) => {
		if (!user) return;
		
		const tripToSave = {
			...newTripData,
			expenses: [],
			userId: user.uid
		};
	
		try {
			const response = await fetch('https://olesjs-github-io.onrender.com/api/trips', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(tripToSave)
			});
	
			if (response.ok) {
				const data = await response.json();
				setMyTrips([{ ...tripToSave, instanceId: data.id }, ...myTrips]);
				setIsModalOpen(false);
				setSelectedPlace(null);
			}
		} catch (error) {
			console.error("Помилка при додаванні подорожі через сервер:", error);
		}
	};

	const addExpenseToTrip = async (tripId, expense) => {
		try {
			const tripToUpdate = myTrips.find(t => t.instanceId === tripId);
			if (!tripToUpdate) return;

			const updatedExpenses = [...(tripToUpdate.expenses || []), expense];

			const tripRef = doc(db, "trips", tripId);
			await updateDoc(tripRef, { expenses: updatedExpenses });

			setMyTrips(prevTrips => prevTrips.map(trip => {
				if (trip.instanceId === tripId) {
					return { ...trip, expenses: updatedExpenses };
				}
				return trip;
			}));
		} catch (error) {
			console.error("Помилка при додаванні витрати:", error);
		}
	};

	const updateTrip = async (tripId, updatedData) => {
		try {
			const tripRef = doc(db, "trips", tripId);

			await updateDoc(tripRef, updatedData);

			setMyTrips(prev => prev.map(trip => 
				trip.instanceId === tripId ? { ...trip, ...updatedData } : trip
			));
		} catch (error) {
			console.error("Помилка при оновленні:", error);
		}
	};

	const deleteTrip = async (tripId) => {
		if (window.confirm("Ви впевнені, що хочете видалити цю подорож?")) {
			try {
				const response = await fetch(`https://olesjs-github-io.onrender.com/api/trips/${tripId}`, {
					method: 'DELETE',
				});
	
				if (response.ok) {
					setMyTrips(myTrips.filter(trip => trip.instanceId !== tripId));
				} else {
					console.error("Сервер повернув помилку при видаленні");
				}
			} catch (error) {
				console.error("Помилка при видаленні через сервер:", error);
			}
		}
	};

	const deleteExpense = async (tripId, expenseId) => {
		try {
			const tripToUpdate = myTrips.find(t => t.instanceId === tripId);
			if (!tripToUpdate) return;

			const updatedExpenses = tripToUpdate.expenses.filter(e => e.id !== expenseId);

			const tripRef = doc(db, "trips", tripId);
			await updateDoc(tripRef, { expenses: updatedExpenses });

			setMyTrips(prevTrips => prevTrips.map(trip => {
				if (trip.instanceId === tripId) {
					return { ...trip, expenses: updatedExpenses };
				}
				return trip;
			}));
		} catch (error) {
			console.error("Помилка при видаленні витрати:", error);
		}
	};

	const filteredLocations = locationsData.filter(loc => 
		filter === 'Всі' || loc.type === filter
	);

	// Завантаження напрямків з бази даних (places)
	useEffect(() => {
		const fetchPlaces = async () => {
			try {
				const querySnapshot = await getDocs(collection(db, "places"));
				const placesArray = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
				setLocationsData(placesArray);
			} catch (error) {
				console.error("Помилка завантаження місць:", error);
			}
		};
		fetchPlaces();
	}, []);

	if (loading) return <div style={{textAlign: 'center', marginTop: '50px'}}>Завантаження...</div>;

	return (
		<Router basename="/">
		<div className="app-container">
			<Header user={user} /> {/* Передаємо користувача в Header */}
			
			<main className="content-wrap">
			<Routes>
				{/* Головна сторінка доступна всім */}
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

				{/* Сторінка авторизації */}
				<Route path="/auth" element={
				  !user ? <Auth /> : <Navigate to="/trips" />
				} />

				{/* ЗАХИЩЕНІ МАРШРУТИ */}
				<Route path="/trips" element={
				  user ? (
					<TripList 
						trips={myTrips} 
						onAddExpense={addExpenseToTrip} 
						onDeleteTrip={deleteTrip}
						onUpdateTrip={updateTrip}
						onDeleteExpense={deleteExpense}
					/>
				  ) : <Navigate to="/auth" />
				} />

				<Route path="/budget" element={
				  user ? <Budget trips={myTrips} /> : <Navigate to="/auth" />
				} />
			</Routes>
			</main>

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