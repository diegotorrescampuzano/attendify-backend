const express = require('express');
const { FieldValue } = require('firebase-admin/firestore');

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
          doc.id = db.collection('campuses').doc().id; // generate ID if missing
        }

        // Validate required fields
        if (typeof doc.name !== 'string' || typeof doc.description !== 'string' || !Array.isArray(doc.educationalLevels)) {
          throw new Error('Each document must have name (string), description (string), and educationalLevels (array)');
        }

        // Convert educationalLevels string paths to DocumentReference objects
        const educationalLevelRefs = doc.educationalLevels.map(path => db.doc(path));

        const ref = db.collection('campuses').doc(doc.id);
        batch.set(ref, {
          name: doc.name,
          description: doc.description,
          educationalLevels: educationalLevelRefs
        }, { merge: true });
      });

      await batch.commit();
      res.json({ message: 'Campuses added/updated successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  return router;
};
