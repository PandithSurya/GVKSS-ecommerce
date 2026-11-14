import { Router, Request, Response, NextFunction } from 'express';
import { Category } from '../../models/Category.js';
import { sendResponse } from '../../utils/apiResponse.js';

const router = Router();

// GET /api/v1/categories (Public)
router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ sortOrder: 1, name: 1 });
    sendResponse(res, { statusCode: 200, data: categories });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/categories/:slug (Public)
router.get('/:slug', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug, isActive: true });
    if (!category) {
      res.status(404).json({ success: false, message: 'Category not found.' });
      return;
    }
    sendResponse(res, { statusCode: 200, data: category });
  } catch (error) {
    next(error);
  }
});

export default router;
