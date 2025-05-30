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
          doc.id = db.collection('subjects').doc().id; // generate ID if missing
        }

        if (typeof doc.name !== 'string' || typeof doc.description !== 'string') {
          throw new Error('Each document must have name (string) and description (string)');
        }

        const ref = db.collection('subjects').doc(doc.id);
        batch.set(ref, {
          name: doc.name,
          description: doc.description
        }, { merge: true });
      });

      await batch.commit();
      res.json({ message: 'Subjects added/updated successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  return router;
};
