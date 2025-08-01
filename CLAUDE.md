# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server (Next.js)
- `npm run build` - Build production version
- `npm start` - Start production server
- `npm run lint` - Run ESLint linting

The project uses Next.js 13.5.4 with the App Router architecture.

## Project Architecture

This is a Zeratype company portfolio website built with Next.js that showcases media building services and project portfolio.

### Key Technologies
- **Next.js 13** - React framework with App Router
- **React Three Fiber** - 3D graphics in React
- **Framer Motion** - Animation library
- **SASS** - CSS preprocessor
- **Number Flow** - Animated number displays

### Project Structure
- `src/app/` - Next.js App Router pages and layout
- `src/components/` - React components
  - `Navbar.jsx` - Navigation component (desktop only)
  - `floatingShape/` - 3D floating shapes component using Three.js
- `public/` - Static assets including fonts, images, and 3D models

### Main Features
1. **Hero Section** - 3D floating shapes with mouse interaction (desktop) and touch interaction (mobile)
2. **Media Building** - Animated KPI counters showing creator metrics
3. **Project Portfolio** - Grid of client projects with animated stats
4. **Contact Section** - Company contact information and social links

### Responsive Design
- Desktop navigation via Navbar component
- Mobile hamburger menu integrated in main page
- Portrait/landscape orientation detection
- Responsive 3D camera zoom adjustments

### Content Sections
The main page contains scrollable sections:
- Hero with 3D shapes
- Media Building with animated metrics
- "Hecho Con Zeratype" project showcase
- Contact information

### Asset Organization
- `public/fonts/` - Custom fonts (Inter, InterTight, SpecialGothic)
- `public/image/` - Project logos and headers
- `public/medias/` - 3D models (.glb) and brand assets
- `public/textures/` - 3D texture files

### Animation Features
- Mouse-following 3D shapes
- Animated number counters for metrics
- Scroll-based hamburger menu fade
- Framer Motion transitions throughout