const express = require('express');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const serviceAccount = require('./serviceAccountKey.json');
const bodyParser = require('body-parser');

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();
const app = express();

// Debug log request size
app.use((req, res, next) => {
  console.log('Content-Length:', req.headers['content-length']);
  next();
});

// Use body-parser with large limits
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Import and use the routers for each collection

// Add or update multiple school documents
const schoolsRouter = require('./routes/schools')(db);
app.use('/api/schools', schoolsRouter);

// Add or update multiple campus documents
const campusesRouter = require('./routes/campuses')(db);
app.use('/api/campuses', campusesRouter);

// Add or update multiple educational level documents
const educationalLevelsRouter = require('./routes/educationalLevels')(db);
app.use('/api/educational-levels', educationalLevelsRouter);

// Add or update multiple grade documents
const gradesRouter = require('./routes/grades')(db);
app.use('/api/grades', gradesRouter);

// Add or update multiple student documents
const studentsRouter = require('./routes/students')(db);
app.use('/api/students', studentsRouter);

// Add or update multiple subject documents
const subjectsRouter = require('./routes/subjects')(db);
app.use('/api/subjects', subjectsRouter);

// Add or update multiple homeroom documents
const homeroomsRouter = require('./routes/homerooms')(db);
app.use('/api/homerooms', homeroomsRouter);

// Add or update multiple teacher documents
const teachersRouter = require('./routes/teachers')(db);
app.use('/api/teachers', teachersRouter);

// Add or update multiple teacher lecture documents
const teacherLecturesRouter = require('./routes/teacherLectures')(db);
app.use('/api/teacher-lectures', teacherLecturesRouter);

// Port configuration
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Attendify backend running on port ${PORT}`);
});
