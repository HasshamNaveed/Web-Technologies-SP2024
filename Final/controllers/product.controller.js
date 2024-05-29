const Product = require('../models/Product.js');

const getFeaturedProducts = async (req, res) => {
    try {
        const featuredProducts = await Product.find({ isFeatured: true }).limit(5);
        res.render('index', { featuredProducts });
    } catch (error) {
        res.status(500).send('Server Error');
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).send('Product not found');
        }

        // Add product ID to session
        if (!req.session.visitedProducts) {
            req.session.visitedProducts = [];
        }
        if (!req.session.visitedProducts.includes(req.params.id)) {
            req.session.visitedProducts.push(req.params.id);
        }

        res.render('product', { product });
    } catch (error) {
        res.status(500).send('Server Error');
    }
};

const getVisitedProducts = async (req, res) => {
    try {
        const visitedProductIds = req.session.visitedProducts || [];
        const visitedProducts = await Product.find({ _id: { $in: visitedProductIds } });

        res.render('visited-products', { visitedProducts });
    } catch (error) {
        res.status(500).send('Server Error');
    }
};

module.exports = {
    getFeaturedProducts,
    getProductById,
    getVisitedProducts
};
