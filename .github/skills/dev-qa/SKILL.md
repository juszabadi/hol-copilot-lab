---
name: dev-qa
description: 'Create, review, analyze, and improve unit tests for The Daily Harvest React and TypeScript app. Use for Vitest, React Testing Library, user-event, jsdom, component tests, context tests, test coverage, and deterministic frontend testing.'
---

# Daily Harvest Unit Testing

Create and maintain focused unit tests for the target file or component supplied in the user's request. This skill is for test work only: do not implement or modify production frontend features.

## Project conventions

- Work from the `eCommApp` application directory when running project commands.
- Use the project's Vitest, React Testing Library, `user-event`, and jsdom setup.
- Follow `eCommApp/src/test/setup.ts`, which loads `@testing-library/jest-dom` for all tests. Vitest globals and jsdom are configured in `eCommApp/vite.config.ts`.
- Use `eCommApp/src/components/CartPage.test.tsx` as a style reference for imports, `describe`/`it`, context providers, accessible queries, and interaction tests.
- Keep test names clear and behavior-oriented; organize setup, action, and assertions using Arrange-Act-Assert.

## Workflow

1. Identify the exact target file or component in the user's request. Keep analysis and test changes limited to that target and its directly relevant test/setup files. Read the implementation and nearby tests before proposing or changing tests.
2. Determine what behavior is already present and which cases are missing. Do not assume or add product requirements. If test expectations depend on unclear behavior, ask for clarification rather than deciding product behavior in a test.
3. Create or update tests that cover applicable behavior:
   - Happy paths and important edge cases
   - Empty, loading, and error states
   - Disabled controls and their behavior
   - User interactions and resulting visible or stateful outcomes
4. Prefer queries by role and accessible name, then label or visible text. Use test IDs only when semantic queries are unsuitable.
5. Mock network requests, context providers, or child components only when doing so isolates the target and keeps the test maintainable. Keep mocks explicit and reset or restore them between tests as appropriate.
6. Keep tests independent, deterministic, and free from real external I/O. Use `userEvent.setup()` for user interactions and await its actions. Avoid arbitrary sleeps, order-dependent shared state, and tests of implementation details when observable behavior is available.
7. For review or analysis requests, report concrete test gaps and recommended cases without changing files unless asked. When asked to improve tests, change test files only; do not edit production frontend code to make tests pass.
8. Run the narrowest relevant test command from `eCommApp`, for example:

   ```bash
   npm run test:run -- src/components/CartPage.test.tsx
   ```

   Report the command and result. Do not claim unrun tests passed.

## Test structure example

```tsx
it('shows an empty-state message when there are no items', () => {
    // Arrange
    renderWithProvider({ items: [] });

    // Act
    // No interaction is needed for this state.

    // Assert
    expect(screen.getByText('Your list is empty.')).toBeInTheDocument();
});
```

Keep tests concise: omit explicit Arrange/Act comments when the structure is already clear, and use realistic assertions tied to user-visible behavior.
