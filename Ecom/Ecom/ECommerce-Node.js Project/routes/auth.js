const authController = require('../controllers/authController');

// This function will handle routing to the correct controller function based on the URL
const authRoutes = async (req, res) => {
    // Debug: Log the URL and method
    console.log(`authRoutes: Request URL: ${req.url}, Method: ${req.method}`);

    // Remove trailing slash if it exists
    const url = req.url.endsWith('/') ? req.url.slice(0, -1) : req.url;

    if (url === '/auth/signup' && req.method === 'POST') {
        return authController.signup(req, res);  // Call signup function from controller
    } else if (url === '/auth/login' && req.method === 'POST') {
        return authController.login(req, res);  // Call login function from controller
    } else {
        // If route is not matched, return 404
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "Route not found" }));
    }
};

module.exports = authRoutes;  // Export the authRoutes handler
