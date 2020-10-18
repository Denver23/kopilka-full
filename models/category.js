const {Schema, model} = require('mongoose')

const schema = new Schema({
    name: {type: String, required: true, unique: true},
    url: {type: String, required: true},
    refines: [
        {
            title: {type: String, required: true},
            type: {type: String, required: true},
            items: [{type: String, required: true}]
        }
    ],
    childCategories: [{type: Schema.Types.ObjectId, ref: 'Category'}],
    bestSellers: [{type: Schema.Types.ObjectId, ref: 'Product'}],
    slides: [{type: String, required: true}],
    hidden: {type: Boolean, required: true, default: false}
})

module.exports = model('Category', schema)