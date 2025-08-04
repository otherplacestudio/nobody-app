# Contributing to Nobody

We love your input! We want to make contributing to Nobody as easy and transparent as possible.

## Development Process

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

1. Fork the repo and create your branch from `main`
2. If you've added code that should be tested, add tests
3. If you've changed APIs, update the documentation
4. Ensure the test suite passes
5. Make sure your code lints
6. Issue that pull request!

## Development Setup

1. Clone your fork:
```bash
git clone https://github.com/YOUR_USERNAME/nobody-app.git
cd nobody-app
```

2. Install dependencies:
```bash
npm install
```

3. Copy environment variables:
```bash
cp .env.example .env.local
# Add your Supabase and OpenAI keys
```

4. Run development server:
```bash
npm run dev
```

## Pull Request Process

1. Update the README.md with details of changes to the interface
2. Update the SETUP.md with any new environment variables or setup steps
3. The PR will be merged once you have the sign-off of one maintainer

## Code Style

- We use Prettier for formatting (run `npm run format`)
- We use ESLint for linting (run `npm run lint`)
- We use TypeScript for type safety (run `npm run typecheck`)

## Commit Messages

We follow conventional commits:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation only changes
- `style:` Code style changes (formatting, etc)
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

Example: `feat: add Austin city personas`

## Testing

Before submitting a PR:

```bash
npm run typecheck
npm run lint
npm run build
```

## Environment Variables

Never commit `.env.local` or any file containing secrets. Use `.env.example` as a template.

## Questions?

Feel free to open an issue with your question or reach out to the maintainers.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.