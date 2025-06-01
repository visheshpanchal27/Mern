# MERN E-Commerce Project

This is a full-stack E-Commerce application built with the MERN stack (MongoDB, Express.js, React, Node.js). It features user authentication, product management, order processing, admin dashboard, and more.

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

## Features

- **User Authentication** (JWT, Google OAuth)
- **Product Catalog** with categories, reviews, ratings, favorites
- **Shopping Cart** and Checkout (PayPal, Cash on Delivery)
- **Order Management** for users and admins
- **Admin Dashboard**: manage users, products, categories, orders
- **Responsive UI** with Tailwind CSS and Vite
- **API Proxy** for backend requests

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
   VITE_API_URL=http://localhost:5000/api
   VITE_GOOGLE_CLIENT_ID=your_google_client_id
   ```
4. Start the frontend:
   ```sh
   npm run dev
   ```

### Access the App

- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend API: [http://localhost:5000/api](http://localhost:5000/api)

## Scripts

- `npm run dev` — Start development server (both frontend and backend)
- `npm run build` — Build frontend for production

## Technologies Used

- **Frontend:** React, Redux Toolkit, Tailwind CSS, Vite, Framer Motion, React Router, PayPal, Google OAuth
- **Backend:** Node.js, Express.js, MongoDB, Mongoose, Cloudinary
- **Other:** JWT, dotenv, ESLint

## License

This project is for educational purposes.

---

**Note:** Update environment variables and credentials as needed for your deployment.