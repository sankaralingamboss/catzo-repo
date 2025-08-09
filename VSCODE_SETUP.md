# 🚀 VS Code Setup Guide for Catzo Pet Shop

## 📋 REQUIRED VS CODE EXTENSIONS

### **Essential Extensions (Must Install):**
```
1. ES7+ React/Redux/React-Native snippets
   - Extension ID: dsznajder.es7-react-js-snippets
   - Provides React code snippets

2. TypeScript Importer
   - Extension ID: pmneo.tsimporter
   - Auto imports TypeScript modules

3. Tailwind CSS IntelliSense
   - Extension ID: bradlc.vscode-tailwindcss
   - Tailwind CSS autocomplete

4. Auto Rename Tag
   - Extension ID: formulahendry.auto-rename-tag
   - Automatically rename paired HTML/JSX tags

5. Bracket Pair Colorizer 2
   - Extension ID: CoenraadS.bracket-pair-colorizer-2
   - Colorize matching brackets

6. GitLens
   - Extension ID: eamodio.gitlens
   - Git integration and history

7. Prettier - Code formatter
   - Extension ID: esbenp.prettier-vscode
   - Code formatting

8. ESLint
   - Extension ID: dbaeumer.vscode-eslint
   - JavaScript/TypeScript linting
```

### **Recommended Extensions:**
```
9. Thunder Client
   - Extension ID: rangav.vscode-thunder-client
   - API testing (for Supabase APIs)

10. Error Lens
    - Extension ID: usernamehw.errorlens
    - Inline error highlighting

11. Auto Close Tag
    - Extension ID: formulahendry.auto-close-tag
    - Auto close HTML/JSX tags

12. Path Intellisense
    - Extension ID: christian-kohler.path-intellisense
    - File path autocomplete
```

## ⚙️ VS CODE SETTINGS

Create `.vscode/settings.json` in your project:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "emmet.includeLanguages": {
    "javascript": "javascriptreact",
    "typescript": "typescriptreact"
  },
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

## 🔧 SETUP STEPS

### 1. Install Node.js
```bash
# Download from https://nodejs.org/
# Verify installation
node --version
npm --version
```

### 2. Open Project in VS Code
```bash
# Navigate to project folder
cd catzo-pet-shop

# Open in VS Code
code .
```

### 3. Install Dependencies
```bash
# Install all packages
npm install
```

### 4. Install VS Code Extensions
- Open Extensions panel (Ctrl+Shift+X)
- Search and install each extension listed above
- Restart VS Code after installation

### 5. Start Development
```bash
# Start development server
npm run dev
```

## 🐛 TROUBLESHOOTING

### If TypeScript Errors:
```bash
# Restart TypeScript server
Ctrl+Shift+P → "TypeScript: Restart TS Server"
```

### If Import Errors:
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### If Port Issues:
```bash
# Use different port
npm run dev -- --port 3001
```

### If Build Errors:
```bash
# Check build
npm run build
```

## ✅ VERIFICATION CHECKLIST

After setup, verify:
- [ ] No red underlines in code
- [ ] TypeScript intellisense working
- [ ] Tailwind CSS autocomplete working
- [ ] App runs without errors
- [ ] Hot reload working
- [ ] All extensions active

## 🎯 QUICK START COMMANDS

```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check

# Linting
npm run lint
```

Your VS Code is now perfectly configured for React + TypeScript + Tailwind development! 🚀