const express = require('express');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const serviceAccount = require('./serviceAccountKey.json');

// Firebase initialization
initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();
const app = express();
app.use(express.json());

// Pass Firestore db instance to routes
const schoolsRouter = require('./routes/schools')(db);
app.use('/api/schools', schoolsRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Attendify backend running on port ${PORT}`);
});
