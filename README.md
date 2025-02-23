# 🚗 Car Valley Backend

![Car Valley Backend Banner](https://carstore-frontend.vercel.app/assets/car_valley_logo_cropped-D6VjFXdR.png)

A robust Express.js backend service for Car Valley, featuring secure authentication, payment integration with ShurjoPay, and comprehensive car management functionalities.

## 🌐 Live API

- **Frontend:** [Car Valley](https://carstore-frontend.vercel.app)
- **Production API:** [Backend API URL](carstore-with-payment-gateway.vercel.app)
- **GitHub Repository:** [https://github.com/SMTamim/ph-a4-express-ecommerce-server](https://github.com/SMTamim/ph-a4-express-ecommerce-server)

## ✨ Key Features

- 🔐 JWT Authentication & Authorization
- 💳 ShurjoPay Payment Gateway Integration
- 🚙 Complete Car Management System
- 👤 User Management
- 🛡️ Role-based Access Control
- 🔍 Advanced Search & Filtering
- 📊 Sales Analytics
- ⚡ Performance Optimized
- 🔒 Secure Payment Processing

## 🛠️ Technology Stack

- **Runtime:** Bun
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT
- **Payment:** ShurjoPay Gateway
- **Validation:** Zod
- **Security:** bcrypt, cors
- **Development:** ts-node-dev, ESLint, Prettier

## 📋 Prerequisites

- [Bun](https://bun.sh/) (Latest version)
- MongoDB (v4.4 or higher)
- Node.js (v18 or higher)
- ShurjoPay Merchant Account

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/SMTamim/ph-a4-express-ecommerce-server.git car_valley_backend
   cd car_valley_backend
   ```

2. **Install Bun**
   ```bash
   curl -fsSL https://bun.sh/install | bash
   ```

3. **Install dependencies**
   ```bash
   bun install
   ```

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Modify these Required environment variables:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   SHURJOPAY_MERCHANT_ID=your_merchant_id
   SHURJOPAY_MERCHANT_KEY=your_merchant_key
   ```

5. **Start development server**
   ```bash
   bun run dev
   ```

6. **Build for production**
   ```bash
   bun run build
   ```

7. **Start production server**
   ```bash
   bun run prod
   ```

## 📚 API Documentation

### Authentication Endpoints
```
POST /api/auth/register - Register new user
POST /api/auth/login - User login
POST /api/auth/update-password - Update Password
POST /api/auth/refresh-token - Refresh access token
```

### Product Management Endpoints
```
GET /api/products - Get all cars
POST /api/products - Add new car
GET /api/products/:id - Get car details
GET /api/top-products - Get top cars details
GET /api/trending-products - Get trending cars details
GET /api/similar-products/:id - Get similar cars
PATCH /api/products/:id - Update car
DELETE /api/products/:id - Delete car
```

### Payment Endpoints
```
POST /api/payments/create - Initiate payment
POST /api/payments/verify - Verify payment
```

### And many more

## 💳 ShurjoPay Integration

1. **Setup ShurjoPay Account**
   - Register at [ShurjoPay](https://shurjopay.com.bd/)
   - Get your Merchant ID and Key
   - Add them to your `.env` file


## 🔧 Available Scripts

- `bun run dev` - Start development server
- `bun run build` - Build TypeScript files
- `bun run prod` - Start production server
- `bun run lint` - Run ESLint
- `bun run format` - Format code with Prettier

## 📂 Project Structure

```
src/
├── app
│   ├── builder
│   ├── config
│   ├── DB
│   ├── error
│   ├── interface
│   ├── middlewares
│   ├── modules
│   │   ├── admin
│   │   ├── auth
│   │   ├── billingAddress
│   │   ├── cart
│   │   ├── home
│   │   ├── order
│   │   ├── payment
│   │   ├── product
│   │   ├── review
│   │   └── user
│   ├── routes
│   └── utils
└── type
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🔒 Security

- All passwords are hashed using bcrypt
- JWT tokens for authentication
- CORS enabled
- Input validation using Zod
- Secure payment processing

## 🐛 Error Handling

The API uses standard HTTP status codes and returns errors in the following format:
```json
{
  "success": false,
  "message": "Error message",
  "statusCode: 500,
  "error": {path: "Error path"},
  "stack": "Error stack trace (development only)"
}
```

## 📜 License

This project is licensed under the ISC License.

## 👥 Team

- [SM Tamim](https:smtamim.dev) - Lead Developer

## 📞 Support

For support, please open an issue in the GitHub repository.

---

<p align="center">Made with ❤️</p>
