// controllers/productController.js
const Product = require('../models/Product');
const url = require('url'); // Import the url module


// Add Product function
exports.addProduct = async (req, res) => {
    const { name, description, price, category, stockStatus, images } = req.body;
    try {
        const product = new Product({ name, description, price, category, stockStatus, images });
        await product.save();

        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "Product added successfully", product }));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "Server error", error: error.message }));
    }
};

// Edit Product function
exports.editProduct = async (req, res, productId) => {
    const { name, description, price, category, stockStatus, images } = req.body;
    try {
        const product = await Product.findByIdAndUpdate(productId, {
            name, description, price, category, stockStatus, images
        }, { new: true });

        if (!product) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: "Product not found" }));
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "Product updated successfully", product }));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "Server error", error: error.message }));
    }
};

// Delete Product function
exports.deleteProduct = async (req, res, productId) => {
    try {
        const product = await Product.findByIdAndDelete(productId);

        if (!product) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: "Product not found" }));
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "Product deleted successfully" }));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "Server error", error: error.message }));
    }
};

// Get All Products function
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "Products retrieved successfully", products }));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "Server error", error: error.message }));
    }
};

// Search Products function
exports.searchProducts = async (req, res) => {
    const queryObject = url.parse(req.url, true).query;
    const { name, category, limit = 10, page = 1 } = queryObject; // Default limit = 10, page = 1
    const filter = {};

    if (name) filter.name = new RegExp(name, 'i'); // Case-insensitive regex for name
    if (category) filter.category = category;

    try {
        // Parse limit and page as integers
        const itemsPerPage = parseInt(limit);
        const currentPage = parseInt(page);
        
        // Calculate the number of documents to skip
        const skip = (currentPage - 1) * itemsPerPage;

        // Find products with pagination
        const products = await Product.find(filter)
            .skip(skip)           // Skip the previous pages' documents
            .limit(itemsPerPage);  // Limit results to itemsPerPage

        // Get total count of documents that match the filter
        const totalProducts = await Product.countDocuments(filter);
        const totalPages = Math.ceil(totalProducts / itemsPerPage);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            message: "Products found",
            products,
            pagination: {
                totalProducts,
                totalPages,
                currentPage,
                itemsPerPage
            }
        }));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "Server error", error: error.message }));
    }
};