# Atomix Development Guide

This guide provides comprehensive instructions for setting up, developing, and deploying the Atomix Cafeteria Management System.

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Prerequisites](#prerequisites)
3. [Local Development Setup](#local-development-setup)
4. [Project Structure](#project-structure)
5. [Development Workflow](#development-workflow)
6. [Testing](#testing)
7. [Deployment](#deployment)
8. [Contributing](#contributing)

## 🎯 Project Overview

Atomix is a comprehensive cafeteria management system featuring:

- **Frontend**: React 18 + TypeScript + Redux Toolkit
- **Backend**: Spring Boot 3.2 + Java 21
- **Databases**: PostgreSQL + MongoDB
- **Real-time**: WebSockets + Firebase
- **DevOps**: Docker + GitHub Actions
- **Architecture**: Microservices with SOLID principles

## 🛠️ Prerequisites

Before starting development, ensure you have:

### Required Software

- **Node.js** 18+ and npm
- **Java** 21 (OpenJDK or Oracle JDK)
- **Maven** 3.9+
- **PostgreSQL** 15+
- **MongoDB** 6+
- **Docker** and Docker Compose
- **Git**

### Development Tools (Recommended)

- **IDE**: IntelliJ IDEA, VS Code, or Eclipse
- **Database Tools**: pgAdmin, MongoDB Compass
- **API Testing**: Postman or Insomnia
- **Terminal**: Git Bash, PowerShell, or Terminal

## 🚀 Local Development Setup

### Option 1: Native Setup

#### 1. Clone the Repository

```bash
git clone <repository-url>
cd atomix
```

#### 2. Setup Backend

```bash
cd backend

# Install dependencies and run tests
./mvnw clean install

# Set up environment variables (create application-dev.yml)
cp src/main/resources/application.yml src/main/resources/application-dev.yml

# Start the backend (will start on port 8080)
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

#### 3. Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start development server (will start on port 3000)
npm start
```

#### 4. Setup Databases

**PostgreSQL:**
```sql
CREATE DATABASE atomix_cafeteria;
CREATE USER atomix_user WITH PASSWORD 'atomix_password';
GRANT ALL PRIVILEGES ON DATABASE atomix_cafeteria TO atomix_user;
```

**MongoDB:**
```javascript
// Connect to MongoDB and create database
use atomix_cafeteria_nosql
db.createUser({
  user: "atomix_user",
  pwd: "atomix_password",
  roles: ["readWrite"]
})
```

### Option 2: Docker Setup (Recommended)

```bash
# Start all services with Docker Compose
cd docker
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

This will start:
- Frontend on http://localhost:3000
- Backend on http://localhost:8080
- PostgreSQL on localhost:5432
- MongoDB on localhost:27017
- pgAdmin on http://localhost:5050
- Mongo Express on http://localhost:8081

## 📁 Project Structure

```
atomix/
├── 📁 frontend/                 # React application
│   ├── 📁 src/
│   │   ├── 📁 components/       # Reusable UI components
│   │   ├── 📁 pages/           # Page components
│   │   ├── 📁 store/           # Redux store & slices
│   │   ├── 📁 services/        # API service calls
│   │   ├── 📁 hooks/           # Custom React hooks
│   │   └── 📁 utils/           # Utility functions
│   ├── 📁 public/              # Static assets
│   └── 📄 package.json
├── 📁 backend/                  # Spring Boot application
│   ├── 📁 src/main/java/com/atomix/cafeteria/
│   │   ├── 📁 controller/      # REST controllers
│   │   ├── 📁 service/         # Business logic
│   │   ├── 📁 repository/      # Data access
│   │   ├── 📁 entity/          # JPA entities
│   │   ├── 📁 dto/            # Data Transfer Objects
│   │   ├── 📁 config/         # Configuration
│   │   ├── 📁 security/       # Security config
│   │   └── 📁 websocket/      # WebSocket handlers
│   ├── 📁 src/main/resources/
│   │   ├── 📄 application.yml  # App configuration
│   │   └── 📁 db/migration/   # Flyway migrations
│   └── 📄 pom.xml
├── 📁 docker/                   # Docker configurations
│   ├── 📄 docker-compose.yml
│   ├── 📄 Dockerfile.frontend
│   └── 📄 Dockerfile.backend
├── 📁 .github/workflows/       # CI/CD pipelines
└── 📁 docs/                    # Documentation
```

## 🔄 Development Workflow

### Git Workflow

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes and Commit**
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

3. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   # Create Pull Request on GitHub
   ```

### Commit Message Convention

Use conventional commits:
- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test additions or updates
- `chore:` Build process or auxiliary tool changes

### Code Standards

#### Frontend
```bash
# Linting
npm run lint
npm run lint:fix

# Formatting
npm run format

# Type checking
npm run type-check
```

#### Backend
```bash
# Code formatting (using Spotless)
./mvnw spotless:apply

# Code analysis
./mvnw checkstyle:check
./mvnw pmd:check
```

## 🧪 Testing

### Frontend Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- UserComponent.test.tsx
```

### Backend Testing

```bash
# Run all tests
./mvnw test

# Run specific test class
./mvnw test -Dtest=UserServiceTest

# Run integration tests
./mvnw verify

# Generate test coverage report
./mvnw jacoco:report
```

### End-to-End Testing

```bash
# Using Cypress (if implemented)
cd frontend
npm run cypress:open
npm run cypress:run
```

## 🚀 Deployment

### Development Environment

```bash
# Deploy to development
docker-compose -f docker-compose.dev.yml up -d
```

### Production Environment

```bash
# Build production images
docker build -f docker/Dockerfile.backend -t atomix-backend:prod .
docker build -f docker/Dockerfile.frontend -t atomix-frontend:prod .

# Deploy to production
docker-compose -f docker-compose.prod.yml up -d
```

### Environment Variables

#### Backend (.env or application.yml)
```yaml
# Database
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/atomix_cafeteria

# JWT
JWT_SECRET=your_jwt_secret_key

# OAuth2
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Payment Gateways
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
STRIPE_PUBLIC_KEY=your_stripe_public_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

#### Frontend (.env)
```bash
REACT_APP_API_URL=http://localhost:8080/api/v1
REACT_APP_WS_URL=ws://localhost:8080/ws
REACT_APP_STRIPE_PUBLIC_KEY=your_stripe_public_key
```

## 📊 Monitoring and Logging

### Application Monitoring

- **Health Checks**: `/api/v1/actuator/health`
- **Metrics**: `/api/v1/actuator/metrics`
- **Info**: `/api/v1/actuator/info`

### Log Files

- Backend logs: `backend/logs/atomix-cafeteria.log`
- Frontend logs: Browser console and network tab

### Performance Monitoring

```bash
# Backend performance
./mvnw spring-boot:run -Dspring-boot.run.jvmArguments="-Xmx512m -XX:+UseG1GC"

# Frontend bundle analysis
cd frontend
npm run build
npm install -g webpack-bundle-analyzer
npx webpack-bundle-analyzer build/static/js/*.js
```

## 🤝 Contributing

### Before Contributing

1. Read the [Code of Conduct](CODE_OF_CONDUCT.md)
2. Check existing issues and PRs
3. Follow the development workflow
4. Ensure tests pass
5. Update documentation if needed

### Development Best Practices

#### Frontend
- Use TypeScript strictly
- Follow React Hooks patterns
- Implement proper error boundaries
- Use Redux Toolkit for state management
- Write unit tests for components
- Follow accessibility guidelines

#### Backend
- Follow SOLID principles
- Use DTOs for API contracts
- Implement proper exception handling
- Write comprehensive tests
- Use proper HTTP status codes
- Document APIs with Swagger/OpenAPI

#### Database
- Use migrations for schema changes
- Index frequently queried columns
- Follow naming conventions
- Implement proper constraints
- Use transactions for data consistency

### Security Guidelines

- Never commit secrets to version control
- Use environment variables for configuration
- Implement proper input validation
- Use HTTPS in production
- Follow OWASP security guidelines
- Regularly update dependencies

## 🆘 Troubleshooting

### Common Issues

#### Backend Won't Start
```bash
# Check Java version
java -version

# Check port availability
netstat -an | grep 8080

# Check database connectivity
telnet localhost 5432
```

#### Frontend Build Fails
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear npm cache
npm cache clean --force
```

#### Database Connection Issues
```bash
# Check PostgreSQL service
sudo systemctl status postgresql

# Check MongoDB service
sudo systemctl status mongod

# Test database connections
psql -h localhost -U atomix_user -d atomix_cafeteria
mongo mongodb://localhost:27017
```

### Getting Help

1. Check this documentation
2. Search existing [GitHub Issues](../../issues)
3. Create a new issue with:
   - Clear description
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details
   - Relevant logs

## 📚 Additional Resources

- [Spring Boot Documentation](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/)
- [React Documentation](https://react.dev/)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Docker Documentation](https://docs.docker.com/)

---

Happy coding! 🚀 