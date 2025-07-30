#!/bin/bash

# Atomix Cafeteria Management System Setup Script
echo "🚀 Setting up Atomix Cafeteria Management System..."

# Check if required tools are installed
check_requirements() {
    echo "📋 Checking requirements..."
    
    if ! command -v java &> /dev/null; then
        echo "❌ Java 21 is not installed. Please install Java 21."
        exit 1
    fi
    
    if ! command -v node &> /dev/null; then
        echo "❌ Node.js is not installed. Please install Node.js 18+."
        exit 1
    fi
    
    if ! command -v docker &> /dev/null; then
        echo "❌ Docker is not installed. Please install Docker."
        exit 1
    fi
    
    echo "✅ All requirements are met!"
}

# Setup backend
setup_backend() {
    echo "🔧 Setting up backend..."
    cd backend
    
    # Make mvnw executable
    chmod +x mvnw
    
    # Clean and install dependencies
    ./mvnw clean install -DskipTests
    
    echo "✅ Backend setup complete!"
    cd ..
}

# Setup frontend
setup_frontend() {
    echo "🎨 Setting up frontend..."
    cd frontend
    
    # Install dependencies
    npm install
    
    echo "✅ Frontend setup complete!"
    cd ..
}

# Setup Docker environment
setup_docker() {
    echo "🐳 Setting up Docker environment..."
    cd docker
    
    # Start databases and other services
    docker-compose up -d postgres mongodb redis pgadmin mongo-express
    
    echo "⏳ Waiting for databases to start..."
    sleep 30
    
    echo "✅ Docker environment setup complete!"
    cd ..
}

# Create environment files
create_env_files() {
    echo "📝 Creating environment files..."
    
    # Backend environment variables
    if [ ! -f backend/src/main/resources/application-dev.yml ]; then
        cp backend/src/main/resources/application.yml backend/src/main/resources/application-dev.yml
        echo "✅ Created backend development configuration"
    fi
    
    # Frontend environment variables
    if [ ! -f frontend/.env ]; then
        cat > frontend/.env << EOF
REACT_APP_API_URL=http://localhost:8080/api/v1
REACT_APP_WS_URL=ws://localhost:8080/ws
EOF
        echo "✅ Created frontend environment file"
    fi
}

# Initialize database
init_database() {
    echo "🗄️ Initializing database..."
    
    # Wait for PostgreSQL to be ready
    echo "⏳ Waiting for PostgreSQL to be ready..."
    sleep 10
    
    # Database will be initialized by Flyway migrations when the backend starts
    echo "✅ Database initialization will be handled by Flyway migrations"
}

# Main setup function
main() {
    echo "🌟 Welcome to Atomix Setup!"
    echo "This script will set up your development environment."
    echo ""
    
    check_requirements
    create_env_files
    setup_docker
    setup_backend
    setup_frontend
    init_database
    
    echo ""
    echo "🎉 Setup complete! Here's how to start the application:"
    echo ""
    echo "1. Start the backend:"
    echo "   cd backend && ./mvnw spring-boot:run"
    echo ""
    echo "2. Start the frontend (in a new terminal):"
    echo "   cd frontend && npm start"
    echo ""
    echo "3. Access the application:"
    echo "   - Frontend: http://localhost:3000"
    echo "   - Backend API: http://localhost:8080/api/v1"
    echo "   - API Documentation: http://localhost:8080/swagger-ui.html"
    echo "   - pgAdmin: http://localhost:5050"
    echo "   - Mongo Express: http://localhost:8081"
    echo ""
    echo "4. Default database credentials:"
    echo "   - PostgreSQL: atomix_user / atomix_password"
    echo "   - MongoDB: admin / admin123"
    echo ""
    echo "Happy coding! 🚀"
}

# Run main function
main 