

const mongoose = require('mongoose')
const Task = require('../models/task')
const TaskList = require('../models/list')

// Create a new task in a specific list
exports.createTask = async (req, res) => {
    try {
        const { listId, title } = req.body;
        if (!listId || !title) {
            return res.status(400).json({ message: 'List ID and task title are required' });
        }

        const list = await TaskList.findById(listId);
        if (!list) {
            return res.status(404).json({ message: 'Task list not found' });
        }

        const task = new Task({
            listId,
            title
        });

        await task.save();
        console.log('Task created:', task);
        res.status(201).json(task);
    } catch (error) {
        console.error('Create task error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Move a task to another list
exports.moveTask = async (req, res) => {
    try {
        const { taskId, newListId } = req.body;
        if (!taskId || !newListId) {
            return res.status(400).json({ message: 'Task ID and new list ID are required' });
        }

        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const newList = await TaskList.findById(newListId);
        if (!newList) {
            return res.status(404).json({ message: 'New task list not found' });
        }

        task.listId = newListId;
        await task.save();
        console.log('Task moved:', task);
        res.json(task);
    } catch (error) {
        console.error('Move task error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Mark a task as completed
exports.markTaskCompleted = async (req, res) => {
    try {
        const { taskId } = req.body;
        if (!taskId) {
            return res.status(400).json({ message: 'Task ID is required' });
        }

        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        task.completed = true;
        await task.save();
        console.log('Task marked as completed:', task);
        res.json({ message: 'Task marked as completed' });
    } catch (error) {
        console.error('Mark task completed error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};