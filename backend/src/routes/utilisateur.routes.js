const express = require('express');
const router = express.Router();

// Route temporaire pour tester
router.get('/', (req, res) => {
  res.json({ message: 'API Utilisateurs fonctionne!' });
});

module.exports = router;