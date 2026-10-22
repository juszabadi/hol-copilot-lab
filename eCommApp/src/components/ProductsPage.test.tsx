import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import ProductsPage from './ProductsPage';
import { CartContext } from '../context/CartContext';
import { Product } from '../types';

vi.mock('./Header', () => ({ default: () => <div>Header</div> }));
vi.mock('./Footer', () => ({ default: () => <div>Footer</div> }));

const products: Product[] = [
    {
        id: 'apple',
        name: 'Apple',
        price: 0.5,
        description: 'A crisp apple',
        image: 'apple.png',
        reviews: [],
        inStock: true
    },
    {
        id: 'grapes',
        name: 'Grapes',
        price: 2,
        description: 'Sweet grapes',
        reviews: [],
        inStock: true
    },
    {
        id: 'orange',
        name: 'Orange',
        price: 0.75,
        description: 'Juicy orange',
        reviews: [],
        inStock: true
    },
    {
        id: 'pear',
        name: 'Pear',
        price: 1.25,
        reviews: [],
        inStock: false
    }
];

const createResponse = (product: Product) => ({
    ok: true,
    json: async () => product
});

let productFetchIndex = 0;

const mockProductFetch = () => {
    vi.stubGlobal('fetch', vi.fn().mockImplementation(() => {
        const responseProduct = products[productFetchIndex++];
        return Promise.resolve(createResponse(responseProduct));
    }));
};

const renderProductsPage = (addToCart = vi.fn()) => render(
    <CartContext.Provider value={{ cartItems: [], addToCart, clearCart: vi.fn() }}>
        <ProductsPage />
    </CartContext.Provider>
);

afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    productFetchIndex = 0;
});

describe('ProductsPage', () => {
    it('shows loading until product requests finish, then displays products', async () => {
        let resolveFirst: ((response: ReturnType<typeof createResponse>) => void) | undefined;
        const firstRequest = new Promise<ReturnType<typeof createResponse>>(resolve => {
            resolveFirst = resolve;
        });
        vi.stubGlobal('fetch', vi.fn()
            .mockReturnValueOnce(firstRequest)
            .mockResolvedValueOnce(createResponse(products[1]))
            .mockResolvedValueOnce(createResponse(products[2]))
            .mockResolvedValueOnce(createResponse(products[3])));

        renderProductsPage();
        expect(screen.getByText('Loading products...')).toBeInTheDocument();

        resolveFirst?.(createResponse(products[0]));
        expect(await screen.findByRole('heading', { name: 'Our Products' })).toBeInTheDocument();
        expect(screen.getByText('Apple')).toBeInTheDocument();
    });

    it('shows product details and disables adding out-of-stock products', async () => {
        mockProductFetch();
        renderProductsPage();

        expect(await screen.findByText('A crisp apple')).toBeInTheDocument();
        expect(screen.getByText('$0.50')).toBeInTheDocument();
        expect(screen.getByRole('img', { name: 'Apple' })).toHaveAttribute(
            'src',
            'products/productImages/apple.png'
        );
        expect(screen.getByRole('button', { name: 'Out of Stock' })).toBeDisabled();
    });

    it('adds an in-stock product to the cart', async () => {
        const user = userEvent.setup();
        const addToCart = vi.fn();
        mockProductFetch();
        renderProductsPage(addToCart);

        await user.click((await screen.findAllByRole('button', { name: 'Add to Cart' }))[0]);

        expect(addToCart).toHaveBeenCalledWith(products[0]);
    });

    it('opens reviews and adds a submitted review to the product', async () => {
        const user = userEvent.setup();
        mockProductFetch();
        renderProductsPage();

        await user.click(await screen.findByRole('img', { name: 'Apple' }));
        expect(screen.getByRole('heading', { name: 'Reviews for Apple' })).toBeInTheDocument();

        await user.type(screen.getByPlaceholderText('Your name'), 'Jordan');
        await user.type(screen.getByPlaceholderText('Your review'), 'Fresh and tasty');
        await user.click(screen.getByRole('button', { name: 'Submit' }));

        expect(screen.getByText('Jordan')).toBeInTheDocument();
        expect(screen.getByText('Fresh and tasty')).toBeInTheDocument();
        await waitFor(() => expect(screen.getByPlaceholderText('Your name')).toHaveValue(''));
    });

    it('closes product reviews', async () => {
        const user = userEvent.setup();
        mockProductFetch();
        renderProductsPage();

        await user.click(await screen.findByRole('img', { name: 'Apple' }));
        await user.click(screen.getByRole('button', { name: 'Close' }));

        expect(screen.queryByRole('heading', { name: 'Reviews for Apple' })).not.toBeInTheDocument();
    });

    it('logs a failed response and ends the loading state', async () => {
        const error = vi.spyOn(console, 'error').mockImplementation(() => {});
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));
        renderProductsPage();

        expect(await screen.findByRole('heading', { name: 'Our Products' })).toBeInTheDocument();
        expect(error).toHaveBeenCalledWith('Error loading products:', expect.any(Error));
        expect(screen.queryByText('Loading products...')).not.toBeInTheDocument();
    });

    it('logs a rejected request and ends the loading state', async () => {
        const error = vi.spyOn(console, 'error').mockImplementation(() => {});
        vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
        renderProductsPage();

        expect(await screen.findByRole('heading', { name: 'Our Products' })).toBeInTheDocument();
        expect(error).toHaveBeenCalledWith('Error loading products:', expect.any(Error));
    });
});
