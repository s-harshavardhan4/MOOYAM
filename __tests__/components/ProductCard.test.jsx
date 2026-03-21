import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProductCard from '../../components/ProductCard';
import { useDispatch, useSelector } from 'react-redux';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

// Mock Redux
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

// Mock NextAuth
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}));

// Mock toast
jest.mock('react-hot-toast', () => ({
  error: jest.fn(),
  success: jest.fn(),
}));

// Mock Wishlist action
jest.mock('@/lib/features/wishlist/wishlistSlice', () => ({
  toggleWishlistAsync: jest.fn((id) => ({ type: 'wishlist/toggle', payload: id })),
}));

// Mock Framer Motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, whileHover, whileInView, initial, viewport, transition, ...props }) => <div {...props}>{children}</div>,
  },
}));

describe('ProductCard', () => {
  const mockProduct = {
    id: '64f1a2b3c4d5e6f7a8b9c0d6',
    name: 'Test Cream',
    price: 500,
    images: ['/test-image.jpg'],
    rating: [{ userId: 'u1', rating: 4 }, { userId: 'u2', rating: 5 }],
  };

  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useDispatch.mockReturnValue(mockDispatch);
    useSelector.mockReturnValue([]); // Default wishlist empty
    useSession.mockReturnValue({ data: { user: { id: 'user1' } } });
  });

  it('renders product details correctly', () => {
    render(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText('Test Cream')).toBeInTheDocument();
    expect(screen.getByText(/₹500/)).toBeInTheDocument();
  });

  it('shows "Please login" toast if unauthenticated user clicks wishlist', () => {
    useSession.mockReturnValue({ data: null });
    render(<ProductCard product={mockProduct} />);
    
    const wishlistBtn = screen.getByLabelText('Add to Wishlist');
    fireEvent.click(wishlistBtn);
    
    expect(toast.error).toHaveBeenCalledWith('Please login to save items');
  });
});
