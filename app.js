const express = require('express');
const config = require('config');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(express.json({extended: true}));

app.use(cors());

app.use('/api/auth', require('./routes/auth.routes'));

app.use('/api/profile', require('./routes/profile.routes'));

app.use('/api/product', require('./routes/product.routes'));

app.use('/api/brand', require('./routes/brand.routes'));

app.use('/api/category', require('./routes/category.routes'));

app.use('/api/cart', require('./routes/cart.routes'));

app.use('/api/search', require('./routes/search.routes'));

app.use('/api/all-brands', require('./routes/allBrands.routes'));

app.use('/admin-api/product', require('./routes/admin-api/product.routes'));

app.use('/admin-api/brands', require('./routes/admin-api/brands.routes'));

app.use('/admin-api/categories', require('./routes/admin-api/categories.routes'));

app.use('/admin/', express.static(path.join(__dirname, 'admin-panel/build/')));

app.get('/admin/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.use(express.static(path.join(__dirname, 'client/build/')));

app.get('*', function (req, res) {
     res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

const PORT = config.get('port') || 5000;

async function start() {
    try {
        await mongoose.connect(config.get('mongoURI'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        app.listen(PORT, () => {console.log(`App has been started on port ${PORT}...`)});
    } catch (e) {
        console.log('Server Error', e.message);
        process.exit(1);
    }
}

start()

