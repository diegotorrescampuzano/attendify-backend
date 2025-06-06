const express = require('express');

module.exports = (db) => {
  const router = express.Router();

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

        // Validate required fields (removed 'subjects')
        const requiredFields = ['campusId', 'educationalLevelId', 'description', 'gradeId', 'name', 'students'];
        for (const field of requiredFields) {
          if (!(field in doc)) {
            throw new Error(`Missing required field: ${field}`);
          }
        }

        if (typeof doc.description !== 'string' || typeof doc.name !== 'string') {
          throw new Error('description and name must be strings');
        }

        if (typeof doc.campusId !== 'string' || !doc.campusId.startsWith('/campuses/')) {
          throw new Error('campusId must be a string reference starting with /campuses/');
        }

        if (typeof doc.educationalLevelId !== 'string' || !doc.educationalLevelId.startsWith('/educationalLevels/')) {
          throw new Error('educationalLevelId must be a string reference starting with /educationalLevels/');
        }

        if (typeof doc.gradeId !== 'string' || !doc.gradeId.startsWith('/grades/')) {
          throw new Error('gradeId must be a string reference starting with /grades/');
        }

        if (!Array.isArray(doc.students) || doc.students.length < 1) {
          throw new Error('students must be an array with at least 1 reference');
        }

        if (!doc.students.every(s => typeof s === 'string' && s.startsWith('/students/'))) {
          throw new Error('All students must be string references starting with /students/');
        }

        // Convert references to Firestore DocumentReference
        const campusRef = db.doc(doc.campusId);
        const educationalLevelRef = db.doc(doc.educationalLevelId);
        const gradeRef = db.doc(doc.gradeId);
        const studentRefs = doc.students.map(s => db.doc(s));

        const ref = db.collection('homerooms').doc(doc.id);
        batch.set(ref, {
          campusId: campusRef,
          educationalLevelId: educationalLevelRef,
          description: doc.description,
          gradeId: gradeRef,
          name: doc.name,
          students: studentRefs
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
