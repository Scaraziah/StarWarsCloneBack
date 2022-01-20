const { Post, Reply, validatePost, validateReply } = require('../models/user');
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();

router.post('/reply/:id', async (req, res) => {
    try {
        const { error } = validateReply(req.body);
        if (error) return res.status(400).send(error);
        
        const comment = await Post.findById(req.params.id);
        if (!comment) return res.status(400).send(`The comment with id "${req.params.id}" does not exist.`);
        
        const reply = new Reply({
            text: req.body.text
        })
        comment.replies.push(reply);
        
        await comment.save();
        return res.send(comment);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

router.get('/', async (req,res) => {
    try{
        const post = await Post.find();
        return res.send(post);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

router.get('/name/:name', async (req, res) => {
    try {
        const post = await Post.find({name: req.params.name});
        return res.send(post);
    } catch (ex) { 
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

router.get('/editPost/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        return res.send(post);
    } catch (ex) { 
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

router.get('/photoGallery/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        return res.send(post);
    } catch (ex) { 
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

router.post('/', async (req, res) => {
    try {

        const {error} = validatePost(req.body)
        if (error)
        return res.status(400).send(error)

        const post = new Post ({
            name: req.body.name,
            lat: req.body.lat,
            lng: req.body.lng,
            huntType: req.body.huntType,
            prisePic: req.body.prisePic,
            text: req.body.text
        });

        await post.save();
        return res.send(post)
       } catch (ex) {
            return res.status(500).send(`Internal Server Error: ${ex}`);
       }
})

router.put('/:id', async (req, res) => {
    try {
        const { error } = Post(req.body);
        if (error) return res.status(400).send(error);

        const post = await Post.findByIdAndUpdate(
            req.params.id,
            {
                text: req.body.text,
                lat: req.body.lat,
                lng: req.body.lng,
            }
        );

        if (!post)
            return res.send(400).send(`The user with the id: "${req.params.id}" does not exist`);

            await post.save();

            return res.send(post)
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

router.delete('/:id', async (req, res) => {
    try {

        const post = await Post.findByIdAndRemove(req.params.id);

        if (!post)
            return res.status(400).send(`The post with the id: "${req.params.id}" does not exist`);

            return res.send(post);
    } catch(ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

router.put('/likes/:id', async (req, res) => {
    try {
    const post = await Post.findById(req.params.id);
        if (!post)   
        return res.status(400).send(`The post with id "${req.params.id}" does not exist.`);
        
        post.likes++
        
        await post.save();
        return res.send(post);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

router.put('/dislikes/:id', async (req, res) => {
    try {
    const post = await Post.findById(req.params.id);
        if (!post)   
        return res.status(400).send(`The post with id "${req.params.id}" does not exist.`);
        
        post.dislikes++
        
        await post.save();
        return res.send(post);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

router.put('/prisePic/:id', async (req, res) => {
    try {
    const post = await Post.findByIdAndUpdate(req.params.id);
        if (!post)   
        return res.status(400).send(`The post with id "${req.params.id}" does not exist.`);
        
        post.prisePic.push(req.body.url)
        
        await post.save();
        return res.send(post);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

module.exports = router;