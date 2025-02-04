# Contributing to Animated Border Studio

Thank you for your interest in contributing to Animated Border Studio! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. Please read [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) before contributing.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* **Use a clear and descriptive title**
* **Describe the exact steps to reproduce the problem**
* **Provide specific examples to demonstrate the steps**
* **Describe the behavior you observed after following the steps**
* **Explain which behavior you expected to see instead and why**
* **Include screenshots or animated GIFs if possible**
* **Include your environment details (OS, browser version, etc.)**

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

* **Use a clear and descriptive title**
* **Provide a step-by-step description of the suggested enhancement**
* **Provide specific examples to demonstrate the steps**
* **Describe the current behavior and explain the behavior you expected to see instead**
* **Explain why this enhancement would be useful**
* **List some other applications where this enhancement exists, if applicable**

### Pull Requests

* Fill in the required template
* Do not include issue numbers in the PR title
* Follow the JavaScript styleguide
* Include screenshots and animated GIFs in your pull request whenever possible
* Document new code
* End all files with a newline

## Development Process

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Setup Development Environment

```bash
# Clone your fork
git clone https://github.com/<your-username>/animated-border-studio
cd animated-border-studio

# Install dependencies
pnpm install

# Start development server
pnpm run dev
```

### Code Style

* Use 2 spaces for indentation
* Use semicolons
* Use meaningful variable names
* Follow SolidJS best practices
* Use TypeScript types/interfaces where possible
* Follow the Tailwind CSS class ordering convention

### Commit Messages

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally after the first line

Example:
```
Add gradient interpolation mode selector

- Add new interpolation modes (OKLCH, Oklab, sRGB)
- Include mode preview in gradient studio
- Update documentation for new feature

Fixes #123
```

### Testing

* Include tests for any new functionality
* Ensure all tests pass before submitting PR
* Update tests if you modify existing functionality

```bash
# Run tests
pnpm run test

# Run tests in watch mode
pnpm run test:watch
```

### Documentation

* Update the README.md with details of changes to the interface
* Update the docs/ directory with any new documentation
* Include JSDoc comments for new functions/components
* Update the type definitions if necessary

## Project Structure

```
animated-border-studio/
├── src/
│   ├── pages/           # Main application pages
│   ├── components/      # Reusable components
│   ├── styles/          # Global styles
│   ├── utils/          # Helper functions
│   └── types/          # TypeScript types
├── docs/               # Documentation
├── tests/              # Test files
└── scripts/           # Build/maintenance scripts
```

## Component Guidelines

### Creating New Components

1. Create a new file in the appropriate directory
2. Use the following template:

```jsx
import { Component } from 'solid-js';

interface Props {
  // Define props interface
}

export const MyComponent: Component<Props> = (props) => {
  // Component logic

  return (
    // JSX
  );
};
```

### Styling Components

* Use Tailwind CSS classes
* Follow the class ordering convention:
  1. Layout
  2. Spacing
  3. Sizing
  4. Typography
  5. Visual
  6. Interactive
  7. Misc

Example:
```jsx
<div class="
  flex flex-col          /* Layout */
  p-4 my-2              /* Spacing */
  w-full h-48           /* Sizing */
  text-lg font-bold     /* Typography */
  bg-blue-500 rounded   /* Visual */
  hover:bg-blue-600     /* Interactive */
  dark:bg-blue-700      /* Misc */
">
```

## Questions?

Feel free to contact the core team if you have any questions. We're here to help! 
