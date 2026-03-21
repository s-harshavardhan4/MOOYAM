/**
 * @jest-environment node
 */
import { GET } from '../../app/api/products/route';
import { getDb } from '../../lib/mongodb';

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

describe('Products API', () => {
  const mockCollection = {
    find: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnThis(),
    toArray: jest.fn().mockResolvedValue([
      { _id: '1', title: 'Test Product 1', price: 100 },
      { _id: '2', title: 'Test Product 2', price: 200 }
    ]),
  };

  const mockDb = {
    collection: jest.fn().mockReturnValue(mockCollection),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    getDb.mockResolvedValue({ db: mockDb });
  });

  it('GET should return products successfully', async () => {
    const request = { url: 'http://localhost:3000/api/products' };
    
    const response = await GET(request);
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.products).toHaveLength(2);
    expect(data.products[0].title).toBe('Test Product 1');
    expect(data.products[0].id).toBe('1'); 
  });

  it('GET should return 500 on database error', async () => {
    getDb.mockRejectedValueOnce(new Error('Connection Failed'));
    
    const request = { url: 'http://localhost:3000/api/products' };
    const response = await GET(request);
    const data = await response.json();
    
    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.message).toBe('Failed to fetch products');
  });
});
