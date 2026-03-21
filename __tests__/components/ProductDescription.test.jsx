import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductDescription from '../../components/ProductDescription';

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(() => ({ data: null, status: 'unauthenticated' })),
}));

// Mock Redux
jest.mock('react-redux', () => ({
  useSelector: jest.fn(() => []), // return empty list of products for related products
}));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    return <img {...props} />;
  },
}));

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  error: jest.fn(),
  success: jest.fn(),
}));

// Mock related product card
jest.mock('../../components/ProductCard', () => {
    return function MockProductCard({ product }) {
        return <div data-testid="related-product">{product.title}</div>;
    }
});

const mockProduct = {
  id: '123',
  title: 'Test Description',
  description: 'This is a mock description for testing.',
  category: 'Skincare',
  rating: []
};

describe('ProductDescription Component', () => {
  it('renders product description by default', () => {
    render(<ProductDescription product={mockProduct} />);
    expect(screen.getByText('This is a mock description for testing.')).toBeInTheDocument();
  });

  it('switches to reviews tab on click', () => {
    render(<ProductDescription product={mockProduct} />);
    
    const reviewsTab = screen.getByText('Reviews');
    fireEvent.click(reviewsTab);
    
    // Reviews tab empty state
    expect(screen.getByText('No reviews yet.')).toBeInTheDocument();
    
    // Description should be hidden
    expect(screen.queryByText('This is a mock description for testing.')).not.toBeInTheDocument();
  });

  it('does not show Add Review button if unauthenticated', () => {
    render(<ProductDescription product={mockProduct} />);
    
    const reviewsTab = screen.getByText('Reviews');
    fireEvent.click(reviewsTab);
    
    expect(screen.queryByText('+ Add Review')).not.toBeInTheDocument();
  });
});
