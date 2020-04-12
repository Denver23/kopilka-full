const {Schema, model} = require('mongoose');

const schema = new Schema({
    name: {type: String, required: true},
    surname: {type: String, required: true},
    login: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    subscribeToNews: {type: Boolean, required: true},
    phone: {type: String, unique: true},
    numberOfPurchases: {type: Number, default: 0}
})

module.exports = model('User', schema)