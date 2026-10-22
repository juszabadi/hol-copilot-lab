---
name: dev-front
description: 'Create, improve, refactor, analyze, and review production React frontend code for The Daily Harvest app. Use for React components, TypeScript, Vite, React Router, CartContext, UI behavior, CSS, responsive design, and accessibility.'
---

# Daily Harvest Frontend Development

Work on production frontend code for The Daily Harvest React and TypeScript application. Use the target component supplied in the user's request as the scope of the workflow. This skill is for frontend implementation only; writing or evaluating tests belongs to the `dev-qa` skill.

## Project conventions

- Work primarily in `eCommApp/src/components` and use the existing React, TypeScript, and Vite setup.
- Read the target component and directly related code before making recommendations or changes. Inspect routing in `eCommApp/src/App.tsx`, shared state in `eCommApp/src/context/CartContext.tsx`, and styles in `eCommApp/src/App.css` when relevant.
- Follow existing component composition, naming, state, React Router, `CartContext`, and CSS conventions. Reuse existing components and helpers when suitable.
- Keep page-specific UI and behavior in components. Put shared state in the existing context and reusable non-UI logic in the appropriate utility layer when that is consistent with existing patterns.
- Preserve existing behavior unless the requested feature requires a change. Avoid unrelated refactors and dependencies.
- Do not modify test files or create tests as part of this skill; hand off test creation, review, and analysis to `dev-qa`.

## Workflow

1. Identify the requested operation (create, improve, refactor, analyze, or review) and the exact target component. Keep the work focused on that target and necessary directly related files.
2. Trace the target's current behavior, relevant routes, context use, child components, and styles. Check for existing patterns before adding a new component, state path, or style.
3. Confirm the intended user-visible behavior from the request. Preserve current routes, cart behavior, and other existing interactions unless the feature explicitly changes them. Ask for clarification if a significant behavior or product decision is ambiguous.
4. When implementing, use typed props and state, small maintainable component boundaries, semantic HTML, accessible names, and keyboard-friendly interactions. Avoid unnecessary casts, duplicate state, and hidden failure states.
5. Account for applicable loading, error, empty, disabled, responsive, and accessibility states. Ensure errors are presented or handled consistently with the surrounding application; do not turn failures into success-shaped or silent fallbacks.
6. Keep styles consistent with `eCommApp/src/App.css` and its existing responsive media-query patterns. Avoid introducing unrelated global styles.
7. For analyze and review requests, report findings and recommendations without editing files unless implementation is explicitly requested. For implementation requests, make the code changes and summarize behavior and affected files.
8. Validate implementation with the narrowest relevant available checks from the `eCommApp` directory, such as:

   ```bash
   npm run lint
   npm run build
   ```

   Use `dev-qa` conventions or workflow for test work. Report commands and results accurately; do not claim checks passed unless they were run.
