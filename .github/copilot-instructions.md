# GitHub Copilot Instructions

These instructions define how GitHub Copilot should assist with this project. The goal is to ensure consistent, high-quality code generation aligned with our conventions, stack, and best practices.

## 🧠 Context

- **Project Type**: Web App Frontend
- **Language**: TypeScript
- **Framework / Libraries**: Astro with React
- **Architecture**: MVC

## 🔧 General Guidelines

- Use TypeScript-idiomatic patterns.
- Always prefer named functions and avoid long anonymous closures.
- Add type annotations / interfaces where applicable.
- Use consistent indentation and formatting (Prettier/Black/gofmt/etc).
- Prefer readability over cleverness.

## 📁 File Structure

Use this structure as a guide when creating or updating files:

```text
src/
  controllers/
  services/
  repositories/
  types/
  utils/
tests/
  unit/
  integration/
```

## 🧶 Patterns

### ✅ Patterns to Follow

- Use Dependency Injection
- Error handling using custom error classes, status codes, try-catch blocks
- For UI:
- Components should be pure and reusable
- Avoid inline styling; use Tailwind

### 🚫 Patterns to Avoid

- Don't hardcode values; use config/env files.
- Avoid global state unless absolutely necessary.
- Don't expose secrets or keys.


## 🧩 Example Prompts

- `Copilot, create a REST endpoint using Express that retrieves all books from the books table.`
- `Copilot, generate a Zod schema for a user profile with optional avatar and required name/email.`
- `Copilot, implement a React hook to debounce a search input.`
- `Copilot, write a unit test for the calculatePrice() function using mocked dependencies.`

## 🔁 Iteration & Review

- Copilot output should be reviewed and modified before committing.
- If code isn’t following these instructions, regenerate with more context or split the task.
- Use comments to clarify intent before invoking Copilot.

## 📚 References

- [Link to style guide]
- [Link to framework docs]
- [Link to existing example files in the repo]
