const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Task = require('./Task');

const schema = new mongoose.Schema({
    name:{
        type: 'string',
        trim: true,
        require: true,
        validate(value){
            if(value.length<1){
                throw new Error('Name invalid, try again!');
            }
        }
    },
    age:{
        type: 'number',
        default: 0,
        validate(value){
            if(value<0){
                throw new Error('Age invalid, try again!');
            }
        }
    },
    email:{
        type: 'string',
        require: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email invalid, try again!');
            }
        }
    },
    password:{
        type: 'string',
        require: true,
        trim: true,
        minlength: 7,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('Password invalid, password is not contained "password"');
            }
        }
    },
    avatar:{
        type: Buffer,
    },
    tokens:[{
        token:{
            type: 'string',
            require: true,
        }
    }],
}, {
    timestamps: true,
})

schema.virtual('tasks',{
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
});
schema.methods.toJSON = function () {
    const user = this;
    const userDisplay = user.toObject();
    delete userDisplay.password;
    delete userDisplay.tokens;
    delete userDisplay.avatar;
    return userDisplay;

}

schema.methods.generateAuthToken = async function(){
    const user = this;
    const token = await jwt.sign({ _id: user._id.toString() }, process.env.SECRET_KEY_TOKEN);
    user.tokens = user.tokens.concat({token});
    await user.save();
    return token;
}

schema.statics.findUserAndLogin = async function(email, password){
    const user = await User.findOne({email});
    if(!user){
        throw new Error('Unable to login!');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        throw new Error('Unable to login!');
    }
    return user;
}


schema.pre('remove', async function (next) {
    const user = this;
    await Task.deleteMany({owner: user._id});

    next();
})

schema.pre('save', async function (next) {
    const user = this;
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }
    next();
})

const User = mongoose.model('User',schema);

module.exports = User;