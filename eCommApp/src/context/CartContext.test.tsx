import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useContext } from 'react';
import { describe, expect, it } from 'vitest';
import { CartProvider, CartContext } from './CartContext';
import { Product } from '../types';

const apple: Product = {
    id: 'apple',
    name: 'Apple',
    price: 1,
    reviews: [],
    inStock: true
};

const grapes: Product = {
    id: 'grapes',
    name: 'Grapes',
    price: 2,
    reviews: [],
    inStock: true
};

const CartContextProbe = () => {
    const context = useContext(CartContext);

    if (!context) {
        throw new Error('CartContext is missing');
    }

    return (
        <>
            <ul>
                {context.cartItems.map(item => (
                    <li key={item.id}>{item.name}: {item.quantity}</li>
                ))}
            </ul>
            <button onClick={() => context.addToCart(apple)}>Add apple</button>
            <button onClick={() => context.addToCart(grapes)}>Add grapes</button>
            <button onClick={context.clearCart}>Clear cart</button>
        </>
    );
};

describe('CartProvider', () => {
    it('adds a product and increments its quantity when added again', async () => {
        const user = userEvent.setup();
        render(<CartProvider><CartContextProbe /></CartProvider>);

        await user.click(screen.getByRole('button', { name: 'Add apple' }));
        expect(screen.getByText('Apple: 1')).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: 'Add apple' }));
        expect(screen.getByText('Apple: 2')).toBeInTheDocument();
    });

    it('keeps existing items when another product is added', async () => {
        const user = userEvent.setup();
        render(<CartProvider><CartContextProbe /></CartProvider>);

        await user.click(screen.getByRole('button', { name: 'Add apple' }));
        await user.click(screen.getByRole('button', { name: 'Add grapes' }));

        expect(screen.getByText('Apple: 1')).toBeInTheDocument();
        expect(screen.getByText('Grapes: 1')).toBeInTheDocument();
    });

    it('empties the cart when cleared', async () => {
        const user = userEvent.setup();
        render(<CartProvider><CartContextProbe /></CartProvider>);

        await user.click(screen.getByRole('button', { name: 'Add apple' }));
        await user.click(screen.getByRole('button', { name: 'Clear cart' }));

        expect(screen.queryByText('Apple: 1')).not.toBeInTheDocument();
    });
});
