const express = require('express');

module.exports = (db) => {
  const router = express.Router();

  // Add or update multiple school documents
  router.post('/', async (req, res) => {
    const docs = req.body.documents;

    if (!Array.isArray(docs)) {
      return res.status(400).json({ error: 'documents must be an array' });
    }

    const batch = db.batch();
    docs.forEach(doc => {
      if (!doc.id) {
        doc.id = db.collection('schools').doc().id; // Generate ID if not provided
      }
      const ref = db.collection('schools').doc(doc.id);
      batch.set(ref, {
        name: doc.name,
        logo: doc.logo
      }, { merge: true });
    });

    try {
      await batch.commit();
      res.json({ message: 'Documents added/updated successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};
