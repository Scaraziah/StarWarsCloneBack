const { User, validateUser } = require('../models/user');
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const app = express();


router.post('/', async (req, res) => {
    try {
        const { error } = validateUser(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        let newUser = await User.findOne({ email: req.body.email });
        if (newUser) return res.status(400).send('User already registered.');
      
        const salt = await bcrypt.genSalt(10);
        newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: await bcrypt.hash(req.body.password, salt),
        });
        
        await newUser.save();
        
        const token = newUser.generateAuthToken();

        return res
        .header('x-auth-token', token)
        .header('access-control-expose-headers', 'x-auth-token')
        .send({ _id: newUser._id, name: newUser.name, email: newUser.email});

        } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

router.get('/', async (req,res) => {
    try{
        const user = await User.find();
        return res.send(user);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

router.get('/:id', async (req, res) => {
    try{
        const user = await User.findById(req.params.id);
        return res.send(user);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
})

module.exports = router;