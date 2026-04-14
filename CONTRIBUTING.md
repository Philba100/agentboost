# Contributing to AgentBoost

Thank you for your interest in contributing to AgentBoost! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

Please treat all contributors with respect and follow these principles:
- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Report inappropriate behavior

## How to Contribute

### Reporting Bugs

Found a bug? Please report it by:

1. **Check existing issues** — Ensure the bug hasn't been reported already
2. **Create a new issue** — 
   - Use a clear, descriptive title
   - Provide a detailed description
   - Include steps to reproduce
   - Provide code examples if applicable
   - Describe expected vs. actual behavior

### Suggesting Features

Have a feature idea? Please:

1. **Check discussions** — See if it's already been suggested
2. **Create a discussion** — Describe the feature and use case
3. **Wait for feedback** — Community discussion helps prioritize features

### Pull Requests

We love pull requests! Here's how to contribute code:

#### Step 1: Fork the Repository
```bash
git clone https://github.com/YOUR-USERNAME/agentboost.git
cd agentboost
```

#### Step 2: Create a Feature Branch
```bash
git checkout -b feature/my-feature
# or
git checkout -b fix/my-bug-fix
```

#### Step 3: Make Your Changes

Follow our code style:
- Use TypeScript for all new code
- Follow existing naming conventions
- Write clear, descriptive comments
- Keep functions small and focused
- Test your changes

#### Step 4: Commit Your Changes

```bash
git add .
git commit -m "feat: add my feature

- Detailed description of changes
- Why this change is necessary
- Any related issues or PRs"
```

**Commit message format:**
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation
- `refactor:` for code refactoring
- `test:` for test additions
- `chore:` for maintenance

#### Step 5: Push & Create Pull Request

```bash
git push origin feature/my-feature
```

Then on GitHub, create a Pull Request with:
- Clear title describing the change
- Detailed description of what and why
- Reference any related issues (#123)
- Before/after screenshots if UI changes

### Development Setup

```bash
# Install dependencies
npm install

# Create .env.local
cp .env.example .env.local

# Start development server
npm run dev

# Run linter
npm run lint

# Run tests
npm test

# Build
npm run build
```

## Code Style Guide

### TypeScript
- Use strict type definitions
- Avoid `any` unless necessary
- Export types and interfaces

```typescript
// Good
interface SkillDetail {
  id: string;
  name: string;
  icon: string;
}

export function getSkill(id: string): SkillDetail | undefined {
  // implementation
}

// Avoid
export function getSkill(id: any): any {
  // implementation
}
```

### React/Next.js
- Use functional components with hooks
- Keep components small and focused
- Use TypeScript for props

```typescript
// Good
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export default function Button({ label, onClick, variant = 'primary' }: ButtonProps) {
  // implementation
}
```

### Styling
- Use Tailwind CSS classes
- Use dark theme colors (#0f172a, #1e293b, #00ff9d)
- Mobile-first responsive design

```typescript
// Good
<div className="bg-[#1e293b] text-[#f8fafc] px-4 py-2 rounded">
  Content
</div>

// Avoid
<div style={{ backgroundColor: '#1e293b'  }}>
  Content
</div>
```

## Testing

All new features should include tests:

```bash
# Run all tests
npm test

# Run specific test file
npm test __tests__/skills.test.ts

# Run tests in watch mode
npm test --watch
```

## Documentation

Update documentation for:
- New features
- API changes
- New skills
- Configuration options

Documentation files:
- `README.md` — Overview and getting started
- `docs/` — Detailed guides
- Code comments — Inline documentation
- `skills/[skill]/SKILL.md` — Skill documentation

## Merging Strategy

Our merging strategy:
- Code review required for all PRs
- Minimum 1 approval from maintainers
- All tests must pass
- No merge conflicts

## Project Structure

```
agentboost/
├── app/                 # Next.js app directory
├── components/          # React components
├── lib/                 # Utilities and helpers
├── public/              # Static files
├── skills/              # Skill documentation
├── docs/                # Documentation
├── __tests__/           # Tests
└── ...config files
```

## Performance Guidelines

- Minimize bundle size
- Optimize images
- Use code splitting
- Lazy load components
- Cache API responses

## Security

For security issues:
- Do NOT create a public issue
- Email: phillipmbanda@gmail.com
- Include detailed description
- Give us time to respond

## Questions?

- 📧 Email: phillipmbanda@gmail.com
- 💬 [GitHub Discussions](https://github.com/Philba100/agentboost/discussions)
- 🌐 Website: agentboost-seven.vercel.app

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- GitHub contributors page

Thank you for making AgentBoost better! 🚀
