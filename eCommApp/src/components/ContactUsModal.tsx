import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';

interface ContactUsModalProps {
    onClose: () => void;
    returnFocusRef: React.RefObject<HTMLButtonElement>;
}

const ContactUsModal = ({ onClose, returnFocusRef }: ContactUsModalProps) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const dialogRef = useRef<HTMLDivElement>(null);
    const nameInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        nameInputRef.current?.focus();

        return () => {
            returnFocusRef.current?.focus();
        };
    }, [returnFocusRef]);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setName('');
        setEmail('');
        setMessage('');
        setSubmitted(true);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Escape') {
            onClose();
            return;
        }

        if (event.key !== 'Tab') {
            return;
        }

        const focusableElements = dialogRef.current?.querySelectorAll<HTMLElement>(
            'button:not([disabled]), input:not([disabled]), textarea:not([disabled])'
        );
        if (!focusableElements?.length) {
            return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey && document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
        }
    };

    const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="modal-backdrop" onClick={handleBackdropClick}>
            <div
                ref={dialogRef}
                className="modal-content contact-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="contact-modal-title"
                onKeyDown={handleKeyDown}
            >
                <button
                    type="button"
                    className="close-button"
                    aria-label="Close Contact Us"
                    onClick={onClose}
                >
                    &times;
                </button>
                <h2 id="contact-modal-title">Contact Us</h2>
                {submitted ? (
                    <div className="contact-confirmation">
                        <p role="status">Thank you for your message</p>
                        <button type="button" onClick={onClose}>Continue</button>
                    </div>
                ) : (
                    <form className="contact-form" onSubmit={handleSubmit}>
                        <label htmlFor="contact-name">Name</label>
                        <input
                            ref={nameInputRef}
                            id="contact-name"
                            name="name"
                            type="text"
                            autoComplete="name"
                            value={name}
                            onChange={event => setName(event.target.value)}
                            required
                        />

                        <label htmlFor="contact-email">Email address</label>
                        <input
                            id="contact-email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            value={email}
                            onChange={event => setEmail(event.target.value)}
                            required
                        />

                        <label htmlFor="contact-message">Message</label>
                        <textarea
                            id="contact-message"
                            name="message"
                            value={message}
                            onChange={event => setMessage(event.target.value)}
                            required
                        />

                        <button type="submit">Submit</button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ContactUsModal;
