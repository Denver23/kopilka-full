const {Router} = require('express');
const Product = require('../models/Product');
const Order = require('../models/Order');
const CheckoutOptions = require('../models/checkout-options');
const jwt = require('jsonwebtoken');
const config = require("config");
const router = Router();

router.get('/add-to-cart',
    async (req, res) => {
    try {
        const {brand, id, sku} = req.query;

        if(brand === undefined || id === undefined || sku === undefined) {
            res.json({resultCode: 1, message: '0 Products Found.'});
            return;
        }

        let product = await Product.findById(id).populate('brand');
        let childProduct;

        if(product.brand.name === brand) {
            childProduct = product.childProducts.filter(item => {
                return item.sku === sku;
            })[0];
        } else {
            res.json({resultCode: 1, message: '0 Products Found.'});
            return;
        }


        if(childProduct.quantity > 0) {
            let result = {
                id: id,
                brand: brand,
                sku: sku,
                price: childProduct.price,
                productTitle: product.productTitle,
                thumbnail: product.images[0].thumbnail,
                options: childProduct.options
            }
            res.json({resultCode: 0, product: result})
        } else {
            res.json({resultCode: 1, message: 'Product is out of Stock.'});
        }

    } catch (e) {
        console.log(e);
        res.status(500).json({message: 'Server Error'})
    }
})

router.post('/initialize-cart',
    async (req, res) => {
        try {
            const {products} = req.body;

            let productsIDs = products.map(item => {
                return item.id;
            })

            let productsDB = await Product.findById(productsIDs);

            if(!productsDB) {
                res.json({resultCode: 0, cartProducts: []})
                return;
            }

            if(!Array.isArray(productsDB)) {
                productsDB = [productsDB];
            }

            let resultProducts = products.filter(product => {
                let productDB = productsDB.filter(item => {
                    return item._id == product.id
                })[0]

                if(productDB !== undefined) {
                    let childProduct = productDB.childProducts.filter(item => {
                        return item.sku === product.sku;
                    })[0];

                    if(childProduct !== undefined && childProduct.quantity > 0) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            }).map(product => {
                let productDB = productsDB.filter(item => {
                    return item._id == product.id
                })[0];
                let childProduct = productDB.childProducts.filter(item => {
                    return item.sku === product.sku;
                })[0];
                return {
                    id: product.id,
                    brand: product.brand,
                    sku: product.sku,
                    price: childProduct.price,
                    productTitle: productDB.productTitle,
                    thumbnail: productDB.images[0].thumbnail,
                    avaibility: childProduct.quantity > 0 ? true : false,
                    options: childProduct.options,
                    quantity: product.quantity
                }
            })

            res.json({resultCode: 0, cartProducts: resultProducts});
        } catch (e) {
            console.log(e);
            res.status(500).json({message: 'Server Error'})
        }
    })

router.get('/checkout-options',
    async (req, res) => {
        try {
            let deliveries = await CheckoutOptions.find({forType: 'deliveryMethod'});
            let payments = await CheckoutOptions.find({forType: 'paymentMethod'});

            res.json({resultCode: 0, options: [...deliveries,...payments]})
        } catch (e) {
            console.log(e);
            res.status(500).json({message: 'Server Error'})
        }
    })

router.post('/checkout',
    async (req, res) => {
        try {
            let authorization = req.headers.authorization;
            let userId;
            if(authorization !== undefined) {
                const decode = await jwt.verify(authorization, config.get('jwtSecret'));
                userId = decode.userId;
            } else {
                userId = null;
            }

            const {products, options} = req.body;
            const regPhone = /\d/g;
            const customerPhone = options.customerPhone.match(regPhone).join('');

            let order = {
                products,
                customerName: options.customerName,
                customerPhone: customerPhone,
                deliveryMethod: options.deliveryMethod,
                address: options.address,
                paymentMethod: options.paymentMethod
            }
            if(userId !== null) {
                order.userId = userId;
            }

            await new Order(order).save();

            res.json({resultCode: 0, message: 'Success, check your e-mail'})
        } catch (e) {
            console.log(e);
            res.status(500).json({message: 'Server Error'})
        }
    })

module.exports = router;