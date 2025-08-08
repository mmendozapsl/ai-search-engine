const express = require('express');
const productController = require('../controllers/productController');
const { authenticateToken } = require('../middleware/auth');
const { validate, productSchema } = require('../middleware/validation');

const router = express.Router();

// All product routes require authentication
router.use(authenticateToken);

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.post('/', validate(productSchema), productController.createProduct);
router.put('/:id', validate(productSchema), productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;