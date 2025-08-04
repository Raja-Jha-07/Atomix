# Atomix Cafeteria Management System

A comprehensive cafeteria management system built with Spring Boot backend and React frontend, featuring role-based access control, food ordering, and integrated payment processing.

## 🚀 Features

### User Management
- **Multi-role Authentication**: Admin, Manager, Vendor, Employee roles
- **JWT-based Security**: Secure authentication and authorization
- **User Profiles**: Complete profile management with personal statistics

### Food Ordering System
- **Interactive Menu**: Search, filter, and browse food items
- **Smart Cart**: Add/remove items with quantity management
- **Real-time Updates**: Live menu updates and availability status
- **Favorites System**: Save and quick-order favorite items

### Payment Integration 💳
- **Razorpay Gateway**: Secure payment processing
- **Food Card System**: Digital wallet for employees
- **Multiple Payment Options**: Card recharge and direct order payment
- **Payment History**: Complete transaction tracking
- **Auto-recharge**: Configurable automatic balance top-up

### Analytics & Insights
- **Personal Analytics**: Individual spending insights for employees
- **Business Analytics**: Revenue and operational metrics for admins
- **Order Tracking**: Real-time order status and history
- **Spending Breakdown**: Detailed expense categorization

### Role-Based Features

#### 👨‍💼 Employee Features
- Browse and order from menu
- Food card management and recharge
- Personal spending analytics
- Order history and favorites
- Profile management

#### 🏪 Vendor Features
- Menu management
- Order tracking
- Sales analytics
- Inventory updates

#### 👑 Admin/Manager Features
- User management
- Business analytics
- System configuration
- Payment oversight

## 🛠️ Technology Stack

### Backend
- **Framework**: Spring Boot 3.3.5
- **Database**: H2 (development), PostgreSQL (production)
- **Security**: Spring Security with JWT
- **Payment**: Razorpay Java SDK
- **Documentation**: OpenAPI/Swagger

### Frontend
- **Framework**: React 18 with TypeScript
- **UI Library**: Material-UI (MUI)
- **State Management**: Redux Toolkit
- **Payment**: Razorpay Checkout
- **Build Tool**: Create React App

## 📦 Installation & Setup

### Prerequisites
- Java 21+
- Node.js 18+
- Maven 3.8+

### Backend Setup
```bash
cd backend
./mvnw clean install
./mvnw spring-boot:run
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

### Environment Configuration

#### Backend (`backend/src/main/resources/application.yml`)
```yaml
razorpay:
  key-id: ${RAZORPAY_KEY_ID:your-key}
  key-secret: ${RAZORPAY_KEY_SECRET:your-secret-key}

jwt:
  secret: ${JWT_SECRET:your-secret-key}
  expiration: 86400000
```

#### Frontend (`.env.local`)
```
REACT_APP_API_URL=http://localhost:8083/api/v1
REACT_APP_RAZORPAY_KEY_ID=your-key
```

## 💳 Payment Integration

### Razorpay Setup
1. Create a Razorpay account at [razorpay.com](https://razorpay.com)
2. Get your Test API Keys from the dashboard
3. Update environment variables with your keys
4. Test payments using Razorpay test cards

### Test Payment Cards
```
Card Number: 4111 1111 1111 1111
Expiry: Any future date
CVV: Any 3 digits
```

### Payment Features
- **Food Card Recharge**: ₹10 to ₹50,000
- **Order Payments**: Direct payment for orders
- **Auto-recharge**: Configurable thresholds
- **Payment History**: Complete transaction logs
- **Secure Processing**: SSL encryption and signature verification

## 🏗️ Architecture

### Security Flow
1. User authentication via JWT
2. Role-based route protection
3. API endpoint authorization
4. Payment signature verification

### Payment Flow
1. Frontend initiates payment
2. Backend creates Razorpay order
3. Razorpay checkout opens
4. Payment completion verification
5. Balance update and confirmation

## 📱 API Endpoints

### Authentication
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration

### Payments
- `POST /api/v1/payments/create-order` - Create payment order
- `POST /api/v1/payments/verify` - Verify payment
- `GET /api/v1/payments/history` - Payment history

### Menu & Orders
- `GET /api/v1/menu/items` - Get menu items
- `POST /api/v1/orders` - Place order
- `GET /api/v1/orders/history` - Order history

## 🚢 Deployment

### H2 Database (Development)
- Configured for file-based persistence
- Web console available at `/h2-console`

### Production Deployment
- PostgreSQL database support
- Docker containerization
- Environment variable configuration
- SSL/TLS security

## 🧪 Testing

### Backend Tests
```bash
cd backend
./mvnw test
```

### Frontend Tests
```bash
cd frontend
npm test
```

### Payment Testing
- Use Razorpay test mode
- Test with provided test cards
- Verify webhook endpoints

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Contact: support@atomix.com

---

**Built with ❤️ for modern cafeteria management**


