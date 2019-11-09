const express = require('express');
<<<<<<< HEAD
const { register, login } = require('../controllers/auth');
=======
const { register } = require('../controllers/auth');
>>>>>>> 18fd76620c46c80f5134ba2ce0a410de08605c14

const router = express.Router();

router.post('/register', register);
<<<<<<< HEAD
router.post('/login', login);
=======
>>>>>>> 18fd76620c46c80f5134ba2ce0a410de08605c14

module.exports = router;