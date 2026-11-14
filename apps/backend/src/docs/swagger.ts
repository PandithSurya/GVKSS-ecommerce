export const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'GVKSS Organic Products E-commerce Backend API',
    version: '1.0.0',
    description:
      'Production-grade RESTful API for GVKSS Organic Products platform supporting MongoDB Atlas, customer auth, cart, atomic checkout, manual UPI QR verification with replay prevention, and RBAC admin portal.',
    contact: {
      name: 'GVKSS Support',
      email: 'ddshyderabad@gmail.com',
    },
  },
  servers: [
    {
      url: 'http://localhost:5000/api/v1',
      description: 'Local Development Server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      cookieAuth: {
        type: 'apiKey',
        in: 'cookie',
        name: 'accessToken',
      },
    },
  },
  paths: {
    '/auth/register': {
      post: {
        summary: 'Register new customer account',
        tags: ['Authentication'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['fullName', 'email', 'password', 'phone'],
                properties: {
                  fullName: { type: 'string', example: 'Ramesh Reddy' },
                  email: { type: 'string', example: 'ramesh@example.com' },
                  password: { type: 'string', example: 'RameshSecure@2026' },
                  phone: { type: 'string', example: '9391628344' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Registration successful' },
          409: { description: 'Email already exists' },
        },
      },
    },
    '/auth/login': {
      post: {
        summary: 'Customer login',
        tags: ['Authentication'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', example: 'ramesh@example.com' },
                  password: { type: 'string', example: 'RameshSecure@2026' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Login successful with JWT access & refresh tokens' },
          401: { description: 'Invalid credentials' },
        },
      },
    },
    '/products': {
      get: {
        summary: 'Browse products catalog with filtering, sorting and search',
        tags: ['Products'],
        parameters: [
          { name: 'category', in: 'query', schema: { type: 'string' } },
          { name: 'minPrice', in: 'query', schema: { type: 'number' } },
          { name: 'maxPrice', in: 'query', schema: { type: 'number' } },
          { name: 'inStock', in: 'query', schema: { type: 'boolean' } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
          { name: 'sortBy', in: 'query', schema: { type: 'string', enum: ['featured', 'price-low', 'price-high', 'name'] } },
        ],
        responses: {
          200: { description: 'List of active products' },
        },
      },
    },
    '/checkout/calculate': {
      post: {
        summary: 'Server-side calculation of order total, delivery fee, and COD eligibility',
        tags: ['Checkout'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['items'],
                properties: {
                  items: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        productId: { type: 'string' },
                        quantity: { type: 'number' },
                      },
                    },
                  },
                  pinCode: { type: 'string', example: '500060' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Calculation breakdown' },
        },
      },
    },
    '/checkout/place-order': {
      post: {
        summary: 'Place an order using database transaction and stock lock',
        tags: ['Checkout'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['shippingAddress', 'items', 'paymentMethod'],
                properties: {
                  shippingAddress: {
                    type: 'object',
                    required: ['fullName', 'phone', 'email', 'houseStreet', 'areaLocality', 'city', 'pinCode'],
                  },
                  items: { type: 'array' },
                  paymentMethod: { type: 'string', enum: ['UPI', 'COD'] },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Order created with pending status and UPI QR code details (if UPI)' },
        },
      },
    },
    '/payments/submit-utr': {
      post: {
        summary: 'Customer submits 12-digit UPI transaction reference (UTR) with replay protection',
        tags: ['Payments'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['orderNumber', 'utrNumber'],
                properties: {
                  orderNumber: { type: 'string', example: 'SNG-482910' },
                  utrNumber: { type: 'string', example: '429019284712' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Payment marked SUBMITTED_FOR_VERIFICATION' },
          409: { description: 'UTR duplicate submission detected' },
        },
      },
    },
    '/admin/auth/login': {
      post: {
        summary: 'Admin credentials authentication',
        tags: ['Admin'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', example: 'admin@gvkss.org' },
                  password: { type: 'string', example: 'AdminSecure@2026!' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Admin token issued' },
        },
      },
    },
    '/admin/payments/pending': {
      get: {
        summary: 'Admin pending UPI verification queue',
        tags: ['Admin'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'List of submitted UTRs awaiting verification' },
        },
      },
    },
    '/admin/payments/{paymentId}/confirm': {
      post: {
        summary: 'Confirm UPI payment after verifying bank transaction',
        tags: ['Admin'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'paymentId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Payment verified and order confirmed' },
        },
      },
    },
    '/admin/payments/{paymentId}/reject': {
      post: {
        summary: 'Reject UPI payment with mandatory reason',
        tags: ['Admin'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'paymentId', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['reason'],
                properties: {
                  reason: { type: 'string', example: 'UTR not credited to bank account.' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Payment rejected with notification sent' },
        },
      },
    },
  },
};
