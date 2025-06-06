const express = require('express');

module.exports = (db) => {
  const router = express.Router();

  // Validate lecture slot object with nullable homeroom and subject
  function validateLectureSlot(slot) {
    if (
      typeof slot.slot !== 'number' ||
      typeof slot.time !== 'string'
    ) {
      return false;
    }
    // homeroom and subject can be null or valid references
    if (
      slot.homeroom !== null &&
      (typeof slot.homeroom !== 'string' || !slot.homeroom.startsWith('/homerooms/'))
    ) {
      return false;
    }
    if (
      slot.subject !== null &&
      (typeof slot.subject !== 'string' || !slot.subject.startsWith('/subjects/'))
    ) {
      return false;
    }
    return true;
  }

  // Validate lectures map
  function validateLectures(lectures) {
    if (typeof lectures !== 'object' || lectures === null) return false;
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    for (const day of days) {
      if (!Array.isArray(lectures[day])) {
        return false;
      }
      for (const slot of lectures[day]) {
        if (!validateLectureSlot(slot)) {
          return false;
        }
      }
    }
    return true;
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
          doc.id = db.collection('teacherLectures').doc().id;
        }

        // Validate required fields
        if (
          typeof doc.teacher !== 'string' ||
          typeof doc.campus !== 'string' ||
          !validateLectures(doc.lectures) ||
          !doc.teacher.startsWith('/teachers/') ||
          !doc.campus.startsWith('/campuses/')
        ) {
          throw new Error('Each document must have teacher (ref), campus (ref), and valid lectures map');
        }

        // Convert references to Firestore DocumentReference
        const teacherRef = db.doc(doc.teacher);
        const campusRef = db.doc(doc.campus);

        // Convert lectures slots references, allow nulls
        const lecturesMap = {};
        for (const [day, slots] of Object.entries(doc.lectures)) {
          lecturesMap[day] = slots.map(slot => ({
            slot: slot.slot,
            time: slot.time,
            homeroom: slot.homeroom ? db.doc(slot.homeroom) : null,
            subject: slot.subject ? db.doc(slot.subject) : null
          }));
        }

        const ref = db.collection('teacherLectures').doc(doc.id);
        batch.set(ref, {
          teacher: teacherRef,
          campus: campusRef,
          lectures: lecturesMap
        }, { merge: true });
      }

      await batch.commit();
      res.json({ message: 'Teacher lectures added/updated successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  return router;
};
