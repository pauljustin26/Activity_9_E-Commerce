Here is a comprehensive README.md file for your project. It includes an overview of the system, the technology stack, setup instructions, and the requested folder directory structure.

Markdown

# Activity 9: E-Commerce System

This project is a full-stack e-commerce application consisting of three main components: a customer-facing frontend, an admin dashboard, and a robust backend API.

## 📂 Project Directory Structure

The project is organized into the following directory structure:

```text
Activity_9_E-Commerce/
├── admin-ecommerce/           # Admin Dashboard (React + Vite)
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/        # Admin UI components (DeleteModal, ProductTable, etc.)
│   │   ├── services/          # API integration services
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── backend-ecommerce/         # Backend API (NestJS)
│   ├── src/
│   │   ├── auth/              # Authentication logic (Guards, Strategies)
│   │   ├── orders/            # Order management module
│   │   ├── products/          # Product management module
│   │   ├── users/             # User and Cart management
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── uploads/               # Stored uploaded images
│   ├── nest-cli.json
│   ├── package.json
│   └── tsconfig.json
│
└── frontend-ecommerce/        # Client Storefront (React + Vite)
    ├── public/
    ├── src/
    │   ├── assets/
    │   ├── components/        # Store components (CartDrawer, ProductCard, etc.)
    │   ├── services/          # API integration services
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    ├── package.json
    └── vite.config.js
🚀 Technologies Used
Frontend & Admin (frontend-ecommerce & admin-ecommerce)
Framework: React (v19) with Vite

Styling: Tailwind CSS (v4)

Icons: Lucide React

Linting: ESLint

Backend (backend-ecommerce)
Framework: NestJS

Database: MongoDB with Mongoose

Authentication: Passport-JWT & Bcrypt

Validation: Class-validator & Class-transformer

🛠️ Getting Started
Follow these steps to set up and run the project locally.

Prerequisites
Node.js installed

MongoDB installed and running locally (or a MongoDB Atlas connection string)

1. Backend Setup
Navigate to the backend directory, install dependencies, and start the server.

Bash

cd backend-ecommerce
npm install
npm run start:dev
The backend server typically runs on http://localhost:3000.

2. Admin Dashboard Setup
Open a new terminal, navigate to the admin directory, and start the development server.

Bash

cd admin-ecommerce
npm install
npm run dev
3. Frontend Storefront Setup
Open a new terminal, navigate to the frontend directory, and start the development server.

Bash

cd frontend-ecommerce
npm install
npm run dev
✨ Features
User Authentication: Secure login and registration using JWT.

Product Management: CRUD operations for products (Admin).

Shopping Cart: Users can add items to their cart and view them.

Order System: Checkout functionality and order history tracking.

Image Uploads: Support for uploading product images (Backend).