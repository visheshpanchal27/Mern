// Centralized theme configuration for consistent styling across the app
export const theme = {
  // Color Palette
  colors: {
    // Background colors
    background: {
      primary: '#0f0f10',
      secondary: '#1A1A1A', 
      tertiary: '#121212',
      card: '#1A1A1A',
      modal: '#000000',
      overlay: 'rgba(0, 0, 0, 0.8)'
    },
    
    // Brand colors
    brand: {
      primary: '#ec4899', // pink-500
      secondary: '#be185d', // pink-700
      accent: '#a855f7', // purple-500
      gradient: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)'
    },
    
    // Text colors
    text: {
      primary: '#ffffff',
      secondary: '#CFCFCF',
      muted: '#9CA3AF',
      accent: '#ec4899'
    },
    
    // Status colors
    status: {
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      info: '#3b82f6'
    },
    
    // Border colors
    border: {
      primary: '#374151',
      secondary: '#6b7280',
      accent: '#ec4899'
    }
  },
  
  // Typography
  typography: {
    fontFamily: {
      primary: 'Inter, system-ui, sans-serif',
      mono: 'JetBrains Mono, monospace'
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem', 
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem'
    }
  },
  
  // Spacing
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem'
  },
  
  // Border radius
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px'
  },
  
  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
  },
  
  // Component styles
  components: {
    button: {
      primary: 'bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-medium rounded-lg px-4 py-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105',
      secondary: 'bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg px-4 py-2 transition-all duration-300 border border-gray-600 hover:border-gray-500',
      outline: 'border-2 border-pink-600 text-pink-600 hover:bg-pink-600 hover:text-white font-medium rounded-lg px-4 py-2 transition-all duration-300'
    },
    
    card: {
      primary: 'bg-[#1A1A1A] rounded-xl shadow-lg border border-gray-800 transition-all duration-300 hover:shadow-xl',
      secondary: 'bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-700'
    },
    
    input: {
      primary: 'bg-gray-800 border border-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300',
      error: 'bg-gray-800 border border-red-500 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent'
    }
  }
};

// CSS custom properties for dynamic theming
export const cssVariables = `
  :root {
    --bg-primary: ${theme.colors.background.primary};
    --bg-secondary: ${theme.colors.background.secondary};
    --bg-tertiary: ${theme.colors.background.tertiary};
    --text-primary: ${theme.colors.text.primary};
    --text-secondary: ${theme.colors.text.secondary};
    --brand-primary: ${theme.colors.brand.primary};
    --brand-secondary: ${theme.colors.brand.secondary};
    --border-primary: ${theme.colors.border.primary};
  }
`;