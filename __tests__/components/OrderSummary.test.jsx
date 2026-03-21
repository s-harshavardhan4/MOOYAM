import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import OrderSummary from '../../components/OrderSummary';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

// Mock Redux
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

// Mock Next Navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock toast
jest.mock('react-hot-toast', () => ({
  error: jest.fn(),
  success: jest.fn(),
  promise: jest.fn((promise) => promise),
}));

describe('OrderSummary', () => {
  const mockDispatch = jest.fn();
  const mockRouter = { push: jest.fn() };
  const mockAddressList = [
    { id: '64f1a2b3c4d5e6f7a8b9c0d1', name: 'John Doe', city: 'City1', state: 'ST', zip: '123' }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    useDispatch.mockReturnValue(mockDispatch);
    useRouter.mockReturnValue(mockRouter);
    useSelector.mockReturnValue(mockAddressList);
  });

  const defaultProps = {
    totalPrice: 1000,
    items: [{ id: '64f1a2b3c4d5e6f7a8b9c0d2', quantity: 1, price: 1000 }]
  };

  it('renders correctly with payment methods and address list', () => {
    render(<OrderSummary {...defaultProps} />);
    
    expect(screen.getByText('Payment Summary')).toBeInTheDocument();
    expect(screen.getByText('COD')).toBeInTheDocument();
    expect(screen.getByText('Stripe Payment')).toBeInTheDocument();
  });

  it('updates total price when a coupon is applied', async () => {
    // Mock fetch for coupon
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue({ success: true, coupon: { discount: 10, code: 'SAVE10', description: '10% off' } })
    });

    render(<OrderSummary {...defaultProps} />);
    
    const couponInput = screen.getByPlaceholderText('Coupon Code');
    const applyBtn = screen.getByText('Apply');
    
    fireEvent.change(couponInput, { target: { value: 'SAVE10' } });
    fireEvent.submit(applyBtn.closest('form'));
    
    await waitFor(() => {
      // 1000 - 10% = 900
      expect(screen.getByText(/₹900/)).toBeInTheDocument();
    });
  });

  it('places an order successfully', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ success: true })
    });

    render(<OrderSummary {...defaultProps} />);

    // Select address first
    const addressSelect = screen.getByRole('combobox');
    fireEvent.change(addressSelect, { target: { value: '0' } });

    const placeOrderBtn = screen.getByText('Place Order');
    fireEvent.click(placeOrderBtn);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/orders', expect.any(Object));
      expect(mockRouter.push).toHaveBeenCalledWith('/orders');
    });
  });
});
