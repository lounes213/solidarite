const express = require('express');
const router = express.Router();

// Route temporaire pour tester
router.get('/', (req, res) => {
  res.json({ message: 'API Offres fonctionne!' });
});

module.exports = router;