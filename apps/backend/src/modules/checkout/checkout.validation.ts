import { z } from 'zod';

export const checkoutItemSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
});

export const addressSnapshotSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(/^[0-9]{10}$/, 'Must be a 10-digit mobile number'),
  email: z.string().email('Please enter a valid email address'),
  houseStreet: z.string().min(3, 'Address is required'),
  areaLocality: z.string().min(2, 'Area/Locality is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().default('Telangana'),
  pinCode: z.string().regex(/^[0-9]{6}$/, 'PIN code must be 6 digits'),
  landmark: z.string().optional(),
  notes: z.string().optional(),
});

export const placeOrderSchema = z.object({
  body: z.object({
    shippingAddress: addressSnapshotSchema,
    items: z.array(checkoutItemSchema).min(1, 'At least one item is required to place an order'),
    paymentMethod: z.enum(['UPI', 'COD'], {
      errorMap: () => ({ message: 'Payment method must be either UPI or COD' }),
    }),
    couponCode: z.string().optional(),
  }),
});
