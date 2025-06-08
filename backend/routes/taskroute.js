const express = require('express');
const router = express.Router();
const taskcontroller = require('../controller/taskcontroller');

router.post('/task/create', taskcontroller.createTask);
router.put('/task/move', taskcontroller.moveTask);
router.put('/task/complete', taskcontroller.markTaskCompleted);

module.exports = router;