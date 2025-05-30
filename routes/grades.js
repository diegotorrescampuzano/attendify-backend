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
          doc.id = db.collection('grades').doc().id; // generate ID if missing
        }

        // Validate required fields
        if (
          typeof doc.name !== 'string' ||
          typeof doc.description !== 'string' ||
          typeof doc.educationalLevelId !== 'string' ||
          !Array.isArray(doc.homerooms)
        ) {
          throw new Error('Each document must have name (string), description (string), educationalLevelId (string), and homerooms (array)');
        }

        // Convert educationalLevelId string path to DocumentReference
        const educationalLevelRef = db.doc(doc.educationalLevelId);

        // Convert homerooms array of string paths to DocumentReference array
        const homeroomsRefs = doc.homerooms.map(path => db.doc(path));

        const ref = db.collection('grades').doc(doc.id);
        batch.set(ref, {
          name: doc.name,
          description: doc.description,
          educationalLevelId: educationalLevelRef,
          homerooms: homeroomsRefs
        }, { merge: true });
      });

      await batch.commit();
      res.json({ message: 'Grades added/updated successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  return router;
};
