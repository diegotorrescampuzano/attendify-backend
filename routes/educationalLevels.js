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
      docs.forEach(doc => {
        if (!doc.id) {
          doc.id = db.collection('educationalLevels').doc().id; // generate ID if missing
        }

        // Validate required fields
        if (
          typeof doc.name !== 'string' ||
          typeof doc.description !== 'string' ||
          typeof doc.campusId !== 'string' ||
          !Array.isArray(doc.grades)
        ) {
          throw new Error('Each document must have name (string), description (string), campusId (string), and grades (array)');
        }

        // Convert campusId string path to DocumentReference
        const campusRef = db.doc(doc.campusId);

        // Convert grades array of string paths to DocumentReference array
        const gradesRefs = doc.grades.map(path => db.doc(path));

        const ref = db.collection('educationalLevels').doc(doc.id);
        batch.set(ref, {
          name: doc.name,
          description: doc.description,
          campusId: campusRef,
          grades: gradesRefs
        }, { merge: true });
      });

      await batch.commit();
      res.json({ message: 'Educational levels added/updated successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  return router;
};
