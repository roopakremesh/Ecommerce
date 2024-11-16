const mongoose = require('mongoose');

// Define the Product Schema
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    stockStatus: {
        type: String,
        required: true, // e.g. "in stock", "out of stock"
    },
    images: [String],  // Array of image URLs
});

// Create and export the Product model
const Product = mongoose.model('Product', productSchema);
module.exports = Product;
