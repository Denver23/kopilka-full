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
            res.json({name: user.name, surname: user.surname, login: user.login, phone: user.phone, email: user.email, numberOfPurchases: user.numberOfPurchases})
        } else {
            res.status(403).json({errorMessage: 'Token is invalid'})
        }
    } catch (e) {
        res.status(500).json({errorMessage: 'Server Error'})
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
                return res.status(403).json({
                    errors: errors.array(),
                    errorMessage: 'Uncorrecty data'
                })
            }

            const {authorization} = req.headers;
            const {userId} = req.params;

            const decode = await jwt.verify(authorization, config.get('jwtSecret'));

            if(decode.userId = userId) {
                User.findByIdAndUpdate(userId, {...req.body}, {new: true}, function(err, user){

                    if(err) {
                        console.log(err);
                        res.status(500).json({errorMessage: 'Cant update your profile, DB error'})
                    }
                    res.json({name: user.name, surname: user.surname, login: user.login, phone: user.phone, email: user.email})
                });
            } else {
                res.status(403).json({errorMessage: 'Token is invalid'})
            }
        } catch (e) {
            res.status(500).json({errorMessage: 'Server Error'})
        }
    })

module.exports = router;