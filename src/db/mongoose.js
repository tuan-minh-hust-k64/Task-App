const mongoose = require('mongoose');

async function Connect() {
    try {
        await mongoose.connect(process.env.MONGODB_URL, {
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




