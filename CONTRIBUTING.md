# Contributing to Polkadot Discovery Roulette

Thank you for your interest in contributing to Polkadot Discovery Roulette! This document provides guidelines for contributing to the project.

## How to Contribute

### Adding New Projects

The easiest way to contribute is by adding new quality projects to the discovery database:

1. **Fork the Repository**
   ```bash
   git clone https://github.com/yourusername/polkadot-discovery-roulette.git
   cd polkadot-discovery-roulette/event-platform
   ```

2. **Edit the Project Database**
   
   Open `src/data/projects.ts` and add your project:

   ```typescript
   {
     id: 'unique-project-id',
     name: 'Project Name',
     description: 'Clear, concise description of what the project does',
     category: 'Parachain' | 'DeFi' | 'NFT' | 'Developer Tools' | 'Infrastructure' | 'Governance',
     url: 'https://project-website.com',
     logo: 'https://link-to-logo.svg',
     tags: ['Tag1', 'Tag2', 'Tag3'],
   }
   ```

3. **Project Guidelines**
   
   Your project should:
   - Be part of the Polkadot/Kusama ecosystem
   - Have a working product or active development
   - Provide clear value to users or developers
   - Have an accessible website with documentation
   - Include a working logo URL (SVG or PNG preferred)

4. **Submit a Pull Request**
   
   ```bash
   git checkout -b add-project-name
   git add src/data/projects.ts
   git commit -m "feat: add [Project Name] to discovery database"
   git push origin add-project-name
   ```

### Code Contributions

For code contributions:

1. **Create an Issue First**
   - Describe the feature or bug
   - Wait for feedback from maintainers

2. **Follow the Code Style**
   - Use TypeScript for type safety
   - Follow existing code patterns
   - Add comments for complex logic
   - Run `npm run lint` before committing

3. **Test Your Changes**
   - Manually test all affected functionality
   - Ensure responsive design works
   - Check wallet connection flow
   - Verify randomness works correctly

4. **Write Clear Commit Messages**
   - `feat: add new feature`
   - `fix: resolve issue with...`
   - `docs: update README`
   - `style: improve UI component`

### Reporting Issues

When reporting issues:

1. **Check Existing Issues**: Search for similar issues first
2. **Provide Details**:
   - Clear description of the problem
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Browser/device information

3. **Use Issue Templates** (when available)

## Development Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Type checking
npm run type-check

# Lint code
npm run lint
```

## Project Categories

When adding projects, use these categories:

- **Parachain**: Layer-1 blockchains in Polkadot ecosystem
- **DeFi**: Decentralized finance protocols
- **NFT**: NFT platforms and marketplaces
- **Developer Tools**: SDKs, APIs, explorers, wallets
- **Infrastructure**: Bridges, oracles, indexers
- **Governance**: DAOs, voting platforms

## Quality Standards

All contributions must:

✅ Follow TypeScript best practices
✅ Be mobile responsive
✅ Maintain accessibility standards
✅ Include proper error handling
✅ Have clear, concise documentation
✅ Not introduce security vulnerabilities
✅ Not break existing functionality

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Provide constructive feedback
- Focus on the project's goals
- Follow GitHub's Community Guidelines

## Questions?

- Open a GitHub Discussion
- Join our Discord server
- Email the maintainers

Thank you for contributing to the Polkadot ecosystem! 🎉

