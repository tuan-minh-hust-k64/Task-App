const express = require('express');
const User = require('../model/User');
const router = new express.Router();
const Auth = require('../middleware/Auth');
const sharp = require('sharp');
const multer = require('multer');
const upload = multer({
    limits: {
        fileSize: 1000000,
        
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload file .jpg, .png or .jpeg!'));
        }
        cb(undefined,true);
    }
});

router.get('/user/me', Auth, async (req, res) => {
    res.send(req.user);
})

router.get('/user', async (req, res) => {
    
    try {
        const user = await User.find();
        res.send(user);
    }catch (e) {
        res.status(500).send(error);
    }
})

router.get('/user/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if(!user || !user.avatar){
            throw new Error('Not found user or user have not avatar');
        }
        res.set('Content-Type', 'image/jpg');
        res.send(user.avatar);
    }catch(e) {
        res.status(500).send();
    }
})

router.get('/user/:id',  async (req, res) => {
    const _id = req.params.id;

    try {
        const user = await User.findById(_id);
        if(!user){
            return res.status(404).send();
        }
        res.send(user);
    } catch (e) {
        res.status(500).send();
    }
})

router.post('/user/me/avatar', Auth, upload.single('Avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({width: 250, height:250}).png().toBuffer()
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
},(error, req, res, next) => {
        res.status(400).send({error: error.message});
})

router.post('/user/login', async (req, res) => {
    try {
        const user = await User.findUserAndLogin(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({user, token});
    }catch (e) {
        res.status(400).send();
    }

})

router.post('/user/logoutall', Auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();
    }catch (e) {
        res.status(500).send();
    }
})

router.post('/user/logout', Auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => {
            return token.token !== req.token;
        });
        await req.user.save();
        res.send();
    }catch (e) {
        res.status(500).send();
    }
})

router.post('/user',async (req, res) => {
    const user = new User(req.body);
    try {
        const token = await user.generateAuthToken();
        res.status(201).send({user, token});
    }catch (e) {
        res.status(400).send(err);
    }
})

router.patch('/user/me', Auth, async (req, res) => {
    const updateUser = Object.keys(req.body);
    try {
        updateUser.forEach((update) => {
            req.user[update] = req.body[update];
        })
        await req.user.save();
        res.send(req.user);
    }catch (e) {
        res.status(400).send(e);
    }
})

router.delete('/user/me/avatar', Auth, async (req, res) => {
        req.user.avatar = undefined;
        await req.user.save();
        res.send();
})

router.delete('/user/me', Auth, async (req, res) => {
    try {
        await req.user.remove();
        res.send();
    }catch (e) {
        res.status(500).send(e);
    }
})

module.exports = router;