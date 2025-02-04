# Animated Border Studio

A powerful Chrome extension for creating, customizing, and applying stunning animated gradient borders. Built with SolidJS and modern color science.

![Extension Demo](demo.gif)

## Overview

This extension provides a professional-grade tool for creating and managing animated gradient borders using modern color spaces and animation techniques. Perfect for designers, developers, and anyone looking to add engaging hover effects to their web elements.

## Core Features

### 1. Gradient Creation Studio
- **Advanced Color Control**: OKLCH color space for perceptually uniform gradients
- **Multiple Interpolation Modes**: OKLCH, Oklab, sRGB, HSL, and more
- **Custom Animation Controls**: Duration, blur, opacity, spread, and border width
- **Live Preview**: Real-time visualization of your gradient effects

### 2. Gradient Management
- **Save & Organize**: Store your custom gradients with tags
- **Smart Search**: Find gradients by name or tags
- **Import/Export**: Share your gradient collections
- **Custom Tags**: Create and manage your own categorization system

### 3. DaisyUI Integration
- **Component Preview**: Test gradients on various DaisyUI components
- **Theme Support**: Preview with different DaisyUI themes
- **Responsive Design**: Adapts to your workspace

### 4. Preset Styles
- 🌈 Rainbow
- 💫 Neon
- 🤖 Cyber
- 🔥 Fire
- ✨ Gold
- 🌊 Ocean

## Technical Details

### Architecture

```
src/
├── pages/
│   ├── options/           # Extension options page
│   │   ├── components/    # Reusable UI components
│   │   └── sections/      # Main feature sections
│   └── popup/            # Quick access popup
├── styles/               # Global styles
└── utils/               # Helper functions
```

### Technology Stack

- **Framework**: [SolidJS](https://solidjs.com) - Reactive UI framework
- **Styling**: 
  - [Tailwind CSS v4](https://tailwindcss.com) - Utility-first CSS
  - [DaisyUI](https://daisyui.com) - Component library
- **Color Science**:
  - OKLCH color space
  - Perceptually uniform gradients
  - Multiple interpolation modes
- **Build Tools**: [Vite](https://vitejs.dev)

## Installation

### For Users

1. Visit the Chrome Web Store (link coming soon)
2. Click "Add to Chrome"
3. Access via the extension icon or Alt+Shift+B

### For Developers

```bash
# Clone the repository
git clone https://github.com/yourusername/animated-border-studio
cd animated-border-studio

# Install dependencies
pnpm install

# Start development
pnpm run dev

# Build for production
pnpm run build
```

#### Loading in Chrome

1. Open `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `dist` folder

## Development

### Prerequisites

- Node.js 16+
- pnpm (recommended) or npm
- Chrome browser

### Commands

```bash
# Development with hot reload
pnpm run dev

# Production build
pnpm run build

# Run tests
pnpm run test

# Lint code
pnpm run lint
```

### Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## Credits

### Core Team
- [Your Name] - Project Lead
- [Contributor Names]

### Special Thanks
- [SolidJS Team](https://solidjs.com)
- [Tailwind CSS Team](https://tailwindcss.com)
- [DaisyUI Team](https://daisyui.com)

### Inspiration
- Modern color science research
- Web animation techniques
- Community feedback

## License

This project is licensed under the GNU General Public License v3.0 - see [LICENSE](LICENSE) for details.

## Support

- 📖 [Documentation](docs/README.md)
- 🐛 [Issue Tracker](https://github.com/yourusername/animated-border-studio/issues)
- 💬 [Discussions](https://github.com/yourusername/animated-border-studio/discussions)
- 📧 [Contact Us](mailto:your.email@example.com)

---

<p align="center">Made with ❤️ by the Animated Border Studio team</p>
