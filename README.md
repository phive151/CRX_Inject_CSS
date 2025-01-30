# Hover Border Animation Extension

A Chrome extension that adds beautiful animated gradient borders to any element on hover. Features multiple animation styles including rainbow, neon, cyber, fire, gold, and ocean effects.

![Extension Demo](demo.gif)

## Features

- 🎨 6 Unique Border Styles
  - Rainbow
  - Neon
  - Cyber
  - Fire
  - Gold
  - Ocean
- ✨ Smooth hover transitions
- 🎯 Works on any element
- ⌨️ Keyboard shortcut (Alt+Shift+B)
- 🔄 Easy to toggle on/off
- 🖥️ Works on any website

## Installation

### From Source

1. Clone the repository

```bash
git clone https://github.com/phive151/hover-border-extension
cd hover-border-extension
```

2. Install dependencies

```bash
pnpm install
```

3. Build the extension

```bash
pnpm run build
```

4. Load in Chrome
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" in the top right
   - Click "Load unpacked"
   - Select the `dist` folder from the project

## Usage

1. Click the extension icon in your Chrome toolbar
2. Select an animation style
3. Hover over any element on the webpage to see the animated border
4. Use Alt+Shift+B to quickly toggle the effect
5. Click "Reset Animation" to disable

## Development

### Prerequisites

- Node.js (v14 or higher)
- npm or pnpm

### Setup

```bash
# Install dependencies
pnpm install

# Start development server
pnpm run dev

# Build for production
pnpm run build
```

### Project Structure

```
├── src/
│   ├── popup.css      # Extension popup styles
│   ├── Popup.jsx      # Main popup component
│   ├── popup.html     # Popup HTML template
│   └── index.jsx      # Entry point
├── manifest.json      # Extension manifest
└── vite.config.js     # Build configuration
```

## Tech Stack

- [SolidJS](https://solidjs.com) - UI Framework
- [TailwindCSS](https://tailwindcss.com) - Styling
- [DaisyUI](https://daisyui.com) - Component Library
- [Vite](https://vitejs.dev) - Build Tool

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by modern UI hover effects
- Built with SolidJS and Chrome Extensions API
- Thanks to all contributors!

```bash
$ pnpm install # or npm install or yarn install
```

### Learn more on the [Solid Website](https://solidjs.com) and come chat with us on our [Discord](https://discord.com/invite/solidjs)

## Available Scripts

In the project directory, you can run:

### `pnpm run dev`

Runs the app in the development mode.<br>
Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

### `pnpm run build`

Builds the app for production to the `dist` folder.<br>
It correctly bundles Solid in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

## Deployment

Learn more about deploying your application with the [documentations](https://vite.dev/guide/static-deploy.html)
