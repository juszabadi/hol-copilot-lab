import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import '../App.css';
import Header from './Header';

const renderContactModal = () => render(
    <MemoryRouter>
        <Header />
    </MemoryRouter>
);

describe('ContactUsModal', () => {
    it('uses the centered overlay and exposes required, labeled fields with Submit after Message', async () => {
        const user = userEvent.setup();
        renderContactModal();
        await user.click(screen.getByRole('button', { name: 'Contact Us' }));

        const dialog = screen.getByRole('dialog', { name: 'Contact Us' });
        const backdrop = dialog.parentElement;
        expect(backdrop).toHaveClass('modal-backdrop');
        expect(backdrop).toHaveStyle({
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        });

        const name = screen.getByRole('textbox', { name: 'Name' });
        const email = screen.getByRole('textbox', { name: 'Email address' });
        const message = screen.getByRole('textbox', { name: 'Message' });
        const submit = screen.getByRole('button', { name: 'Submit' });
        expect(name).toBeRequired();
        expect(email).toBeRequired();
        expect(message).toBeRequired();
        expect(message.compareDocumentPosition(submit) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();

        await user.click(submit);
        expect(screen.queryByRole('status')).not.toBeInTheDocument();
        expect(dialog).toBeInTheDocument();
    });

    it('traps Tab navigation within the dialog and wraps in both directions', async () => {
        const user = userEvent.setup();
        renderContactModal();
        await user.click(screen.getByRole('button', { name: 'Contact Us' }));

        const close = screen.getByRole('button', { name: 'Close Contact Us' });
        const name = screen.getByRole('textbox', { name: 'Name' });
        const email = screen.getByRole('textbox', { name: 'Email address' });
        const message = screen.getByRole('textbox', { name: 'Message' });

        expect(name).toHaveFocus();
        await user.tab();
        expect(email).toHaveFocus();
        await user.tab();
        expect(message).toHaveFocus();
        await user.tab();
        expect(close).toHaveFocus();
        await user.tab();
        expect(name).toHaveFocus();
    });

    it('shows a confirmation after valid submission and closes with Continue', async () => {
        const user = userEvent.setup();
        renderContactModal();
        await user.click(screen.getByRole('button', { name: 'Contact Us' }));

        await user.type(screen.getByRole('textbox', { name: 'Name' }), 'Jordan');
        await user.type(screen.getByRole('textbox', { name: 'Email address' }), 'jordan@example.com');
        await user.type(screen.getByRole('textbox', { name: 'Message' }), 'Please contact me.');
        await user.click(screen.getByRole('button', { name: 'Submit' }));

        expect(screen.getByRole('status')).toHaveTextContent('Thank you for your message');
        expect(screen.getByRole('button', { name: 'Continue' })).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Submit' })).not.toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: 'Continue' }));
        expect(screen.queryByRole('dialog', { name: 'Contact Us' })).not.toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: 'Contact Us' }));
        expect(screen.getByRole('textbox', { name: 'Name' })).toHaveValue('');
        expect(screen.getByRole('textbox', { name: 'Email address' })).toHaveValue('');
        expect(screen.getByRole('textbox', { name: 'Message' })).toHaveValue('');
    });

    it('clears entered values when closed and reopened', async () => {
        const user = userEvent.setup();
        renderContactModal();
        await user.click(screen.getByRole('button', { name: 'Contact Us' }));
        await user.type(screen.getByRole('textbox', { name: 'Name' }), 'Jordan');
        await user.type(screen.getByRole('textbox', { name: 'Email address' }), 'jordan@example.com');
        await user.type(screen.getByRole('textbox', { name: 'Message' }), 'Please contact me.');

        await user.click(screen.getByRole('button', { name: 'Close Contact Us' }));
        await user.click(screen.getByRole('button', { name: 'Contact Us' }));

        expect(screen.getByRole('textbox', { name: 'Name' })).toHaveValue('');
        expect(screen.getByRole('textbox', { name: 'Email address' })).toHaveValue('');
        expect(screen.getByRole('textbox', { name: 'Message' })).toHaveValue('');
    });
});
