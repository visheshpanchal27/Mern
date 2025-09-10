# MERN E-Commerce Project

[**🌐 Live Demo**](https://shopping-canter.netlify.app/)

A full-stack E-Commerce application built with the MERN stack (MongoDB, Express.js, React, Node.js). Features include user authentication, product management, order processing, admin dashboard, and more.

---

## Table of Contents

- [Project Structure](#project-structure)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [Access the App](#access-the-app)
- [Scripts](#scripts)
- [Technologies Used](#technologies-used)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Folder Structure](#folder-structure)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Contact](#contact)
- [License](#license)
- [Notes](#notes)

---

## Project Structure

```
mern1/
  backend/
    controllers/
    middlewares/
    models/
    routes/
    config/
    utils/
    .env
    index.js
    package.json
  frontend/
    src/
      components/
      pages/
      redux/
      Utils/
      App.jsx
      main.jsx
      index.css
    .env
    index.html
    package.json
    tailwind.config.js
    vite.config.js
```

---

## Features

- **User Authentication** (JWT, Google OAuth) with enhanced security
- **Product Catalog** with categories, reviews, ratings, favorites
- **Shopping Cart** and Checkout (PayPal, Cash on Delivery)
- **Order Management** for users and admins
- **Admin Dashboard**: manage users, products, categories, orders
- **Responsive UI** with Tailwind CSS and Vite
- **API Proxy** for backend requests
- **🔒 Advanced Security**: XSS protection, IP blocking, progressive rate limiting
- **⚡ Performance Optimized**: Database pooling, API caching, React optimization
- **🛡️ Security Headers**: Helmet.js integration, comprehensive protection
- **📊 Real-time Monitoring**: System metrics, error tracking, health checks
- **🌐 Internationalization**: Multi-language support with i18next
- **🚨 Advanced Error Handling**: Custom error classes, structured logging

---

## Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB database (local or cloud)
- [Optional] PayPal & Google OAuth credentials

### Backend Setup

1. Navigate to the backend folder:
   ```sh
   cd backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file (see `.env.example` if available) with:
   ```
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_URL=your_cloudinary_url
   ```
4. Start the backend server:
   ```sh
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend folder:
   ```sh
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file with:
   ```
   VITE_API_URL=https://mernbackend-tmp5.onrender.com/api
   VITE_GOOGLE_CLIENT_ID=your_google_client_id
   ```
4. Start the frontend:
   ```sh
   npm run dev
   ```

### Access the App

- Frontend: [https://shopping-canter.netlify.app](https://shopping-canter.netlify.app)
- Backend API: [https://mernbackend-tmp5.onrender.com/api](https://mernbackend-tmp5.onrender.com/api)

---

## Scripts

- `npm run dev` — Start development server (frontend or backend)
- `npm run build` — Build frontend for production

---

## Technologies Used

- **Frontend:** React, Redux Toolkit, Tailwind CSS, Vite, Framer Motion, React Router, PayPal, Google OAuth
- **Backend:** Node.js, Express.js, MongoDB, Mongoose, Cloudinary
- **Security:** Helmet.js, bcryptjs, express-validator, DOMPurify, CSRF protection, XSS prevention
- **Performance:** API caching, database pooling, React optimization, progressive rate limiting
- **Monitoring:** Real-time metrics, error tracking, health checks, system monitoring
- **Internationalization:** i18next, multi-language support, translation management
- **Other:** JWT, dotenv, ESLint, Multer (secure file uploads), advanced error handling

---

## API Endpoints

### Users
- `POST /api/users/register` — Register a new user
- `POST /api/users/auth` — Login user
- `PUT /api/users/profile` — Update user profile
- `GET /api/users` — Get all users (admin)
- `DELETE /api/users/:id` — Delete user (admin)

### Products
- `GET /api/products` — List products
- `POST /api/products` — Add product (admin)
- `PUT /api/products/:id` — Update product (admin)
- `DELETE /api/products/:id` — Delete product (admin)
- `POST /api/products/:id/reviews` — Add review (auth)

### Categories
- `GET /api/category` — List categories
- `POST /api/category` — Add category (admin)
- `PUT /api/category/:id` — Update category (admin)
- `DELETE /api/category/:id` — Delete category (admin)

### Orders
- `POST /api/orders` — Create order
- `GET /api/orders/:id` — Get order details
- `PUT /api/orders/:id/pay` — Pay order
- `PUT /api/orders/:id/deliver` — Mark as delivered (admin)
- `GET /api/orders/myorders` — User's orders

### Uploads
- `POST /api/uploads` — Upload product image (admin)

---

## Environment Variables

### Backend (`backend/.env`)
```
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_super_secure_jwt_secret_minimum_32_characters
CLOUDINARY_URL=your_cloudinary_url
NODE_ENV=production
PORT=5000
```

**Security Note:** Use a strong JWT secret (minimum 32 characters) for production.

### Frontend (`frontend/.env`)
```
VITE_API_URL=https://mernbackend-tmp5.onrender.com/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

---

## Folder Structure

- `backend/` — Express API, MongoDB models, controllers, routes, config
- `frontend/` — React app, Redux Toolkit, components, pages, API slices

---

## Deployment

You can deploy this project to platforms like [Render](https://render.com/), [Vercel](https://vercel.com/), or [Netlify](https://www.netlify.com/).  
Make sure to update your environment variables and API URLs for production.

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

---

## Contact

For questions or support, please open an issue or contact the maintainer.

---

## License

This project is for educational purposes.

---

## Security & Performance

### 🔒 Advanced Security Features
- **XSS Protection**: DOMPurify sanitization for all user inputs
- **Progressive Rate Limiting**: Advanced rate limiting with delays
- **IP-based Blocking**: Automatic blocking of suspicious activities
- **Authentication & Authorization**: Enhanced JWT validation with user verification
- **CSRF Protection**: Token-based protection for state-changing operations  
- **Input Validation**: Comprehensive sanitization and validation
- **File Upload Security**: Type validation, size limits, admin-only access
- **Security Headers**: Helmet.js integration with CSP

### ⚡ Performance Optimizations
- **Database Connection Pooling**: Optimized connections with retry logic
- **API Response Caching**: In-memory caching for faster responses
- **React Performance Hooks**: useCallback, useMemo, debouncing, throttling
- **Advanced Error Handling**: Custom error classes with structured logging
- **Real-time Monitoring**: System metrics and performance tracking
- **Request Optimization**: Size limiting and efficient processing

### 🜐 Internationalization Support
- **Multi-language Ready**: i18next integration for global reach
- **Dynamic Language Switching**: Runtime language changes
- **Translation Management**: Structured translation system
- **Fallback Support**: Graceful handling of missing translations

### 📊 Real-time Monitoring
- **System Metrics**: CPU, memory, response time tracking
- **Health Checks**: `/api/health` endpoint for system status
- **Performance Analytics**: `/api/metrics` for detailed insights
- **Error Tracking**: Comprehensive error logging and classification

### 🛡️ Advanced Testing
Run the complete improvement suite:
```bash
# Install all advanced improvements
./install-advanced-improvements.bat

# Test security features
curl -X GET https://mernbackend-tmp5.onrender.com/api/health

# Monitor performance
curl -X GET https://mernbackend-tmp5.onrender.com/api/metrics
```

## Notes

- **Security First**: All routes are protected with proper authentication and validation
- **Performance Optimized**: Implements React best practices and efficient caching
- **Production Ready**: Includes comprehensive error handling and monitoring
- Update environment variables and credentials as needed for your deployment
- Contributions are welcome! Please follow the security guidelines above
