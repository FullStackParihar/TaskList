const express = require('express');
const router = express.Router();

const listcontroller = require('../controller/listcontroller');

router.post('/list/create', listcontroller.createTaskList);
router.get('/lists', listcontroller.getTaskLists);

module.exports = router;