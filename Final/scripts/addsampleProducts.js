const mongoose = require('mongoose');
const Product = require('../models/Product.js');

const products = [
    { name: 'Product 1', description: 'Description for Product 1', price: 10, category: 'Category 1', isFeatured: true },
    { name: 'Product 2', description: 'Description for Product 2', price: 20, category: 'Category 2', isFeatured: true },
    { name: 'Product 3', description: 'Description for Product 3', price: 30, category: 'Category 1', isFeatured: false },
    { name: 'Product 4', description: 'Description for Product 4', price: 40, category: 'Category 2', isFeatured: false },
    { name: 'Product 5', description: 'Description for Product 5', price: 50, category: 'Category 3', isFeatured: true },
    { name: 'Product 6', description: 'Description for Product 6', price: 60, category: 'Category 3', isFeatured: false }
];

const addSampleProducts = async () => {
    try {
        await mongoose.connect('mongodb+srv://fa21bcs090:flgiTGUARXBeAoFj@cluster0.cjzvnqu.mongodb.net/t', { useNewUrlParser: true, useUnifiedTopology: true });
        await Product.insertMany(products);
        console.log('Sample products added successfully.');
        mongoose.connection.close();
    } catch (error) {
        console.error('Error adding sample products:', error);
    }
};

addSampleProducts();
