# 🏢 Cognizant Cafeteria Management System

A structured approach to building the Cognizant Cafeteria Management System using SDLC principles, best practices, and team collaboration tools.

---

## 🌀 SDLC Phases & Approach

### 1. Requirement Gathering & Analysis

#### ✅ Functional Requirements
- Map building floors → cafeteria menus with prices.
- Track number of people per floor → estimate rush hours.
- Online food payment integration.
- Menu timing (breakfast/lunch/dinner).
- Live cafeteria status (open/closed).
- Restaurant signup & menu management.
- Voting system for menu suggestions.

#### 🔐 Non-Functional Requirements
- Scalability  
- Security (JWT, OAuth)  
- Responsive UI  
- Real-time updates (WebSockets or polling)

---

### 2. System Design

#### 🧱 Architecture
- **Frontend**: React + Redux/Context API  
- **Backend**: Spring Boot (REST APIs)  
- **Database**: PostgreSQL or MongoDB  
- **Authentication**: JWT or OAuth2  
- **Real-time Updates**: WebSockets or Firebase  
- **DevOps**: GitHub + GitHub Actions (CI/CD)

#### 📦 Modules
- User Module (Employees)  
- Admin Module (Cafeteria Managers)  
- Menu Module (CRUD operations)  
- Voting Module  
- Analytics Module (Rush hours, traffic)  
- Payment Module (Integration with Razorpay/Stripe)  
- Live Status Module

---

### 3. Team Division

| Role             | Responsibility                          |
|------------------|------------------------------------------|
| Frontend Lead    | React UI, routing, state management      |
| Backend Lead     | API design, DB schema, Spring Boot services |
| DevOps Engineer  | GitHub setup, CI/CD, deployment          |
| UI/UX Designer   | Wireframes, user flows                   |
| QA Tester        | Manual & automated testing               |
| Project Manager  | Task tracking, standups, documentation   |

📌 Use GitHub Projects or Jira for task management.

---

### 4. Development Best Practices

#### 🧾 Naming Conventions

**Frontend**
- Components: `FloorMenuCard`, `LiveStatusBanner`
- Folders: `components/`, `pages/`, `services/`

**Backend**
- Packages: `com.cognizant.cafeteria.menu`, `com.cognizant.cafeteria.user`
- REST endpoints: `/api/floors`, `/api/menu`, `/api/vote`

#### ✅ Coding Standards
- Use DTOs and Service Layer in Spring Boot.
- Follow SOLID principles.
- Write unit tests (JUnit, Mockito).
- Use ESLint/Prettier for React.

---

### 5. Testing

- **Unit Testing**: JUnit (backend), Jest (frontend)
- **Integration Testing**: Postman, Swagger
- **UI Testing**: Cypress or Selenium

---

### 6. Deployment

- Use GitHub Actions for CI/CD.
- Deploy on Render, Vercel, or AWS EC2.
- Use Docker for containerization.

---

### 7. Maintenance

- Monitor logs (ELK stack or Prometheus).
- Regular feedback loop from users.
- Version control for APIs.

---


