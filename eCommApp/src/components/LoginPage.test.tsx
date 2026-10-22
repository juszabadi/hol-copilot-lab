import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import LoginPage from './LoginPage';

const CurrentPath = () => <p data-testid="current-path">{useLocation().pathname}</p>;

const renderLoginPage = () => render(
    <MemoryRouter initialEntries={['/login']}>
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin" element={<CurrentPath />} />
        </Routes>
    </MemoryRouter>
);

describe('LoginPage', () => {
    it('navigates to the admin page with valid credentials', async () => {
        const user = userEvent.setup();
        renderLoginPage();

        fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'admin' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'admin' } });
        await user.click(screen.getByRole('button', { name: 'Login' }));

        expect(screen.getByTestId('current-path')).toHaveTextContent('/admin');
    });

    it('shows an error for invalid credentials', async () => {
        const user = userEvent.setup();
        renderLoginPage();

        await user.type(screen.getByPlaceholderText('Username'), 'admin');
        await user.type(screen.getByPlaceholderText('Password'), 'wrong');
        await user.click(screen.getByRole('button', { name: 'Login' }));

        expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
});
