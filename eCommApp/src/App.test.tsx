import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import App from './App';

const renderRoute = (path: string) => render(
    <MemoryRouter initialEntries={[path]}>
        <App />
    </MemoryRouter>
);

afterEach(() => {
    vi.unstubAllGlobals();
});

describe('App routes', () => {
    it('renders the home route', () => {
        renderRoute('/');

        expect(screen.getByRole('heading', { name: 'Welcome to the The Daily Harvest!' })).toBeInTheDocument();
    });

    it('renders the products route', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({
                id: 'apple',
                name: 'Apple',
                price: 1,
                reviews: [],
                inStock: true
            })
        }));
        renderRoute('/products');

        expect(await screen.findByRole('heading', { name: 'Our Products' })).toBeInTheDocument();
    });

    it('renders the login route', () => {
        renderRoute('/login');

        expect(screen.getByRole('heading', { name: 'Admin Login' })).toBeInTheDocument();
    });

    it('renders the admin route', () => {
        renderRoute('/admin');

        expect(screen.getByRole('heading', { name: 'Welcome to the admin portal.' })).toBeInTheDocument();
    });

    it('renders the cart route', () => {
        renderRoute('/cart');

        expect(screen.getByRole('heading', { name: 'Your Cart' })).toBeInTheDocument();
    });
});
