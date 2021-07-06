const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const schema = new mongoose.Schema({
    description: {
        type: 'string',
        require: true,
        trim: true,
    },
    completed: {
        type: 'boolean',
        default: false,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true,
    }
}, {
    timestamps: true,
})

const Task = mongoose.model('Task', schema);
module.exports = Task;