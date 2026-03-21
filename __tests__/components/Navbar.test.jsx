import React from 'react';
import { render, screen } from '@testing-library/react';
import Navbar from '../../components/Navbar';

// Mock dependencies
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
    };
  },
}));

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(() => ({ data: null, status: 'unauthenticated' })),
  signOut: jest.fn(),
}));

jest.mock('react-redux', () => ({
  useSelector: jest.fn((selector) => {
    // Mock the state
    const state = {
      cart: { total: 2 },
      wishlist: { total: 1 },
    };
    return selector(state);
  }),
}));

describe('Navbar Component', () => {
  it('renders the brand logo text', () => {
    render(<Navbar />);
    expect(screen.getByText(/MOO/i)).toBeInTheDocument();
  });

  it('renders Login button when user is unauthenticated', () => {
    render(<Navbar />);
    expect(screen.getByRole('link', { name: /Login/i })).toBeInTheDocument();
  });

  it('displays the correct cart count from Redux store', () => {
    render(<Navbar />);
    const cartBadges = screen.getAllByText('2');
    expect(cartBadges.length).toBeGreaterThan(0);
  });

  it('displays the correct wishlist count from Redux store', () => {
    render(<Navbar />);
    const wishlistBadges = screen.getAllByText('1');
    expect(wishlistBadges.length).toBeGreaterThan(0);
  });
});
