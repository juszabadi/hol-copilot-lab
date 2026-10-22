# Unit test examples

These short TSX examples follow the project's conventions. They assume the imports and `renderWithCartContext` helper used in `eCommApp/src/components/CartPage.test.tsx`.

## Happy-path interaction

```tsx
it('opens the checkout confirmation when Checkout is selected', async () => {
    // Arrange
    const user = userEvent.setup();
    renderWithCartContext();

    // Act
    await user.click(screen.getByRole('button', { name: 'Checkout' }));

    // Assert
    expect(screen.getByRole('heading', { name: 'Are you sure?' })).toBeInTheDocument();
});
```

## Isolated empty state with mocked child components

```tsx
vi.mock('./Header', () => ({ default: () => <div>Header</div> }));
vi.mock('./Footer', () => ({ default: () => <div>Footer</div> }));

it('shows an empty-cart message when the cart context has no items', () => {
    // Arrange
    render(
        <CartContext.Provider value={{
            cartItems: [],
            addToCart: vi.fn(),
            clearCart: vi.fn()
        }}>
            <CartPage />
        </CartContext.Provider>
    );

    // Act
    // The empty state is presented on render; no interaction is needed.

    // Assert
    expect(screen.getByText('Your cart is empty.')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Checkout' })).not.toBeInTheDocument();
});
```
