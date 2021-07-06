const express = require('express');
const Task = require('../model/Task');
const router = new express.Router();
const Auth = require('../middleware/Auth');

router.get('/task/:id', Auth, async (req, res) => {
    const _id = req.params.id;
    try {
        const task = await Task.find({_id, owner: req.user._id});
        if(!task){
            res.status(404).send();
        }
        res.send(task);
    }catch (e) {
        res.status(500).send(err);
    }
})

router.get('/task',Auth ,async (req, res) => {
    const match = {};
    const sort = {};
    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':');
        sort[parts[0]] = parts[1] === 'desc' ? -1: 1;
    }
    if(req.query.completed){
        match.completed = req.query.completed === 'true';
    }

    try {
        await req.user.populate({
            path: 'tasks',
            match,
            options:{
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort,
            }
        }).execPopulate();
        res.send(req.user.tasks);
    }catch (e) {
        res.status(500).send(err);
    }
})



router.post('/task', Auth, async (req, res) => {
    
    try {
        const task = new Task({
            ...req.body,
            owner: req.user._id,
        });
        await task.save();
        res.send(task);
    }catch (e) {
        res.status(400).send(err);
    }
})

router.patch('/task/:id', Auth, async (req, res) => {
    const updateTask = Object.keys(req.body);
    const _id = req.params.id;
    try {
        const task = await Task.findOne({_id, owner: req.user._id});
        if(!task){
            res.status(404).send();
        }
        updateTask.forEach((update) => {
            task[update] = req.body[update];
        });
        await task.save();
        res.send(task);
    }catch (e) {
        res.status(500).send();
    }
})

router.delete('/task/:id', Auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id});
        if(!task){
            res.status(404).send();
        }
        res.send(task);
    }catch (e) {
        res.status(500).send();
    }
})

module.exports = router;