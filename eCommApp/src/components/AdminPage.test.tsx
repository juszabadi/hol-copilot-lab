import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import AdminPage from './AdminPage';

const renderAdminPage = () => render(
    <MemoryRouter>
        <AdminPage />
    </MemoryRouter>
);

describe('AdminPage', () => {
    it('starts with no sale active', () => {
        renderAdminPage();

        expect(screen.getByText('No sale active.')).toBeInTheDocument();
        expect(screen.getByLabelText('Set Sale Percent (% off for all items):')).toHaveValue('0');
    });

    it('displays a sale after submitting a valid percentage', async () => {
        const user = userEvent.setup();
        renderAdminPage();

        await user.clear(screen.getByLabelText('Set Sale Percent (% off for all items):'));
        await user.type(screen.getByLabelText('Set Sale Percent (% off for all items):'), '25');
        await user.click(screen.getByRole('button', { name: 'Submit' }));

        expect(screen.getByText('All products are 25% off!')).toBeInTheDocument();
    });

    it('shows a validation message for non-numeric input', async () => {
        const user = userEvent.setup();
        renderAdminPage();

        const input = screen.getByLabelText('Set Sale Percent (% off for all items):');
        await user.clear(input);
        await user.type(input, 'invalid');
        await user.click(screen.getByRole('button', { name: 'Submit' }));

        expect(screen.getByText(/Please enter a valid number/)).toBeInTheDocument();
    });

    it('ends an active sale and resets the input', async () => {
        const user = userEvent.setup();
        renderAdminPage();

        const input = screen.getByLabelText('Set Sale Percent (% off for all items):');
        await user.clear(input);
        await user.type(input, '15');
        await user.click(screen.getByRole('button', { name: 'Submit' }));
        await user.click(screen.getByRole('button', { name: 'End Sale' }));

        expect(screen.getByText('No sale active.')).toBeInTheDocument();
        expect(input).toHaveValue('0');
    });
});
