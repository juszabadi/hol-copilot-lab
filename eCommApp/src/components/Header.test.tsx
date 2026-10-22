import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import Header from './Header';

describe('Header', () => {
    it('renders the storefront title and navigation links', () => {
        render(<MemoryRouter><Header /></MemoryRouter>);

        expect(screen.getByRole('heading', { name: 'The Daily Harvest' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
        expect(screen.getByRole('link', { name: 'Products' })).toHaveAttribute('href', '/products');
        expect(screen.getByRole('link', { name: 'Cart' })).toHaveAttribute('href', '/cart');
        expect(screen.getByRole('link', { name: 'Admin Login' })).toHaveAttribute('href', '/login');
    });

    it('opens the Contact Us dialog, focuses its first field, and returns focus when dismissed with Escape', async () => {
        const user = userEvent.setup();
        render(
            <MemoryRouter>
                <Header />
            </MemoryRouter>
        );
        const contactButton = screen.getByRole('button', { name: 'Contact Us' });

        await user.click(contactButton);

        expect(screen.getByRole('dialog', { name: 'Contact Us' })).toHaveAttribute('aria-modal', 'true');
        expect(screen.getByLabelText('Name')).toHaveFocus();

        await user.keyboard('{Escape}');

        expect(screen.queryByRole('dialog', { name: 'Contact Us' })).not.toBeInTheDocument();
        expect(contactButton).toHaveFocus();
    });
});
