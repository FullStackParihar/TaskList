const express = require('express');
const router = express.Router();

const userController = require('../controller/usercontroller');

router.post('/signup', userController.signup);
router.post('/verifyOtp', userController.verifyOtp);
router.post('/login', userController.login);

module.exports = router;