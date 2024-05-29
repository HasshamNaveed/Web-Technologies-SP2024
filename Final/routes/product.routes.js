const express = require('express');
const { getFeaturedProducts, getProductById, getVisitedProducts } = require('../controllers/product.controller.js');
const verifyJWT = require('../middlewares/auth.middleware.js'); // Assuming you use this middleware for secured routes

const router = express.Router();

router.get('/products/:id', getProductById);
router.get('/visited-products', getVisitedProducts);

module.exports = router;
