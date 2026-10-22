import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import ReviewModal from './ReviewModal';
import { Product, Review } from '../types';

const product: Product = {
    id: 'apple',
    name: 'Apple',
    price: 1,
    reviews: [],
    inStock: true
};

describe('ReviewModal', () => {
    it('renders nothing when no product is selected', () => {
        const { container } = render(
            <ReviewModal product={null} onClose={vi.fn()} onSubmit={vi.fn()} />
        );

        expect(container).toBeEmptyDOMElement();
    });

    it('shows an empty state for a product without reviews', () => {
        render(<ReviewModal product={product} onClose={vi.fn()} onSubmit={vi.fn()} />);

        expect(screen.getByText('No reviews yet.')).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Reviews for Apple' })).toBeInTheDocument();
    });

    it('renders existing reviews', () => {
        const review: Review = {
            author: 'Casey',
            comment: 'Delicious',
            date: '2025-01-01T00:00:00.000Z'
        };
        render(
            <ReviewModal product={{ ...product, reviews: [review] }} onClose={vi.fn()} onSubmit={vi.fn()} />
        );

        expect(screen.getByText('Casey')).toBeInTheDocument();
        expect(screen.getByText('Delicious')).toBeInTheDocument();
        expect(screen.queryByText('No reviews yet.')).not.toBeInTheDocument();
    });

    it('submits a review and resets the form fields', async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();
        render(<ReviewModal product={product} onClose={vi.fn()} onSubmit={onSubmit} />);
        const authorInput = screen.getByPlaceholderText('Your name');
        const commentInput = screen.getByPlaceholderText('Your review');

        await user.type(authorInput, 'Jordan');
        await user.type(commentInput, 'Great fruit');
        await user.click(screen.getByRole('button', { name: 'Submit' }));

        expect(onSubmit).toHaveBeenCalledWith({
            author: 'Jordan',
            comment: 'Great fruit',
            date: expect.any(String)
        });
        expect(Number.isNaN(Date.parse(onSubmit.mock.calls[0][0].date))).toBe(false);
        expect(authorInput).toHaveValue('');
        expect(commentInput).toHaveValue('');
    });

    it('does not submit when required fields are empty', async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();
        render(<ReviewModal product={product} onClose={vi.fn()} onSubmit={onSubmit} />);

        await user.click(screen.getByRole('button', { name: 'Submit' }));

        expect(onSubmit).not.toHaveBeenCalled();
    });

    it('closes from the close button and backdrop, but not from modal content', async () => {
        const user = userEvent.setup();
        const onClose = vi.fn();
        const { container } = render(
            <ReviewModal product={product} onClose={onClose} onSubmit={vi.fn()} />
        );

        await user.click(screen.getByRole('heading', { name: 'Reviews for Apple' }));
        expect(onClose).not.toHaveBeenCalled();
        await user.click(screen.getByRole('button', { name: 'Close' }));
        expect(onClose).toHaveBeenCalledTimes(1);

        await user.click(container.querySelector('.modal-backdrop')!);
        expect(onClose).toHaveBeenCalledTimes(2);
    });
});
