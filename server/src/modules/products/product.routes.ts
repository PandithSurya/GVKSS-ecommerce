import { Router } from 'express';
import { ProductController } from './product.controller.js';

const router = Router();

router.get('/', ProductController.getProducts);
router.get('/featured', ProductController.getFeatured);
router.get('/:idOrSlug', ProductController.getProduct);

export default router;
