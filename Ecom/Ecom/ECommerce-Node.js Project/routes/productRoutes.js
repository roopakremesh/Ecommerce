const productController = require('../controllers/productController');
const productRoutes = async (req, res) => {
    // Handle Add Product
    if (req.url === '/products' && req.method === 'POST') {
        return productController.addProduct(req, res);  // Add new product

    // Handle Edit Product (PUT method with productId parameter)
    } else if (req.url.startsWith('/products/') && req.method === 'PUT') {
        const productId = req.url.split('/')[2];  // Extract productId from the URL
        return productController.editProduct(req, res, productId);  // Edit product

    // Handle Delete Product (DELETE method with productId parameter)
    } else if (req.url.startsWith('/products/') && req.method === 'DELETE') {
        const productId = req.url.split('/')[2];  // Extract productId from the URL
        return productController.deleteProduct(req, res, productId);  // Delete product
    
    // Handle Get All Products (List)
    } else if (req.url === '/products' && req.method === 'GET') {
        return productController.getAllProducts(req, res);  // List all products

    // Handle Search Products
    } else if (req.url.startsWith('/products/search') && req.method === 'GET') {
        return productController.searchProducts(req, res);  // Search products

    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "Route not found" }));
    }
};

module.exports = productRoutes;
