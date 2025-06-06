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
          doc.id = db.collection('teachers').doc().id; // generate ID if missing
        }

        // Validate required fields
        if (
          typeof doc.name !== 'string' ||
          typeof doc.description !== 'string' ||
          !Array.isArray(doc.assignedCampuses)
        ) {
          throw new Error('Each document must have name (string), description (string), and assignedCampuses (array)');
        }

        // Validate assignedCampuses references
        if (!doc.assignedCampuses.every(path => typeof path === 'string' && path.startsWith('/campuses/'))) {
          throw new Error('All assignedCampuses must be string references starting with /campuses/');
        }

        // Convert assignedCampuses string paths to DocumentReference objects
        const campusRefs = doc.assignedCampuses.map(path => db.doc(path));

        const ref = db.collection('teachers').doc(doc.id);
        batch.set(ref, {
          name: doc.name,
          description: doc.description,
          assignedCampuses: campusRefs
        }, { merge: true });
      });

      await batch.commit();
      res.json({ message: 'Teachers added/updated successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  return router;
};
