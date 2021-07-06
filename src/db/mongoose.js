const mongoose = require('mongoose');

async function Connect() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        });
        console.log('Connect succeeded!');
    }catch (error) {
        console.log('Connect failed!');
    }
}

module.exports = {Connect: Connect};




