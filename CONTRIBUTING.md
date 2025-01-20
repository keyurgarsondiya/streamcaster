# Contributing to StreamCaster

First off, thank you for considering contributing to StreamCaster! It's people like you that make StreamCaster such a great tool.

## Code of Conduct

By participating in this project, you are expected to uphold our Code of Conduct:

- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check if the issue has already been reported. If you're unable to find an open issue addressing the problem, open a new one. Be sure to include a title and clear description, as much relevant information as possible, and a code sample or an executable test case demonstrating the expected behavior that is not occurring.

#### How Do I Submit A (Good) Bug Report?

Bugs are tracked as GitHub issues. Create an issue and provide the following information:

- Use a clear and descriptive title
- Describe the exact steps to reproduce the problem
- Provide specific examples to demonstrate the steps
- Describe the behavior you observed after following the steps
- Explain which behavior you expected to see instead and why
- Include screenshots and animated GIFs if possible
- Include details about your configuration and environment

### Suggesting Enhancements

This section guides you through submitting an enhancement suggestion for StreamCaster, including completely new features and minor improvements to existing functionality.

#### How Do I Submit A (Good) Enhancement Suggestion?

Enhancement suggestions are tracked as GitHub issues. Create an issue and provide the following information:

- Use a clear and descriptive title
- Provide a detailed description of the proposed enhancement
- Explain why this enhancement would be useful to most StreamCaster users
- List some examples of where this enhancement could be used
- If possible, add mockups or examples of similar features in other applications

### Pull Requests

1. Fork the repo and create your branch from `master`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.
6. Issue that pull request!

#### Pull Request Process

1. Update the README.md with details of changes to the interface, if applicable.
2. The PR will be merged once you have the sign-off of at least one other developer.

## Development Process

1. Clone the repo
```bash
git clone https://github.com/keyurgarsondiya/streamcaster.git
```

2. Create a branch
```bash
git checkout -b feature/your-feature-name
```

3. Set up development environment
```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

### Coding Standards

- Use TypeScript for all new code
- Follow the existing code style
- Use meaningful variable and function names
- Write comments for complex logic
- Keep functions small and focused
- Write tests for new features

### Commit Messages

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for formatting changes
- `refactor:` for code refactoring
- `test:` for adding tests
- `chore:` for updating build tasks, package manager configs, etc.

Example:
```
feat: add support for custom overlay transitions
```

### Testing

- Write unit tests for new features
- Ensure all tests pass before submitting PR
- Include test cases for edge cases
- Use the existing test framework

```bash
# Run tests
npm run test

# Run tests in watch mode
npm run test:watch
```

## Project Structure

Please maintain the following project structure when adding new features:

```
frontend/
├── components/        # Reusable UI components
├── hooks/            # Custom React hooks
├── lib/              # Utility functions
├── pages/            # Next.js pages
└── tests/            # Test files

backend/
├── src/
│   ├── controllers/  # Route controllers
│   ├── services/     # Business logic
│   ├── models/       # Data models
│   └── utils/        # Helper functions
└── tests/            # Test files
```

## Questions?

Feel free to contact the project maintainers if you have any questions. We are here to help!