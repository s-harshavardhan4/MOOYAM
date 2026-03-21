/**
 * @jest-environment node
 */
import { GET, POST } from '../../app/api/address/route';
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

jest.mock('../../app/api/auth/[...nextauth]/route', () => ({
  authOptions: {},
}));

describe('Address API', () => {
  let mockCursor, mockCollection, mockDb;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockCursor = {
      sort: jest.fn().mockReturnThis(),
      toArray: jest.fn().mockResolvedValue([{
        _id: 'addr1',
        userId: 'user1',
        name: 'John Doe',
        street: '123 Main St',
        city: 'Anytown',
        state: 'NY',
        country: 'USA',
        zip: '10001',
        phone: '1234567890'
      }]),
    };

    mockCollection = {
      find: jest.fn().mockReturnValue(mockCursor),
      insertOne: jest.fn().mockResolvedValue({ insertedId: { toString: () => 'newAddrId' } }),
    };

    mockDb = {
      collection: jest.fn().mockReturnValue(mockCollection),
    };

    getDb.mockResolvedValue({ db: mockDb });
    getServerSession.mockResolvedValue({ user: { id: 'user1' } });
  });

  describe('GET', () => {
    it('should return 401 if user is not authenticated', async () => {
      getServerSession.mockResolvedValueOnce(null);
      const response = await GET();
      const data = await response.json();
      
      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
    });

    it('should return addresses successfully for authenticated user', async () => {
      const response = await GET();
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.addresses).toHaveLength(1);
      expect(data.addresses[0].id).toBe('addr1');
      expect(data.addresses[0].city).toBe('Anytown');
    });
  });

  describe('POST', () => {
    it('should return 401 if user is not authenticated for POST', async () => {
      getServerSession.mockResolvedValueOnce(null);
      const request = { json: jest.fn().mockResolvedValue({}) };
      const response = await POST(request);
      
      expect(response.status).toBe(401);
    });

    it('should return 400 if required fields are missing', async () => {
      const request = { json: jest.fn().mockResolvedValue({ name: 'John Doe' }) };
      const response = await POST(request);
      
      expect(response.status).toBe(400);
    });

    it('should create an address successfully', async () => {
      const payload = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        street: '456 Oak St',
        city: 'Othertown',
        state: 'CA',
        zip: '90001',
        country: 'USA',
        phone: '0987654321'
      };
      
      const request = { json: jest.fn().mockResolvedValue(payload) };
      const response = await POST(request);
      const data = await response.json();
      
      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.address.id).toBe('newAddrId');
      expect(data.address.name).toBe('Jane Doe');
      expect(mockCollection.insertOne).toHaveBeenCalledWith(expect.objectContaining({
        name: 'Jane Doe',
        userId: 'user1'
      }));
    });
  });
});
