const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const serviceAccount = require("./serviceAccountKey.json");

if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();
const app = express();

app.use(cors());
app.use(express.json());

const calculateDuration = (dateString) => {
    if (!dateString || !dateString.includes(' — ')) return 0;
    const [startStr, endStr] = dateString.split(' — ');
    const start = new Date(startStr);
    const end = new Date(endStr);
    
    if (isNaN(start) || isNaN(end)) return 0;
    
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
};

app.get('/api/trips/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const snapshot = await db.collection('trips').where('userId', '==', userId).get();
        
        let trips = [];
        snapshot.forEach(doc => {
            trips.push({ instanceId: doc.id, ...doc.data() });
        });

        // Сортування за тривалістю подорожі (від найменшої до найбільшої) 
        trips.sort((a, b) => {
            return calculateDuration(a.date) - calculateDuration(b.date);
        });

        console.log(`Відправлено ${trips.length} відсортованих подорожей`);
        res.json(trips);
    } catch (error) {
        console.error("ПОМИЛКА GET:", error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/trips', async (req, res) => {
    try {
        const newTrip = req.body;
        const docRef = await db.collection('trips').add(newTrip);
        
        console.log(`Додано нову подорож: ${docRef.id}`);
        res.status(201).json({ id: docRef.id, message: "Подорож успішно додано!" });
    } catch (error) {
        console.error("Помилка збереження подорожі:", error);
        res.status(500).json({ error: "Не вдалося зберегти подорож" });
    }
});

app.delete('/api/trips/:tripId', async (req, res) => {
    try {
        const tripId = req.params.tripId;
        await db.collection('trips').doc(tripId).delete();
        
        console.log(`Видалено подорож: ${tripId}`);
        res.status(200).json({ message: "Подорож успішно видалено!" });
    } catch (error) {
        console.error("Помилка видалення подорожі:", error);
        res.status(500).json({ error: "Не вдалося видалити подорож" });
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`); 
});