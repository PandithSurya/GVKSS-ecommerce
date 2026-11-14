import { Product, IProduct } from '../../models/Product.js';
import { Inventory } from '../../models/Inventory.js';
import { ApiError } from '../../utils/apiError.js';

export interface ProductQueryFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  featured?: boolean;
  readyToCook?: boolean;
  readyToEat?: boolean;
  naturalProduct?: boolean;
  search?: string;
  sortBy?: 'featured' | 'price-low' | 'price-high' | 'name' | 'newest';
  page?: number;
  limit?: number;
}

export class ProductService {
  static async getProducts(filters: ProductQueryFilters): Promise<{
    products: IProduct[];
    total: number;
    page: number;
    pages: number;
  }> {
    const query: any = {
      status: 'active',
      isSoftDeleted: false,
    };

    if (filters.category && filters.category !== 'all') {
      query.category = filters.category.toLowerCase();
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      query.price = {};
      if (filters.minPrice !== undefined) query.price.$gte = Number(filters.minPrice);
      if (filters.maxPrice !== undefined) query.price.$lte = Number(filters.maxPrice);
    }

    if (filters.inStock === true) {
      query.available = true;
    }

    if (filters.featured === true) {
      query.isFeatured = true;
    }

    if (filters.readyToCook === true) {
      query.isReadyToCook = true;
    }

    if (filters.readyToEat === true) {
      query.isReadyToEat = true;
    }

    if (filters.naturalProduct === true) {
      query.isNaturalProduct = true;
    }

    if (filters.search && filters.search.trim()) {
      const searchRegex = new RegExp(filters.search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { teluguName: searchRegex },
        { description: searchRegex },
        { tags: searchRegex },
      ];
    }

    let sort: any = { isFeatured: -1, slNo: 1, createdAt: -1 };
    if (filters.sortBy === 'price-low') {
      sort = { price: 1 };
    } else if (filters.sortBy === 'price-high') {
      sort = { price: -1 };
    } else if (filters.sortBy === 'name') {
      sort = { name: 1 };
    } else if (filters.sortBy === 'newest') {
      sort = { createdAt: -1 };
    }

    const page = Math.max(1, Number(filters.page || 1));
    const limit = Math.max(1, Math.min(100, Number(filters.limit || 50)));
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find(query).sort(sort).skip(skip).limit(limit),
      Product.countDocuments(query),
    ]);

    return {
      products,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  static async getProductByIdOrSlug(idOrSlug: string): Promise<{ product: IProduct; inventory?: any }> {
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(idOrSlug);
    const query = isObjectId
      ? { _id: idOrSlug, status: 'active', isSoftDeleted: false }
      : {
          $or: [{ slug: idOrSlug }, { legacyId: idOrSlug }],
          status: 'active',
          isSoftDeleted: false,
        };

    const product = await Product.findOne(query);
    if (!product) {
      throw ApiError.notFound('Product not found.');
    }

    const inventory = await Inventory.findOne({ productId: product._id });

    return {
      product,
      inventory: inventory
        ? {
            stockQuantity: inventory.stockQuantity,
            isAvailable: inventory.stockQuantity > 0,
          }
        : undefined,
    };
  }

  static async getFeaturedProducts(): Promise<IProduct[]> {
    return Product.find({
      isFeatured: true,
      status: 'active',
      isSoftDeleted: false,
    })
      .sort({ slNo: 1 })
      .limit(12);
  }
}
