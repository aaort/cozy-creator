# Cozy Creator

A modern, responsive media gallery application built with React and TypeScript, featuring virtualized scrolling for optimal performance and a sleek UI for browsing images and videos.

## 🛠️ Technologies & Tools

### Core Technologies

- **React 19.1.0** - UI library for building user interfaces
- **TypeScript 5.8.3** - Type-safe JavaScript
- **Vite 6.3.5** - Fast build tool and development server
- **React Router DOM 7.6.2** - Client-side routing

### UI & Styling

- **Tailwind CSS 4.1.10** - Utility-first CSS framework
- **Radix UI** - Unstyled, accessible UI components
- **Lucide React** - Icon library
- **clsx & tailwind-merge** - Utility libraries for dynamic class names
- **class-variance-authority** - Component variant management

### Performance Optimization

- **react-window** - Virtualized list rendering for performance
- **react-window-infinite-loader** - Infinite scrolling support

### Development Tools

- **ESLint** - Code linting
- **pnpm** - Fast, disk space efficient package manager

## ✨ Features

### 📸 Live Feed Page (`/`)

- Virtualized image grid with infinite scrolling
- Responsive layout that adapts to different screen sizes
- Optimized image loading with lazy loading
- Smooth scrolling with dynamic header spacing

### 🎥 Videos Page (`/videos`)

- Grid layout for video thumbnails
- Click-to-play video modal
- Fixed 16:9 aspect ratio for consistent layout
- Infinite scrolling with pagination

### 🖼️ Media Modal

- Full-screen media viewer for both images and videos
- Navigation between items without closing the modal
- Video playback controls (play/pause)
- Smooth animations and transitions
- Display of media metadata (dimensions, title)

### ✨ Generate FAB (Floating Action Button)

- Quick access button for image generation
- Modal interface for entering image descriptions
- Keyboard shortcut support
- _Note: Image generation backend integration pending_

### 🎨 UI/UX Features

- Glass morphism effects on modals
- Smooth animations and transitions
- Responsive design for all screen sizes
- Dark mode support
- Accessible component design

## ⌨️ Keyboard Shortcuts

### Global Shortcuts

| Shortcut       | Action                      |
| -------------- | --------------------------- |
| `Cmd/Ctrl + K` | Toggle Generate Image modal |
| `Escape`       | Close any open modal        |

### Media Modal Navigation

| Key             | Action              |
| --------------- | ------------------- |
| `←` Arrow Left  | Previous media item |
| `→` Arrow Right | Next media item     |
| `Space`         | Play/Pause video    |
| `Escape`        | Close modal         |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm 10.12.1 or higher

### Installation

1. Clone the repository:

```bash
git clone [repository-url]
cd cozy-creator
```

2. Install dependencies:

```bash
pnpm install
```

3. Start the development server:

```bash
pnpm dev
```

4. Build for production:

```bash
pnpm build
```

5. Preview production build:

```bash
pnpm preview
```

## 📦 Deployment

### Vercel Deployment

The project is configured for Vercel deployment with SPA routing support. The `vercel.json` configuration ensures proper handling of client-side routes.

1. Push your code to a Git repository
2. Import the project to Vercel
3. Deploy (Vercel will automatically detect Vite configuration)

### Manual Deployment

For other platforms, ensure your server is configured to:

- Serve `index.html` for all routes (SPA routing)
- Set proper headers for static assets
- Enable CORS if serving media from different domains

## 📁 Project Structure

```
cozy-creator/
├── src/
│   ├── components/
│   │   ├── layout/          # Layout components (Header)
│   │   └── ui/              # Reusable UI components
│   │       ├── generate/    # Generate FAB component
│   │       ├── media-modal/ # Media viewer modal
│   │       └── virtualized-grid/ # Performance-optimized grids
│   ├── constants/           # App constants
│   ├── data/               # Static data (video metadata)
│   ├── lib/                # Utility functions
│   ├── pages/              # Page components
│   │   ├── live-feed.tsx   # Image gallery page
│   │   └── videos.tsx      # Video gallery page
│   └── types/              # TypeScript type definitions
├── public/                 # Static assets
├── scripts/                # Build/utility scripts
└── vercel.json            # Vercel deployment config
```

## 🔧 Configuration

### Environment Variables

Currently, the app uses hardcoded URLs for media content. To make it configurable:

```env
# .env.local (create this file)
VITE_STATIC_IMAGE_URL=your-image-cdn-url
VITE_VIDEO_CDN_URL=your-video-cdn-url
```

## 📝 What's Missing / TODO

### High Priority

- [ ] **Image Generation Backend Integration** - The Generate FAB UI is complete but needs backend API integration
- [ ] **Search Functionality** - Add ability to search/filter media items
- [ ] **User Authentication** - If needed for personalized content
- [ ] **Upload Functionality** - Allow users to upload their own media

### Medium Priority

- [ ] **Favorites/Collections** - Save and organize media
- [ ] **Share Functionality** - Share media items via URL
- [ ] **Tags/Categories** - Organize media by tags
- [ ] **Settings Panel** - User preferences (theme, layout options)
- [ ] **Progressive Web App (PWA)** - Offline support and installability

### Nice to Have

- [ ] **Keyboard Navigation Grid** - Navigate grid items with arrow keys
- [ ] **Zoom Controls** - Pinch-to-zoom on mobile, zoom controls on desktop
- [ ] **EXIF Data Display** - Show camera settings for photos
- [ ] **Download Options** - Multiple resolution options
- [ ] **Slideshow Mode** - Auto-advance through media
- [ ] **Performance Metrics** - Loading time analytics
- [ ] **Accessibility Improvements** - Screen reader optimization
- [ ] **Multi-language Support** - i18n implementation

### Technical Improvements

- [ ] **Error Boundaries** - Better error handling
- [ ] **Loading States** - Skeleton screens for better UX
- [ ] **Unit Tests** - Component testing with Vitest
- [ ] **E2E Tests** - Playwright or Cypress tests
- [ ] **Performance Monitoring** - Web vitals tracking
- [ ] **SEO Optimization** - Meta tags, sitemap
- [ ] **API Layer** - Centralized API client
- [ ] **State Management** - Consider Redux/Zustand for complex state

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Icons provided by [Lucide React](https://lucide.dev)
- UI components inspired by [shadcn/ui](https://ui.shadcn.com)
- Performance optimization patterns from [react-window](https://react-window.vercel.app)
