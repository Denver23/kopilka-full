const {Schema, model} = require('mongoose')

const schema = new Schema({
    brand: {type: Schema.Types.ObjectId, ref: 'Brand', required: true},
    category: {type: Schema.Types.ObjectId, ref: 'Category', required: true},
    productTitle: {type: String, required: true, minlength: 2, maxlength: 200},
    customFields: [{}],
    childProducts: [
        {
            sku: {type: String, required: true},
            price: {type: Number, required: true},
            quantity: {type: Number, required: true},
            options: {type: Schema.Types.Mixed},
            customFields: [{}]
        }
    ],
    images: [
            {
                original: {type: String, required: true},
                thumbnail: {type: String, required: true},
                alt: {type: String, required: true},
            }
        ],
    shortDescription: {type: String},
    specifications: {type: String},
    features: {type: String}
})

module.exports = model('Product', schema)