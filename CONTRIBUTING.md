# Contributing to CollabSpace 🤝

Thank you for your interest in contributing to CollabSpace! This document provides guidelines and instructions for contributing to this project.

## 🌟 How to Contribute

### Reporting Bugs 🐛

If you find a bug, please create an issue with:

- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Environment details (OS, browser, Node version)

### Suggesting Features 💡

We welcome feature suggestions! Please:

- Check if the feature already exists or is planned
- Describe the feature and its use case
- Explain why it would be valuable
- Provide examples or mockups if possible

### Pull Requests 🔄

1. **Fork the repository**
2. **Create a feature branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**

   - Follow the code style guidelines
   - Write clear commit messages
   - Add tests if applicable
   - Update documentation

4. **Test your changes**

   ```bash
   npm run lint
   npm run test
   ```

5. **Commit with conventional commits**

   ```bash
   git commit -m "feat: add new feature"
   git commit -m "fix: resolve bug in OT engine"
   git commit -m "docs: update README"
   ```

6. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

## 📝 Code Style Guidelines

### TypeScript

- Use TypeScript for all new files
- Define proper interfaces and types
- Avoid `any` type when possible
- Use meaningful variable names

```typescript
// ✅ Good
interface DocumentProps {
  id: string;
  title: string;
  content: QuillDelta;
}

// ❌ Bad
interface Props {
  a: any;
  b: string;
}
```

### React Components

- Use functional components with hooks
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use proper TypeScript props

```typescript
// ✅ Good
interface ButtonProps {
  variant: "primary" | "secondary";
  onClick: () => void;
  children: React.ReactNode;
}

export function Button({ variant, onClick, children }: ButtonProps) {
  return (
    <button className={cn(styles[variant])} onClick={onClick}>
      {children}
    </button>
  );
}
```

### File Naming

- Components: `PascalCase.tsx` (e.g., `DocumentEditor.tsx`)
- Utilities: `camelCase.ts` (e.g., `formatDate.ts`)
- API routes: `route.ts` (Next.js convention)
- Types: `index.ts` in `types/` folder

### CSS/Tailwind

- Use Tailwind utility classes
- Create reusable components for repeated patterns
- Use the `cn()` utility for conditional classes
- Follow mobile-first responsive design

```typescript
// ✅ Good
<div className={cn(
  "px-4 py-2 rounded-lg",
  variant === 'primary' && "bg-indigo-600 text-white",
  variant === 'secondary' && "bg-gray-200 text-gray-900"
)} />

// ❌ Bad
<div className="px-4 py-2 rounded-lg bg-indigo-600 text-white bg-gray-200 text-gray-900" />
```

## 🏗️ Project Structure

```
CollabSpace/
├── app/              # Next.js pages and layouts
├── components/       # React components
│   ├── ui/          # Reusable UI components
│   ├── workspace/   # Workspace-specific components
│   └── document/    # Document-specific components
├── lib/             # Utility functions and services
├── models/          # Database models
├── server/          # Socket.io server
├── types/           # TypeScript type definitions
└── public/          # Static assets
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run E2E tests
npm run test:e2e
```

### Writing Tests

- Write tests for new features
- Test edge cases and error handling
- Use descriptive test names

```typescript
describe("OperationalTransform", () => {
  it("should transform insert operations correctly", () => {
    const opA = { type: "insert", position: 5, text: "hello" };
    const opB = { type: "insert", position: 3, text: "world" };

    const result = OperationalTransform.transform(opA, opB);

    expect(result.position).toBe(10); // Shifted by opB's length
  });
});
```

## 📚 Documentation

- Update README.md for new features
- Add JSDoc comments for complex functions
- Update QUICKSTART.md if setup changes
- Create examples for new components

```typescript
/**
 * Transform an operation against a list of concurrent operations
 * @param operation - The operation to transform
 * @param operations - List of concurrent operations
 * @returns The transformed operation
 */
export function transformAgainstList(
  operation: Operation,
  operations: Operation[]
): Operation {
  // Implementation
}
```

## 🔍 Code Review Process

All submissions require review. We use GitHub pull requests for this purpose.

**Reviewers will check:**

- Code quality and style
- Test coverage
- Documentation updates
- Performance implications
- Security considerations

## 🚀 Release Process

1. Update version in `package.json`
2. Update CHANGELOG.md
3. Create a release tag
4. Deploy to production

## 🎯 Priority Areas

We're especially looking for contributions in:

1. **Authentication System** - NextAuth.js integration
2. **Document Editor** - Quill.js with real-time collaboration
3. **Workspace UI** - Dashboard and management interfaces
4. **Testing** - Unit and E2E tests
5. **Documentation** - Tutorials and guides

## 💬 Communication

- **Issues** - Bug reports and feature requests
- **Discussions** - General questions and ideas
- **Pull Requests** - Code contributions

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 🙏 Thank You!

Every contribution, no matter how small, is valuable and appreciated!

---

**Happy Contributing! 🎉**
