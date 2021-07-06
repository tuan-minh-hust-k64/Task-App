const jwt = require('jsonwebtoken');
const User = require('../model/User');


const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ','');
        const decoded = jwt.verify(token,process.env.SECRET_KEY_TOKEN);
        const user = await User.findOne({_id: decoded._id, 'tokens.token': token});
        if(!user) {
            throw new Error('Could not find');
        }
        req.user = user;
        req.token = token;
        next();
    }catch (err) {
        res.status(401).send({error: 'please authenticate'});
    }
}
module.exports = auth;