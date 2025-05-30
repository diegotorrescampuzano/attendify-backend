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
          doc.id = db.collection('students').doc().id; // generate ID if missing
        }

        // Validate required fields
        if (
          typeof doc.name !== 'string' ||
          typeof doc.cellphoneContact !== 'string' ||
          typeof doc.homeroom !== 'string'
        ) {
          throw new Error('Each document must have name (string), cellphoneContact (string), and homeroom (string reference path)');
        }

        // Convert homeroom string path to DocumentReference
        const homeroomRef = db.doc(doc.homeroom);

        const ref = db.collection('students').doc(doc.id);
        batch.set(ref, {
          name: doc.name,
          cellphoneContact: doc.cellphoneContact,
          homeroom: homeroomRef
        }, { merge: true });
      });

      await batch.commit();
      res.json({ message: 'Students added/updated successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  return router;
};
