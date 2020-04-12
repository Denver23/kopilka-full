const {Router} = require('express');
const router = Router();
const jwt = require('jsonwebtoken');
const config = require("config");
const {check, validationResult} = require('express-validator');
const User = require('../models/User');

// api/profile/id
router.get('/id:userId',
    async (req, res) => {
    try {
        const {authorization} = req.headers;
        const {userId} = req.params;

        const user = await User.findById(userId);

        const decode = await jwt.verify(authorization, config.get('jwtSecret'));

        if(decode.userId = user._id) {
            res.json({resultCode: 0, name: user.name, surname: user.surname, login: user.login, phone: user.phone, email: user.email, numberOfPurchases: user.numberOfPurchases})
        } else {
            res.json({resultCode: 1, message: 'Token is invalid'})
        }
    } catch (e) {
        res.status(500).json({message: 'Server Error'})
    }
})

router.put('/id:userId',
    [
        check('email', 'Uncorrectly email').normalizeEmail().isEmail(),
        check('name', 'Uncorrectly name').exists(),
        check('surname', 'Uncorrectly surname').exists()
    ],
    async (req, res) => {
        try {

            const errors = validationResult(req)

            if(!errors.isEmpty()) {
                return res.json({
                    resultCode: 10,
                    errors: errors.array(),
                    message: 'Uncorrecty data'
                })
            }

            const {authorization} = req.headers;
            const {userId} = req.params;

            const decode = await jwt.verify(authorization, config.get('jwtSecret'));

            if(decode.userId = userId) {
                User.findByIdAndUpdate(userId, {...req.body}, {new: true}, function(err, user){

                    if(err) {
                        console.log(err);
                        res.json({resultCode: 1, message: 'Cant update your profile, DB error'})
                    }
                    res.json({resultCode: 0, name: user.name, surname: user.surname, login: user.login, phone: user.phone, email: user.email})
                });
            } else {
                res.json({resultCode: 1, message: 'Token is invalid'})
            }
        } catch (e) {
            res.status(500).json({message: 'Server Error'})
        }
    })

module.exports = router;