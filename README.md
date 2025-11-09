<div align="center">

# 🛒 MERN E-Commerce Platform

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Visit_Site-blue?style=for-the-badge&logo=netlify)](https://shopping-canter.netlify.app/)
[![Backend API](https://img.shields.io/badge/🔗_API-Backend-green?style=for-the-badge&logo=render)](https://mernbackend-tmp5.onrender.com/api)

![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)

![License](https://img.shields.io/badge/License-Educational-yellow?style=flat-square)
![Version](https://img.shields.io/badge/Version-2.0-brightgreen?style=flat-square)
![Security](https://img.shields.io/badge/Security-Advanced-red?style=flat-square)
![Performance](https://img.shields.io/badge/Performance-Optimized-orange?style=flat-square)

**🚀 A modern, secure, and high-performance E-Commerce platform built with the MERN stack**

*Features advanced security, real-time monitoring, internationalization, and enterprise-grade performance optimizations*

</div>

---

## 📚 Table of Contents

<details>
<summary><b>Click to expand navigation</b></summary>

| Section | Description |
|---------|-------------|
| 🏢 [Project Structure](#-project-structure) | Overview of the application architecture |
| ✨ [Features](#-features) | Complete feature list with capabilities |
| 🚀 [Quick Start](#-quick-start) | Get up and running in minutes |
| 🛠️ [Technologies](#-technologies-used) | Tech stack and tools used |
| 🔗 [API Reference](#-api-endpoints) | Complete API documentation |
| ⚙️ [Configuration](#-environment-variables) | Environment setup guide |
| 📁 [Project Structure](#-folder-structure) | Detailed folder organization |
| 🌐 [Deployment](#-deployment) | Production deployment guide |
| 👥 [Contributing](#-contributing) | How to contribute to the project |
| 📞 [Support](#-contact) | Get help and support |
| 📜 [License](#-license) | Legal information |

</details>

---

## 🏢 Project Structure

<div align="center">

```
📁 mern1/
├── 🔴 backend/                 # Node.js + Express API
│   ├── 🎮 controllers/         # Business logic
│   ├── 🔒 middlewares/         # Auth & validation
│   ├── 📊 models/              # MongoDB schemas
│   ├── 🔗 routes/              # API endpoints
│   ├── ⚙️ config/              # Database & app config
│   ├── 🛠️ utils/               # Helper functions
│   ├── 🔐 .env                 # Environment variables
│   ├── 🚀 index.js             # Server entry point
│   └── 📦 package.json         # Dependencies
│
└── 🔵 frontend/               # React + Vite App
    ├── 📂 src/
    │   ├── 🧩 components/       # Reusable UI components
    │   ├── 📱 pages/            # Route components
    │   ├── 📊 redux/            # State management
    │   ├── 🛠️ Utils/            # Helper utilities
    │   ├── 🎨 App.jsx           # Main app component
    │   ├── ⚡ main.jsx          # React entry point
    │   └── 🎨 index.css         # Global styles
    ├── 🔐 .env                   # Frontend config
    ├── 🌐 index.html             # HTML template
    ├── 📦 package.json           # Dependencies
    ├── 🎨 tailwind.config.js     # Tailwind CSS config
    └── ⚡ vite.config.js         # Vite bundler config
```

</div>

---

## ✨ Features

<div align="center">

### 👥 **User Experience**
| Feature | Description | Status |
|---------|-------------|--------|
| 🔐 **Authentication** | JWT + Google OAuth with enhanced security | ✅ |
| 🛒 **Shopping Cart** | Real-time cart with PayPal & COD | ✅ |
| 📱 **Responsive Design** | Mobile-first with Tailwind CSS | ✅ |
| ⭐ **Product Reviews** | Ratings, reviews, and favorites | ✅ |

### 📊 **Admin Features**
| Feature | Description | Status |
|---------|-------------|--------|
| 📈 **Dashboard** | Complete admin control panel | ✅ |
| 📊 **Analytics** | Real-time metrics and monitoring | ✅ |
| 📦 **Order Management** | Track and manage all orders | ✅ |
| 📁 **Product Management** | CRUD operations for products | ✅ |

### 🔒 **Security & Performance**
| Feature | Description | Status |
|---------|-------------|--------|
| 🛡️ **Advanced Security** | XSS protection, IP blocking, rate limiting | ✅ |
| ⚡ **Performance** | Database pooling, API caching, optimization | ✅ |
| 🌐 **Internationalization** | Multi-language support with i18next | ✅ |
| 🚨 **Error Handling** | Custom error classes, structured logging | ✅ |

</div>

---

## 🚀 Quick Start

<div align="center">

### 📝 **Prerequisites**

| Requirement | Version | Status |
|-------------|---------|--------|
| 🟫 **Node.js** | v16+ | Required |
| 🍃 **MongoDB** | Latest | Required |
| 💳 **PayPal** | API Keys | Optional |
| 🔑 **Google OAuth** | Client ID | Optional |

</div>

### 🔴 **Backend Setup**

```bash
# 1️⃣ Navigate to backend
cd backend

# 2️⃣ Install dependencies
npm install

# 3️⃣ Create environment file
cp .env.example .env  # Edit with your values

# 4️⃣ Start development server
npm run dev
```

**Environment Variables:**
```env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_URL=your_cloudinary_url
```

### 🔵 **Frontend Setup**

```bash
# 1️⃣ Navigate to frontend
cd frontend

# 2️⃣ Install dependencies
npm install

# 3️⃣ Create environment file
cp .env.example .env  # Edit with your values

# 4️⃣ Start development server
npm run dev
```

**Environment Variables:**
```env
VITE_API_URL=https://mernbackend-tmp5.onrender.com/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

### 🌐 **Access Points**

<div align="center">

| Service | URL | Status |
|---------|-----|--------|
| 📱 **Frontend** | [shopping-canter.netlify.app](https://shopping-canter.netlify.app) | 🟢 Live |
| 🔗 **Backend API** | [mernbackend-tmp5.onrender.com/api](https://mernbackend-tmp5.onrender.com/api) | 🟢 Live |

</div>

---

## 📜 Scripts

| Command | Description | Usage |
|---------|-------------|-------|
| `npm run dev` | Start development server | Frontend/Backend |
| `npm run build` | Build for production | Frontend only |
| `npm start` | Start production server | Backend only |
| `npm test` | Run test suite | Both |

---

## 🛠️ Technologies Used

<div align="center">

### 📱 **Frontend Stack**
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Redux](https://img.shields.io/badge/Redux-764ABC?style=for-the-badge&logo=redux&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

### 🔴 **Backend Stack**
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

### 🔒 **Security & Performance**
![Helmet](https://img.shields.io/badge/Helmet.js-FF6B6B?style=for-the-badge)
![bcrypt](https://img.shields.io/badge/bcrypt-4ECDC4?style=for-the-badge)
![DOMPurify](https://img.shields.io/badge/DOMPurify-45B7D1?style=for-the-badge)
![i18next](https://img.shields.io/badge/i18next-26A69A?style=for-the-badge)

</div>

---

## 🔗 API Endpoints

<details>
<summary><b>👥 Users API</b></summary>

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/users/register` | Register new user | ❌ |
| `POST` | `/api/users/auth` | Login user | ❌ |
| `PUT` | `/api/users/profile` | Update profile | ✅ |
| `GET` | `/api/users` | Get all users | 🔑 Admin |
| `DELETE` | `/api/users/:id` | Delete user | 🔑 Admin |

</details>

<details>
<summary><b>📱 Products API</b></summary>

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/products` | List products | ❌ |
| `POST` | `/api/products` | Add product | 🔑 Admin |
| `PUT` | `/api/products/:id` | Update product | 🔑 Admin |
| `DELETE` | `/api/products/:id` | Delete product | 🔑 Admin |
| `POST` | `/api/products/:id/reviews` | Add review | ✅ |

</details>

<details>
<summary><b>📁 Categories API</b></summary>

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/category` | List categories | ❌ |
| `POST` | `/api/category` | Add category | 🔑 Admin |
| `PUT` | `/api/category/:id` | Update category | 🔑 Admin |
| `DELETE` | `/api/category/:id` | Delete category | 🔑 Admin |

</details>

<details>
<summary><b>📦 Orders API</b></summary>

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/orders` | Create order | ✅ |
| `GET` | `/api/orders/:id` | Get order details | ✅ |
| `PUT` | `/api/orders/:id/pay` | Pay order | ✅ |
| `PUT` | `/api/orders/:id/deliver` | Mark delivered | 🔑 Admin |
| `GET` | `/api/orders/myorders` | User's orders | ✅ |

</details>

<details>
<summary><b>📷 Uploads API</b></summary>

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/uploads` | Upload image | 🔑 Admin |

</details>

---

## ⚙️ Environment Variables

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

## 📁 Folder Structure

| Directory | Purpose | Technologies |
|-----------|---------|-------------|
| `backend/` | Express API, MongoDB models, controllers, routes | Node.js, Express, MongoDB |
| `frontend/` | React app, Redux Toolkit, components, pages | React, Redux, Tailwind CSS |

---

## 🌐 Deployment

<div align="center">

### **Deployment Platforms**

[![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://render.com/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)
[![Netlify](https://img.shields.io/badge/Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://www.netlify.com/)

**⚠️ Important:** Update environment variables and API URLs for production

</div>

---

## 👥 Contributing

<div align="center">

### **How to Contribute**

</div>

```bash
# 1️⃣ Fork the repository
git clone https://github.com/yourusername/mern1.git

# 2️⃣ Create feature branch
git checkout -b feature/YourFeature

# 3️⃣ Make your changes
# ... code your feature ...

# 4️⃣ Commit changes
git commit -am 'Add new feature'

# 5️⃣ Push to branch
git push origin feature/YourFeature

# 6️⃣ Open Pull Request
```

**Guidelines:**
- Follow existing code style
- Add tests for new features
- Update documentation
- Follow security best practices

---

## 📞 Contact

<div align="center">

### **Get Support**

[![Issues](https://img.shields.io/badge/Issues-GitHub-red?style=for-the-badge&logo=github)](https://github.com/yourusername/mern1/issues)
[![Discussions](https://img.shields.io/badge/Discussions-GitHub-blue?style=for-the-badge&logo=github)](https://github.com/yourusername/mern1/discussions)

For questions, bug reports, or feature requests, please use GitHub Issues

</div>

---

## 📜 License

<div align="center">

**Educational Use Only**

This project is created for educational purposes and learning the MERN stack.

[![License](https://img.shields.io/badge/License-Educational-yellow?style=for-the-badge)]()

</div>

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
