# Atomix Cafeteria Frontend

A modern React TypeScript application for managing cafeteria operations, built with Material-UI and RTK Query.

## Features

### 🔐 Authentication & Authorization
- **Role-based Access Control**: Admin, Cafeteria Manager, Vendor, Employee
- **RTK Query Integration**: Efficient data fetching and caching
- **JWT Token Management**: Automatic token refresh and storage
- **Protected Routes**: Role-specific page access

### 👥 User Roles & Permissions

| Role | Dashboard | Menu | Orders | Analytics | Vendor Portal | Profile | Settings |
|------|-----------|------|--------|-----------|---------------|---------|----------|
| **Employee** | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ |
| **Vendor** | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ |
| **Cafeteria Manager** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Admin** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

### 🎨 UI Components
- **Material-UI Design System**: Consistent, modern interface
- **Responsive Layout**: Works on desktop, tablet, and mobile
- **Dark Mode Ready**: Theme system in place
- **Loading States**: RTK Query provides built-in loading indicators
- **Error Handling**: Comprehensive error boundaries and notifications

## Quick Start

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Environment Configuration
Create a `.env` file in the frontend directory:
```env
REACT_APP_API_URL=http://localhost:8080/api/v1
```

### 3. Start Development Server
```bash
npm start
```

The application will be available at `http://localhost:3000`

## Test Credentials

Use these pre-configured accounts for testing:

| Email | Password | Role | Description |
|-------|----------|------|-------------|
| `admin@atomix.com` | `admin123` | Admin | Full system access |
| `manager@atomix.com` | `manager123` | Cafeteria Manager | Operations management |
| `vendor@atomix.com` | `vendor123` | Vendor | Menu and order management |
| `employee@atomix.com` | `employee123` | Employee | Browse and order food |

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── auth/            # Authentication components
│   ├── demo/            # Demo/testing components
│   └── layout/          # Layout components (Navbar, Sidebar)
├── hooks/               # Custom React hooks
├── pages/               # Page components
│   ├── auth/            # Login, Register pages
│   └── ...              # Dashboard, Menu, Orders, etc.
├── services/            # API services (deprecated - now using RTK Query)
├── store/               # Redux store configuration
│   ├── api/             # RTK Query API slices
│   └── slices/          # Redux slices
├── App.tsx              # Main app component
└── index.tsx            # Application entry point
```

## State Management

### RTK Query Integration
- **Base API Configuration**: Centralized API setup with authentication
- **Auth API**: Login, register, user management
- **Automatic Caching**: Smart data caching and invalidation
- **Loading States**: Built-in loading and error states

### Redux Slices
- **Auth Slice**: User authentication state
- **Menu Slice**: Menu items and categories
- **Order Slice**: Order management
- **Analytics Slice**: Dashboard analytics
- **Live Status Slice**: Real-time updates

## Key Technologies

- **React 18**: Latest React with concurrent features
- **TypeScript**: Type-safe development
- **Material-UI v5**: Modern design system
- **RTK Query**: Data fetching and caching
- **React Router v6**: Client-side routing
- **React Hook Form**: Form management with validation
- **Yup**: Schema validation

## Development Commands

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format
```

## API Integration

The frontend integrates with the Spring Boot backend through RTK Query:

### Authentication Endpoints
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /auth/me` - Get current user
- `POST /auth/refresh` - Refresh JWT token
- `POST /auth/logout` - User logout

### Data Flow
1. **Authentication**: JWT tokens stored in localStorage
2. **API Calls**: Automatic token injection via RTK Query
3. **Error Handling**: Automatic logout on token expiration
4. **Loading States**: UI updates based on query status

## Features in Development

- [ ] Menu Management (CRUD operations)
- [ ] Order Processing
- [ ] Real-time Notifications
- [ ] Analytics Dashboard
- [ ] Vendor Management
- [ ] Payment Integration
- [ ] Dark Theme Toggle

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Follow TypeScript best practices
2. Use Material-UI components consistently
3. Implement proper error handling
4. Add loading states for async operations
5. Follow the established folder structure
6. Write meaningful commit messages

## Performance Optimizations

- **Code Splitting**: React.lazy for route-based splitting
- **RTK Query Caching**: Automatic data caching
- **Bundle Optimization**: Tree shaking and minification
- **Image Optimization**: Lazy loading for images
- **Memoization**: React.memo for expensive components

---

Built with ❤️ for Atomix Cafeteria Management System 