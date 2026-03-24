/**
 * @jest-environment node
 */
import { GET, POST } from '../../app/api/orders/route';
import { getDb } from '../../lib/mongodb';
import { getServerSession } from "next-auth";

// Mock lib/mongodb
jest.mock('../../lib/mongodb', () => ({
  getDb: jest.fn()
}));

// Mock Authentication
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

jest.mock('../../lib/auth', () => ({
  authOptions: {},
}));

describe('Orders API', () => {
  let mockCursor, mockAggregateCursor, mockCollection, mockDb;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockCursor = {
      toArray: jest.fn().mockResolvedValue([]),
    };
    
    // Simulate aggregation pipeline results
    mockAggregateCursor = {
      toArray: jest.fn().mockResolvedValue([{
        _id: '64f1a2b3c4d5e6f7a8b9c0d1',
        userId: 'user1',
        total: 150,
        status: 'ORDER_PLACED',
        paymentMethod: 'credit_card',
        isPaid: false,
        isCouponUsed: false,
        coupon: null,
        createdAt: new Date(),
        addressDoc: {
          _id: '64f1a2b3c4d5e6f7a8b9c0d2',
          name: 'John Doe',
          phone: '1234567890',
          street: '123 Main St',
          city: 'Anytown',
          state: 'NY',
          country: 'USA',
          zip: '10001'
        },
        orderItems: [
           { _id: '64f1a2b3c4d5e6f7a8b9c0d3', productId: '64f1a2b3c4d5e6f7a8b9c0d4', quantity: 1, price: 150 }
        ]
      }]),
    };

    mockCollection = {
      aggregate: jest.fn().mockReturnValue(mockAggregateCursor),
      find: jest.fn().mockReturnValue(mockCursor),
      insertOne: jest.fn().mockResolvedValue({ insertedId: { toString: () => '64f1a2b3c4d5e6f7a8b9c0d5' } }),
      insertMany: jest.fn().mockResolvedValue({}),
      updateOne: jest.fn().mockResolvedValue({}),
    };

    mockDb = {
      collection: jest.fn().mockReturnValue(mockCollection),
    };

    getDb.mockResolvedValue({ db: mockDb });
    getServerSession.mockResolvedValue({ user: { id: 'user1', name: 'John Doe' } });
  });

  describe('GET', () => {
    it('should return 401 if user is not authenticated', async () => {
      getServerSession.mockResolvedValueOnce(null);
      const response = await GET();
      const data = await response.json();
      
      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
    });

    it('should return orders successfully for authenticated user', async () => {
      const response = await GET();
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.orders).toHaveLength(1);
      expect(data.orders[0].id).toBe('64f1a2b3c4d5e6f7a8b9c0d1');
      expect(data.orders[0].total).toBe(150);
      expect(data.orders[0].address.city).toBe('Anytown');
      expect(data.orders[0].orderItems).toHaveLength(1);
    });
  });

  describe('POST', () => {
    it('should return 401 if user is not authenticated for POST', async () => {
      getServerSession.mockResolvedValueOnce(null);
      const request = { 
        json: jest.fn().mockResolvedValue({}),
        headers: { get: jest.fn().mockReturnValue('127.0.0.1') }
      };
      const response = await POST(request);
      
      expect(response.status).toBe(401);
    });

    it('should return 400 if required fields are missing', async () => {
      const request = { 
        json: jest.fn().mockResolvedValue({ total: 100 }),
        headers: { get: jest.fn().mockReturnValue('127.0.0.1') }
      };
      const response = await POST(request);
      
      expect(response.status).toBe(400);
    });

    it('should create an order successfully', async () => {
      // Setup product price check
      mockCursor.toArray.mockResolvedValueOnce([
        { _id: '64f1a2b3c4d5e6f7a8b9c0d4', price: 150, quantity: 10, inStock: true }
      ]);
      
      const payload = {
        total: 150,
        items: [{ id: '64f1a2b3c4d5e6f7a8b9c0d4', quantity: 1 }],
        addressId: '64f1a2b3c4d5e6f7a8b9c0d2',
        paymentMethod: 'credit_card',
        coupon: null
      };
      
      const request = { 
        json: jest.fn().mockResolvedValue(payload),
        headers: { get: jest.fn().mockReturnValue('127.0.0.1') }
      };
      const response = await POST(request);
      const data = await response.json();
      
      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.order.id).toBe('64f1a2b3c4d5e6f7a8b9c0d5');
      expect(data.order.total).toBe(150);
      expect(data.order.status).toBe('ORDER_PLACED');
    });

    it('should fail to create order if product is out of stock', async () => {
      // Setup product check with 0 quantity
      mockCursor.toArray.mockResolvedValueOnce([
        { _id: '64f1a2b3c4d5e6f7a8b9c0d4', name: 'Test Product', price: 150, quantity: 0, inStock: true }
      ]);
      
      const payload = {
        total: 150,
        items: [{ id: '64f1a2b3c4d5e6f7a8b9c0d4', quantity: 1 }],
        addressId: '64f1a2b3c4d5e6f7a8b9c0d2',
        paymentMethod: 'credit_card',
        coupon: null
      };
      
      const request = { 
        json: jest.fn().mockResolvedValue(payload),
        headers: { get: jest.fn().mockReturnValue('127.0.0.1') }
      };
      const response = await POST(request);
      const data = await response.json();
      
      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.message).toContain('Insufficient stock');
    });
  });
});
