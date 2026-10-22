import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ContactUsModal from './ContactUsModal';

const Header = () => {
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const contactButtonRef = useRef<HTMLButtonElement>(null);

    return (
        <header className="app-header">
            <h1>The Daily Harvest</h1>
            <nav>
                <Link to="/">Home</Link>
                <Link to="/products">Products</Link>
                <Link to="/cart">Cart</Link>
                <Link to="/login">
                    <button>Admin Login</button>
                </Link>
                <button
                    ref={contactButtonRef}
                    type="button"
                    className="contact-us-trigger"
                    onClick={() => setIsContactModalOpen(true)}
                >
                    Contact Us
                </button>
            </nav>
            {isContactModalOpen && (
                <ContactUsModal
                    returnFocusRef={contactButtonRef}
                    onClose={() => setIsContactModalOpen(false)}
                />
            )}
        </header>
    );
};

export default Header;
