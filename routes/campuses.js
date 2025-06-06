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
          doc.id = db.collection('campuses').doc().id; // generate ID if missing
        }

        // Validate required fields
        if (
          typeof doc.name !== 'string' ||
          typeof doc.description !== 'string' ||
          !Array.isArray(doc.homerooms) ||
          typeof doc.zone !== 'string' ||
          !['urban', 'rural'].includes(doc.zone)
        ) {
          throw new Error('Each document must have name (string), description (string), homerooms (array), and zone ("urban" or "rural")');
        }

        // Validate homerooms references
        if (!doc.homerooms.every(path => typeof path === 'string' && path.startsWith('/homerooms/'))) {
          throw new Error('All homerooms must be string references starting with /homerooms/');
        }

        // Convert homerooms string paths to DocumentReference objects
        const homeroomRefs = doc.homerooms.map(path => db.doc(path));

        const ref = db.collection('campuses').doc(doc.id);
        batch.set(ref, {
          name: doc.name,
          description: doc.description,
          zone: doc.zone,
          homerooms: homeroomRefs
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
