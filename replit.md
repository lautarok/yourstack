# YourStack - IT Exam Platform

## Overview

YourStack is a frontend application built with Next.js (App Router) that simulates an IT exam platform. The application allows users to browse and take timed exams covering topics like JavaScript fundamentals, CSS & Web Design, and React components. The platform features a clean, modern UI with smooth animations and real-time countdown timers for exam sessions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Framework
- **Next.js 15 with App Router**: Utilizes the latest App Router architecture with a clear separation between Server Components (for data fetching and initial rendering) and Client Components (for interactivity)
- **TypeScript**: Strict type checking enabled for enhanced code quality and developer experience
- **Server-Side Rendering (SSR)**: Exam listings and initial page loads leverage SSR for optimal performance and SEO

### Styling Approach
- **Tailwind CSS**: Utility-first CSS framework configured with a custom design system
- **Design System**: Custom CSS variables defined in `globals.css` following shadcn/ui principles with HSL color values for background, foreground, primary, secondary, muted, accent, border, and ring colors
- **Theme Support**: Built-in light/dark mode support through CSS custom properties
- **Responsive Design**: Mobile-first approach using Tailwind's responsive utilities

### Component Architecture
- **Modular Component Structure**: 
  - `/components/ui`: Base UI components (Button, Card) that serve as building blocks
  - `/components/features`: Feature-specific components (ExamCard, Timer)
  - `/components/animation`: Animation wrappers for transitions
- **Encapsulation**: Each component is self-contained with clear props interfaces and single responsibility
- **Client vs Server**: Strategic use of "use client" directive only where interactivity is required (Timer, TransitionWrapper, exam page)

### Data Management
- **Static JSON Data Source**: All exam data stored in `/data` directory as JSON files
- **Two-Tier Data Structure**:
  - `exams-index.json`: Master index containing exam metadata (id, title, duration, file path)
  - Individual exam files (`uuid-exam-*.json`): Detailed question data for each exam
- **Data Service Layer**: `/lib/data-service.ts` provides typed async functions for data access, abstracting file system operations from components
- **Server-Side Data Loading**: Data fetching happens on the server using Node.js fs/promises module for optimal performance

### Routing Strategy
- **Route Groups**: `(main)` route group for main application layout
- **Dynamic Routes**: `/exams/[examId]` for individual exam pages using dynamic segments
- **API Routes**: `/api/exams/[examId]` endpoint provides exam data to client components via REST API pattern

### Animation System
- **Framer Motion**: Declarative animation library for smooth page and component transitions
- **TransitionWrapper Component**: Reusable wrapper that applies consistent entrance and exit animations with translateY (down on enter, up on exit), blur, and opacity effects
- **AnimatePresence**: Used for exit animations on page transitions and question changes within exams
- **Question Transitions**: Individual questions animate smoothly when navigating between them with mode='wait' to ensure one animation completes before the next begins
- **Performance**: All animations use GPU-accelerated properties (opacity, transform, filter) for smooth 60fps performance
- **Code Style**: All components use single quotes for strings and minimal semicolons per project conventions

### State Management
- **Local Component State**: React useState for client-side state (selected answers, exam results, loading states)
- **No Global State Library**: Application complexity doesn't warrant Redux/Zustand; props drilling is minimal and manageable
- **Server State**: Data fetching handled by Next.js server components and API routes

### Timer Implementation
- **Client-Side Timer**: Real-time countdown using React useEffect and setInterval
- **Visual Feedback**: Color-coded warnings (blue → yellow → red) as time runs low
- **Auto-Submit**: Callback mechanism to automatically submit exam when time expires

## External Dependencies

### Core Framework Dependencies
- **next (^15.5.4)**: React framework with App Router, SSR, and API routes
- **react (^19.1.1)** & **react-dom (^19.1.1)**: Core React library
- **typescript (^5.9.2)**: Static type checking

### Styling Dependencies
- **tailwindcss (^3.4.17)**: Utility-first CSS framework
- **autoprefixer (^10.4.21)**: PostCSS plugin for vendor prefixes
- **postcss (^8.5.6)**: CSS transformation tool

### Animation Dependencies
- **framer-motion (^12.23.22)**: Production-ready motion library for React

### Development Dependencies
- **@types/node**: TypeScript definitions for Node.js APIs
- **@types/react**: TypeScript definitions for React

### Build & Development Tools
- **Next.js Dev Server**: Hot module replacement for development
- **Next.js Build System**: Optimized production builds with automatic code splitting
- **TypeScript Compiler**: Type checking and transpilation

### File System Access
- **Node.js fs/promises**: Built-in module for async file operations (reading JSON data files)
- **Node.js path**: Built-in module for cross-platform file path resolution

### Font Loading
- **next/font/google**: Optimized Google Fonts loading (Inter font family)

### Future Considerations
- Application may benefit from a database (potentially PostgreSQL with Drizzle ORM) if exam data becomes dynamic or user-specific
- No authentication system currently implemented; would be needed for user accounts and progress tracking
- No external API integrations at present; all data is static and local