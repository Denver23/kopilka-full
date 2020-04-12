const {Schema, model} = require('mongoose')

const schema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    message: {type: String, required: true, minlength: 5, maxlength: 300}
})

module.exports = model('Review', schema)