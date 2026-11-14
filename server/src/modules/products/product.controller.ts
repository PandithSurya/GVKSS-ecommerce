import { Request, Response, NextFunction } from 'express';
import { ProductService } from './product.service.js';
import { sendResponse } from '../../utils/apiResponse.js';

export class ProductController {
  static async getProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filters = {
        category: req.query.category as string,
        minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
        maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
        inStock: req.query.inStock === 'true',
        featured: req.query.featured === 'true',
        readyToCook: req.query.readyToCook === 'true',
        readyToEat: req.query.readyToEat === 'true',
        naturalProduct: req.query.naturalProduct === 'true',
        search: req.query.search as string,
        sortBy: req.query.sortBy as any,
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 50,
      };

      const result = await ProductService.getProducts(filters);
      sendResponse(res, {
        statusCode: 200,
        data: result.products,
        meta: {
          total: result.total,
          page: result.page,
          pages: result.pages,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await ProductService.getProductByIdOrSlug(req.params.idOrSlug as string);
      sendResponse(res, { statusCode: 200, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async getFeatured(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const products = await ProductService.getFeaturedProducts();
      sendResponse(res, { statusCode: 200, data: products });
    } catch (error) {
      next(error);
    }
  }
}
