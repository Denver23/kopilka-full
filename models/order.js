const {Schema, model} = require('mongoose')

const schema = new Schema({
    products: [
        {
            productId: {type: Schema.Types.ObjectId, ref: 'Product'},
            sku: {type: String, required: true},
            quantity: {type: Number, required: true}
        }
    ],
    customerName: {type: String, required: true},
    customerPhone: {type: Number, required: true},
    deliveryMethod: {type: String},
    address: {type: String, required: true},
    paymentMethod: {type: String},
    userId: {type: Schema.Types.ObjectId, ref: 'User'}
})

module.exports = model('Order', schema)