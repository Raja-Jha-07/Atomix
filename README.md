# Atomix - Cafeteria Management System

A comprehensive full-stack cafeteria management system built using modern web technologies and SDLC principles.

## 🏗️ System Architecture

### Technology Stack
- **Frontend**: React 18 + TypeScript + Redux Toolkit
- **Backend**: Spring Boot 3.2 + Java 21
- **Databases**: PostgreSQL (structured data) + MongoDB (unstructured data)
- **Authentication**: JWT + OAuth2
- **Real-time**: WebSockets + Firebase
- **Payment**: Razorpay/Stripe integration
- **DevOps**: Docker + GitHub Actions
- **Deployment**: Vercel (Frontend) + Render (Backend)

## 📋 Features

### Functional Requirements
- **Floor Mapping**: Link building floors to cafeteria menus with pricing
- **Crowd Tracking**: Estimate rush hours by tracking people per floor
- **Digital Payments**: Integrated payment gateway (Razorpay/Stripe)
- **Menu Scheduling**: Time-based menu visibility
- **Live Status**: Real-time cafeteria open/closed status
- **Vendor Management**: Restaurant signup and menu control
- **Menu Voting**: Employee voting system for preferred dishes
- **Music Control**: Floor-wise music playbook management
- **Pre-order & Pickup**: Schedule orders and pickup slots
- **Feedback System**: AI-powered bot for suggestions and complaints
- **Nutrition Info**: Display calories, proteins, fats, carbs
- **Food Cards**: Digital food cards for employees
- **Inventory Tracking**: Monitor ingredient stock levels
- **Occasional Food Stalls**: Temporary vendor onboarding
- **Dual Portals**: Vendor Portal and Employee Portal

### Non-Functional Requirements
- **Scalability**: Modular microservices architecture
- **Security**: JWT authentication + OAuth2 integration
- **Responsive UI**: Mobile-first design approach
- **Real-time Updates**: WebSocket connections
- **High Availability**: Failover and backup strategies

## 🏢 Project Structure

```
atomix/
├── docs/                           # Project documentation
│   ├── requirements/               # Requirement specifications
│   ├── design/                    # System design documents
│   ├── api/                       # API documentation
│   └── deployment/                # Deployment guides
├── frontend/                      # React application
│   ├── src/
│   │   ├── components/            # Reusable UI components
│   │   ├── pages/                 # Page components
│   │   ├── store/                 # Redux store configuration
│   │   ├── services/              # API service calls
│   │   ├── hooks/                 # Custom React hooks
│   │   └── utils/                 # Utility functions
│   ├── public/                    # Static assets
│   └── package.json
├── backend/                       # Spring Boot application
│   ├── src/main/java/com/atomix/
│   │   ├── cafeteria/
│   │   │   ├── config/            # Configuration classes
│   │   │   ├── controller/        # REST controllers
│   │   │   ├── service/           # Business logic services
│   │   │   ├── repository/        # Data access layer
│   │   │   ├── entity/            # JPA entities
│   │   │   ├── dto/               # Data Transfer Objects
│   │   │   ├── security/          # Security configurations
│   │   │   └── websocket/         # WebSocket handlers
│   │   └── CafeteriaApplication.java
│   ├── src/main/resources/
│   │   ├── application.yml        # Application configuration
│   │   └── db/migration/          # Flyway migrations
│   └── pom.xml
├── docker/                        # Docker configurations
│   ├── Dockerfile.frontend
│   ├── Dockerfile.backend
│   └── docker-compose.yml
├── .github/                       # GitHub Actions workflows
│   └── workflows/
│       ├── ci-frontend.yml
│       ├── ci-backend.yml
│       └── deploy.yml
└── scripts/                       # Build and deployment scripts
```

## 🎯 Core Modules

1. **User Management**: Employee and vendor registration, profiles
2. **Menu Management**: Menu creation, scheduling, pricing
3. **Voting System**: Democratic menu selection
4. **Analytics**: Crowd tracking, sales analytics
5. **Payment Processing**: Digital payments and food cards
6. **Live Status**: Real-time cafeteria status updates
7. **Music Control**: Floor-wise music management
8. **Inventory Management**: Stock tracking and alerts
9. **Feedback System**: AI-powered complaint handling
10. **Vendor Portal**: Restaurant onboarding and management
11. **Pre-order System**: Advance ordering and pickup slots
12. **Nutrition Tracking**: Nutritional information display

## 👥 Team Structure

- **Project Manager**: Overall project coordination
- **Frontend Lead**: React development and UI/UX implementation
- **Backend Lead**: Spring Boot APIs and business logic
- **DevOps Engineer**: CI/CD, containerization, deployment
- **UI/UX Designer**: User interface and experience design
- **QA Tester**: Quality assurance and testing

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Java 21+
- PostgreSQL 15+
- MongoDB 6+
- Docker (optional)

### Quick Start
1. Clone the repository
2. Follow setup instructions in respective directories
3. Run development servers
4. Access the application

## 📚 Documentation

- [Requirements Specification](docs/requirements/)
- [System Design](docs/design/)
- [API Documentation](docs/api/)
- [Deployment Guide](docs/deployment/)

## 🔧 Development

### Coding Standards
- **Frontend**: ESLint + Prettier, TypeScript strict mode
- **Backend**: Java coding standards, SOLID principles
- **Testing**: Unit tests with high coverage
- **Documentation**: Comprehensive API docs with Swagger

### Naming Conventions
- **Frontend Components**: `FloorMenuCard`, `LiveStatusBanner`, `MusicControlPanel`
- **Backend Packages**: `com.atomix.cafeteria.menu`, `com.atomix.cafeteria.user`
- **API Endpoints**: RESTful conventions (`/api/v1/menu`, `/api/v1/users`)

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Please read our contributing guidelines and code of conduct before submitting pull requests.


