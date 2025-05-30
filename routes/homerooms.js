const express = require('express');

module.exports = (db) => {
  const router = express.Router();

  // Validate day schedule is an array of exactly 6 subject references (strings starting with /subjects/)
  function validateDaySchedule(dayArray) {
    if (!Array.isArray(dayArray)) return false;
    if (dayArray.length !== 6) return false;
    return dayArray.every(subj => typeof subj === 'string' && subj.startsWith('/subjects/'));
  }

  router.post('/', async (req, res) => {
    const docs = req.body.documents;

    if (!Array.isArray(docs)) {
      return res.status(400).json({ error: 'documents must be an array' });
    }

    const batch = db.batch();

    try {
      for (const doc of docs) {
        if (!doc.id) {
          doc.id = db.collection('homerooms').doc().id;
        }

        // Validate required fields
        const requiredStrings = ['description', 'gradeId', 'name', 'students'];
        for (const field of requiredStrings) {
          if (!(field in doc)) {
            throw new Error(`Missing required field: ${field}`);
          }
        }

        if (typeof doc.description !== 'string' || typeof doc.name !== 'string') {
          throw new Error('description and name must be strings');
        }

        if (typeof doc.gradeId !== 'string' || !doc.gradeId.startsWith('/grades/')) {
          throw new Error('gradeId must be a string reference starting with /grades/');
        }

        if (!Array.isArray(doc.students) || doc.students.length < 4) {
          throw new Error('students must be an array with at least 4 references');
        }

        if (!doc.students.every(s => typeof s === 'string' && s.startsWith('/students/'))) {
          throw new Error('All students must be string references starting with /students/');
        }

        // Validate days: monday to friday, each must be an array of 6 subject references
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
        for (const day of days) {
          if (!(day in doc)) {
            throw new Error(`Missing day schedule: ${day}`);
          }
          if (!validateDaySchedule(doc[day])) {
            throw new Error(`Day ${day} must be an array with exactly 6 subject references`);
          }
        }

        // Convert references to Firestore DocumentReference
        const gradeRef = db.doc(doc.gradeId);
        const studentRefs = doc.students.map(s => db.doc(s));

        // Convert day schedules to arrays of DocumentReference
        const daySchedules = {};
        for (const day of days) {
          daySchedules[day] = doc[day].map(subjPath => db.doc(subjPath));
        }

        const ref = db.collection('homerooms').doc(doc.id);
        batch.set(ref, {
          description: doc.description,
          gradeId: gradeRef,
          name: doc.name,
          students: studentRefs,
          ...daySchedules
        }, { merge: true });
      }

      await batch.commit();
      res.json({ message: 'Homerooms added/updated successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  return router;
};
