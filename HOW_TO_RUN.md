# How to Run This Portfolio Website

## Prerequisites
- Node.js (version 14 or higher)
- npm (comes with Node.js)

## Step-by-Step Instructions

### 1. Install Dependencies ✓ (Already completed)
```bash
npm install
```
This command has already been executed and installed 1412 packages successfully.

### 2. Run the Development Server
```bash
npm start
```
This will:
- Start the React development server
- Open your browser automatically at http://localhost:3000
- Enable hot-reloading (changes will appear automatically)

### 3. Build for Production (Optional)
```bash
npm run build
```
Creates an optimized production build in the `build/` folder.

### 4. Run Tests (Optional)
```bash
npm test
```
Runs the test suite in interactive watch mode.

To run tests once without watch mode:
```bash
npm test -- --watchAll=false
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Runs the app in development mode |
| `npm test` | Runs the test suite |
| `npm run build` | Builds the app for production |
| `npm run eject` | Ejects from Create React App (one-way operation) |

## Troubleshooting

### Port 3000 is already in use
If port 3000 is already occupied, you can:
- Stop the other application using port 3000
- Or the development server will prompt you to use a different port

### Dependencies installation issues
If you encounter issues, try:
```bash
rm -rf node_modules package-lock.json
npm install
```

## Next Steps

1. **Start the development server**: `npm start`
2. **Open your browser**: Navigate to http://localhost:3000
3. **Make changes**: Edit files in the `src/` folder
4. **See updates**: The browser will automatically reload

Enjoy your portfolio website! 🚀
