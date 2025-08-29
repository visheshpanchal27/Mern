# Theme Guide - MERN E-Commerce

## Overview
This project uses a consistent dark theme with pink/purple accents throughout the entire application.

## Color Palette

### Background Colors
- **Primary Background**: `#0f0f10` - Main page background
- **Secondary Background**: `#1A1A1A` - Cards, modals, components
- **Tertiary Background**: `#121212` - Image containers, inputs

### Brand Colors
- **Primary Pink**: `#ec4899` (pink-500) - Main brand color
- **Secondary Pink**: `#be185d` (pink-700) - Hover states
- **Purple Accent**: `#a855f7` (purple-500) - Gradients
- **Brand Gradient**: `from-pink-600 to-purple-600`

### Text Colors
- **Primary Text**: `#ffffff` - Main headings, important text
- **Secondary Text**: `#CFCFCF` - Descriptions, secondary content
- **Muted Text**: `#9CA3AF` - Placeholders, disabled states

## CSS Classes

### Buttons
```css
.btn-primary - Main action buttons (pink gradient)
.btn-secondary - Secondary buttons (gray)
.btn-outline - Outline buttons (pink border)
```

### Cards
```css
.card-primary - Main cards with dark background
.card-secondary - Glass effect cards with backdrop blur
```

### Inputs
```css
.input-primary - Standard form inputs
.input-error - Error state inputs
```

## Tailwind Classes

### Commonly Used Classes
- `bg-background-primary` - Main background
- `bg-background-secondary` - Card backgrounds
- `text-primary-500` - Brand pink text
- `border-gray-800` - Subtle borders
- `hover:scale-105` - Hover animations

### Gradient Combinations
- `bg-gradient-to-r from-pink-600 to-purple-600`
- `bg-gradient-to-br from-gray-900/80 to-gray-800/80`

## Component Usage

### Using UI Components
```jsx
import { Button, Card, Input } from '../components/ui';

// Primary button
<Button variant="primary">Click Me</Button>

// Secondary button  
<Button variant="secondary">Cancel</Button>

// Card with hover effect
<Card variant="primary" hover={true}>
  Content here
</Card>

// Input with label and error
<Input 
  label="Email" 
  error="Invalid email"
  type="email" 
/>
```

### Consistent Styling Patterns

#### Product Cards
- Use `card-primary` class
- Pink accent colors for prices
- Hover scale effect: `hover:scale-[1.02]`

#### Navigation
- Dark background with backdrop blur
- Pink hover states
- Smooth transitions

#### Forms
- Dark inputs with pink focus rings
- Consistent spacing and typography
- Error states in red

## Animation Guidelines

### Framer Motion
- Use consistent transition durations (0.3s for quick, 0.6s for slower)
- Scale animations: 1.02 for subtle, 1.05 for prominent
- Fade in animations with slight Y offset (20px)

### CSS Transitions
- Standard duration: `transition-all duration-300`
- Hover effects should be subtle and smooth
- Use `ease-out` for natural feeling animations

## Best Practices

1. **Consistency**: Always use the defined theme classes
2. **Accessibility**: Maintain proper contrast ratios
3. **Responsiveness**: Use responsive variants (sm:, md:, lg:)
4. **Performance**: Use CSS variables for dynamic theming
5. **Maintainability**: Import from centralized theme files

## File Structure
```
src/
├── styles/
│   ├── theme.js          # Theme configuration
│   └── responsive.css    # Responsive utilities
├── components/
│   └── ui/              # Reusable UI components
│       ├── Button.jsx
│       ├── Card.jsx
│       ├── Input.jsx
│       └── index.js
└── index.css            # Global styles and CSS variables
```

## Usage Examples

### Page Layout
```jsx
<div className="min-h-screen bg-background-primary text-white">
  <Card variant="primary" className="p-6">
    <h1 className="text-2xl font-bold mb-4">Page Title</h1>
    <Button variant="primary">Action Button</Button>
  </Card>
</div>
```

### Form Example
```jsx
<form className="space-y-4">
  <Input label="Name" placeholder="Enter your name" />
  <Input label="Email" type="email" />
  <Button variant="primary" type="submit">
    Submit
  </Button>
</form>
```

This theme system ensures consistency across your entire MERN e-commerce application while maintaining flexibility for future updates.