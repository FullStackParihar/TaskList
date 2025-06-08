const mongoose = require('mongoose');

const taskListSchema = new mongoose.Schema({
   
    title: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('TaskList', taskListSchema);