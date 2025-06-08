const mongoose = require('mongoose');
const TaskList = require('../models/list');
const Task = require('../models/task');

exports.createTaskList = async (req, res) => {
    try {
        const { title } = req.body;
        if (!title) {
            return res.status(400).json({ message: 'List title is required' });
        }

        const taskList = new TaskList({
            title
        });

        await taskList.save();
        console.log('Task list created:', taskList);
        res.status(201).json(taskList);
    } catch (error) {
        console.error('Create task list error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all task lists
exports.getTaskLists = async (req, res) => {
    try {
        const taskLists = await TaskList.find();
        console.log('Task lists retrieved:', taskLists);

        const listsWithTasks = await Promise.all(taskLists.map(async (list) => {
            const tasks = await Task.find({ listId: list._id, completed: false });
            return { ...list._doc, tasks };
        }));

        res.json(listsWithTasks);
    } catch (error) {
        console.error('Get task lists error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};