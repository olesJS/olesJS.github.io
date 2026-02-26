const locations = [
    {
        name: "Амальфійське узбережжя",
        country: "Італія",
        img: "img/italy.jpg",
        desc: "Неймовірні краєвиди, скелі та італійська кухня.",
        price: 800,
        rating: 4
    },
    {
        name: "Кіото",
        country: "Японія",
        img: "img/kyoto.jpg",
        desc: "Стародавнє місто з тисячами храмів та традиційними чайними будиночками.",
        price: 1200,
        rating: 5
    },
    {
        name: "Санторіні",
        country: "Греція",
        img: "img/greece.jpg",
        desc: "Білосніжні будинки на фоні моря та незабутні заходи сонця.",
        price: 600,
        rating: 5
    },
    {
        name: "Балі",
        country: "Індонезія",
        img: "img/bali.jpg",
        desc: "Тропічний рай з густими джунглями та рисовими терасами.",
        price: 950,
        rating: 4
    },
    {
        name: "Нью-Йорк",
        country: "США",
        img: "img/new_york.jpg",
        desc: "Мегаполіс, що ніколи не спить. Таймс-сквер, Центральний парк та хмарочоси.",
        price: 1100,
        rating: 4
    },
    {
        name: "Рейк'явік",
        country: "Ісландія",
        img: "img/iceland.jpg",
        desc: "Країна льоду та вогню. Побачте північне сяйво та величні водоспади своїми очима.",
        price: 1300,
        rating: 5
    },
    {
        name: "Лондон",
        country: "Англія",
        img: "img/london.jpg",
        desc: "Класика та сучасність. Відвідайте Біг-Бен, Тауерський міст та насолодіться традиційним англійським чаєм.",
        price: 850,
        rating: 4
    }
];

function addToMyTrips(name, country, img) {
    const tripsGrid = document.querySelector('.trips-grid');
    if (!tripsGrid) return;

    const date = new Date();
    date.setDate(date.getDate() + 14);
    const dateString = date.toLocaleDateString('uk-UA');

    const newTripHTML = `
        <article class="trip-card">
            <div class="trip-image">
                <img src="${img}" alt="${name}">
                <span class="status-badge planned">Заплановано</span>
            </div>
            <div class="trip-content">
                <h3>${name}, ${country}</h3>
                <p class="trip-date">${dateString} - ...</p>
                <p class="trip-desc">Нова подорож додана зі списку рекомендованих місць!</p>
            </div>
        </article>
    `;

    tripsGrid.insertAdjacentHTML('afterbegin', newTripHTML);
    alert(`"${name}" додано до ваших подорожей!`);
    document.getElementById('trips').scrollIntoView({ behavior: 'smooth' });
}

function generateStars(count) {
    const goldStar = "★";
    const grayStar = "☆";
    const maxStars = 5;
    return goldStar.repeat(count) + grayStar.repeat(maxStars - count);
}

function initApp() {
    const container = document.getElementById('dynamic-places');
    if (!container) return;

    let i = 0;
    if (locations.length > 0) {
        do {
            const place = locations[i];
            const starsHTML = generateStars(place.rating);

            const cardHTML = `
                <article class="place-card" data-rating="${place.rating}">
                    <div class="place-img-container">
                        <img src="${place.img}" alt="${place.name}">
                    </div>
                    <div class="place-content">
                        <h3>${place.name}, ${place.country}</h3>
                        <p class="description">${place.desc}</p>
                        <div class="place-footer">
                            <div class="place-price">
                                <span class="price">від ${place.price}€</span>
                                <span class="rating">${starsHTML}</span>
                            </div>
                            <button class="select-btn" onclick="addToMyTrips('${place.name}', '${place.country}', '${place.img}')">
                                Додати до моїх подорожей
                            </button>
                        </div>
                    </div>
                </article>
            `;
            container.innerHTML += cardHTML;
            i++;
        } while (i < locations.length);
    }

    const allCards = document.querySelectorAll('.place-card');

    for (let j = 0; j < allCards.length; j++) {
        const rating = parseInt(allCards[j].getAttribute('data-rating'));

        if (rating === 5) {
            allCards[j].style.border = "2px solid #ff6347";
            allCards[j].style.boxShadow = "0 8px 25px rgba(255, 99, 71, 0.2)";
            
            const title = allCards[j].querySelector('h3');
            title.innerHTML += ' <span style="color: #ff6347; font-size: 0.8rem;">[PREMIUM]</span>';
            
            allCards[j].querySelector('.price').style.color = "#ff6347";
        } else {
            allCards[j].style.opacity = "0.9";
        }
    }
}

document.addEventListener('DOMContentLoaded', initApp);


let expenses = [
    { name: "Авіапереліт Львів-Рим", category: "Транспорт", amount: 4500, currency: "UAH" },
    { name: "Таксі з аеропорту", category: "Транспорт", amount: 10, currency: "EUR" }
];

function updateBudgetTable() {
    const tbody = document.querySelector('.budget-table tbody');
    const totalDisplay = document.getElementById('total-amount');
    
    if (!tbody || !totalDisplay) return;

    tbody.innerHTML = ''; 
    let totalInUah = 0;

    expenses.forEach((item, index) => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.category}</td>
            <td>${item.amount}</td>
            <td>${item.currency}</td>
            <td>
                <button class="delete-btn" onclick="deleteExpense(${index})" title="Видалити">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                </button>
            </td>
        `;
        tbody.appendChild(row);

        let amount = parseFloat(item.amount);
        if (item.currency === "EUR") {
            totalInUah += amount * 50;
        } else if (item.currency === "USD") {
            totalInUah += amount * 47;
        } else {
            totalInUah += amount;
        }
    });

    totalDisplay.innerText = totalInUah.toFixed(2);
}

function deleteExpense(index) {
    expenses.splice(index, 1);
    updateBudgetTable();
}

function handleAddExpense() {
    const nameInput = document.getElementById('expense-name');
    const amountInput = document.getElementById('expense-amount');
    const categorySelect = document.getElementById('expense-category');
    const currencySelect = document.getElementById('expense-currency');
    const frequencySelect = document.getElementById('expense-frequency');
    const totalDurationInput = document.getElementById('total-duration');

    if (nameInput.value.trim() === '' || amountInput.value === '') {
        alert('Заповніть назву та суму!');
        return;
    }

    let amount = parseFloat(amountInput.value);
    const frequency = frequencySelect.value;
    const totalDays = parseInt(totalDurationInput.value);
    let displayName = nameInput.value;

    if (frequency === "daily") {
        amount = amount * totalDays;
        displayName += ` (${totalDays} дн.)`;
    }

    const newExpense = {
        name: displayName,
        category: categorySelect.options[categorySelect.selectedIndex].text,
        amount: amount,
        currency: currencySelect.value
    };

    expenses.push(newExpense);
    updateBudgetTable();

    nameInput.value = '';
    amountInput.value = '';
}

document.addEventListener('DOMContentLoaded', () => {
    const addExpenseBtn = document.querySelector('.add-btn');
    if (addExpenseBtn) {
        addExpenseBtn.addEventListener('click', handleAddExpense);
    }

    updateBudgetTable();
});