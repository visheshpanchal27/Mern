# Mobile-Only MERN E-Commerce Frontend

A dedicated mobile-first React frontend for the MERN e-commerce application, optimized exclusively for mobile devices.

## Features

- **Mobile-First Design**: Built specifically for small screens (375px-414px)
- **Touch-Optimized**: Large touch targets, swipe gestures, and mobile interactions
- **Bottom Navigation**: Native mobile app-like navigation
- **Responsive Components**: All components designed for mobile viewports only
- **Real-time Search**: Debounced search with instant results
- **Cart Management**: Mobile-optimized shopping cart with quantity controls
- **User Authentication**: Mobile-friendly login/register forms
- **Product Browsing**: Grid layouts optimized for mobile screens

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Mobile-first styling
- **Redux Toolkit** - State management
- **React Router** - Navigation
- **Framer Motion** - Animations
- **React Icons** - Icon library

## Getting Started

1. **Install Dependencies**
   ```bash
   cd mobile-frontend
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```
   The app will run on `http://localhost:3001`

3. **Ensure Backend is Running**
   Make sure your MERN backend is running on `http://localhost:5000`

## Mobile-Specific Features

### Bottom Navigation
- Fixed bottom navigation bar
- Badge indicators for cart items
- Active state highlighting

### Touch Interactions
- Large touch targets (44px minimum)
- Active scale animations
- Swipe-friendly interfaces

### Mobile Layouts
- Single column layouts
- Full-width components
- Optimized spacing for thumbs

### Performance
- Lazy loading
- Debounced search
- Optimized images
- Minimal bundle size

## API Integration

Uses the same backend APIs as the main frontend:
- Products API
- User Authentication
- Cart Management
- Order Processing

## Viewport Optimization

Designed for mobile viewports:
- iPhone SE: 375px
- iPhone 12/13: 390px  
- iPhone 12/13 Pro Max: 428px
- Android phones: 360px-414px

## Build for Production

```bash
npm run build
```

## Deployment

The mobile frontend can be deployed separately from the main frontend, allowing for:
- Mobile-specific optimizations
- Different deployment strategies
- A/B testing between mobile and desktop experiences