const {Router} = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require("config");
const {check, validationResult} = require('express-validator');
const User = require('../models/User');
const Session = require('../models/Session')
const {uuid} = require('uuidv4');
const router = Router();

// /api/auth/register
router.post('/register',
    [
        check('email', 'Uncorrectly email').normalizeEmail().isEmail(),
        check('password', 'Uncorrectly password').isLength({min: 6})
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                return res.status(403).json({
                    errors: errors.array(),
                    errorMessage: 'Uncorrecty data'
                })
            }

            const {login, email, password} = req.body;

            const candidate = await User.findOne({$or: [{email}, {login}]})

            if (candidate) {
                return res.status(403).json({errorMessage: 'This login or email already registered.'})
            }

            const accessToken = jwt.sign(
                {userId: user.id},
                config.get('jwtSecret'),
                {expiresIn: config.get('accessTokenExpiresIn')}
            )

            const refreshToken = uuid();

            const refreshTokenMap = {
                refreshToken
            }

            const hashedPassword = await bcrypt.hash(password, 12)
            const user = new User({
                name: req.body.name,
                surname: req.body.surname,
                login,
                email,
                phone: req.body.phone,
                password: hashedPassword,
                subscribeToNews: req.body.subscribeToNews
            })

            await user.save();

            const session = new Session({
                user: user._id,
                tokens: [refreshTokenMap]
            })
            await session.save();

            res.status(201).json({
                resultCode: 0,
                user: {userId: user._id, email: user.email, login: user.login},
                accessToken,
                refreshToken
            })


        } catch (e) {
            res.status(500).json({message: 'Server Error'})
        }
    })

// /api/auth/login
router.post('/login',
    [
        check('email', 'Uncorrectly email').normalizeEmail().isEmail(),
        check('password', 'Uncorrectly passwod').isLength({min: 6})
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                return res.status(401).json({
                    errors: errors.array(),
                    message: 'Uncorrecty data'
                })
            }

            const {email, password} = req.body

            const user = await User.findOne({email})

            if (!user) {
                return res.status(401).json({errorMessage: 'User not found'})
            }

            const isMatch = await bcrypt.compare(password, user.password)

            if (!isMatch) {
                return res.status(401).json({errorMessage: 'Uncorrectly password'})
            }
            let expiresIn = req.body.rememberMe === true ? config.get('refreshTokenExpiresIn') : '3600';

            const accessToken = jwt.sign(
                {userId: user.id},
                config.get('jwtSecret'),
                {expiresIn: config.get('accessTokenExpiresIn')}
            )

            const newRefreshToken = uuid();

            const refreshTokenMap = {
                refreshToken: newRefreshToken,
                expiredAt: Date.now() + expiresIn
            }
            const session = await Session.findOne({user: user._id});

            if(!session) {
                const newSession = new Session({
                    user: user._id,
                    tokens: [refreshTokenMap]
                })

                await newSession.save();
                res.json({resultCode: 0, accessToken, refreshToken: newRefreshToken, userId: user._id, login: user.login})
            }


            let tokensArray = session.tokens.concat(refreshTokenMap);
            await Session.findOneAndUpdate({user: user._id}, {tokens: tokensArray});

            res.json({resultCode: 0, accessToken, refreshToken: newRefreshToken, userId: user._id, login: user.login})

        } catch (e) {
            console.log(e);
            res.status(500).json({errorMessage: 'Server Error'})
        }
    })

// /api/auth/sign-out - delete refreshToken from DB
router.post('/sign-out',
    async (req, res) => {
        try {
            const {userId, refreshToken} = req.body;

            const session = await Session.findOne({tokens: {$elemMatch: {refreshToken}}});

            if (!session) {
                res.sendStatus(200)
            }
            let tokens = session.tokens ? session.tokens : []
            tokens = tokens.filter(token => {
                return token.refreshToken !== refreshToken && token.expiredAt < Date.now();
            })
            await Session.findOneAndUpdate({tokens: {$elemMatch: {refreshToken}}}, {tokens}, {new: true});

            res.sendStatus(200)

        } catch (e) {
            console.log(e);
            res.status(500).json({errorMessage: 'Server Error'})
        }
    })

router.post('/refresh-tokens',
    async (req, res) => {
        try {
            const {refreshToken, userId} = req.body;

            let session = await Session.findOne({user: userId, tokens: {$elemMatch: {refreshToken}}});

            if (!session) {
                return res.json({resultCode: 1, message: 'Session not found'})
            }

            const accessToken = jwt.sign(
                {userId: session.user},
                config.get('jwtSecret'),
                {expiresIn: config.get('accessTokenExpiresIn')}
            )

            const newRefreshToken = uuid();

            const refreshTokenMap = {
                refreshToken: newRefreshToken,
                expiredAt: Date.now() + config.get('refreshTokenExpiresIn') * 3600
            }
            let tokensArray = session.tokens.filter(token => {
                return token.refreshToken !== refreshToken && token.expiredAt < Date.now();
            }).concat(refreshTokenMap);

            await Session.findOneAndUpdate({user: session.user}, {tokens: tokensArray});

            res.json({resultCode: 0, accessToken, refreshToken: newRefreshToken})

        } catch (e) {
            console.log(e);
            res.status(500).json({errorMessage: 'Server Error'})
        }
    })

// /api/auth/me
router.post('/me',
    async (req, res) => {
        try {
            let authorization = req.headers.authorization;

            const {userId} = req.body

            const user = await User.findOne({_id: userId})

            const decode = await jwt.verify(authorization, config.get('jwtSecret'));

            if (decode.userId = user._id) {
                res.json({login: user.login, id: user._id, email: user.email})
            } else {
                res.status(401).json({errorMessage: 'Token is invalid'})
            }

        } catch (e) {
            console.log(e);
            res.status(500).json({errorMessage: 'Server Error'})
        }
    })

module.exports = router;