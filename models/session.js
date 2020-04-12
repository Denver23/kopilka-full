const {Schema, model} = require('mongoose');
const config = require('config');

const schema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    tokens: [
        {
            refreshToken: {type: String, unique: true},
            expiredAt: {type: Number, default: Date.now() + config.get('refreshTokenExpiresIn') * 3600},
        }
    ]
})

module.exports = model('Session', schema)