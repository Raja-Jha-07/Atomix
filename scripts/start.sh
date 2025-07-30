#!/bin/bash

# Atomix Cafeteria Management System Startup Script
echo "🚀 Starting Atomix Cafeteria Management System..."

# Function to start backend
start_backend() {
    echo "🔧 Starting backend server..."
    cd backend
    ./mvnw spring-boot:run -Dspring-boot.run.profiles=dev &
    BACKEND_PID=$!
    echo "Backend started with PID: $BACKEND_PID"
    cd ..
}

# Function to start frontend
start_frontend() {
    echo "🎨 Starting frontend server..."
    cd frontend
    npm start &
    FRONTEND_PID=$!
    echo "Frontend started with PID: $FRONTEND_PID"
    cd ..
}

# Function to check if services are running
check_services() {
    echo "📋 Checking if Docker services are running..."
    
    if ! docker ps | grep -q atomix-postgres; then
        echo "⚠️  PostgreSQL is not running. Starting Docker services..."
        cd docker
        docker-compose up -d
        echo "⏳ Waiting for services to start..."
        sleep 20
        cd ..
    else
        echo "✅ Docker services are running"
    fi
}

# Function to stop services
stop_services() {
    echo "🛑 Stopping Atomix services..."
    
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null
        echo "Backend stopped"
    fi
    
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null
        echo "Frontend stopped"
    fi
    
    # Stop Docker services if needed
    read -p "Stop Docker services? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        cd docker
        docker-compose down
        cd ..
        echo "Docker services stopped"
    fi
    
    exit 0
}

# Trap SIGINT (Ctrl+C) to stop services gracefully
trap stop_services SIGINT

# Main execution
main() {
    echo "🌟 Welcome to Atomix!"
    echo "Starting all services..."
    echo ""
    
    # Check Docker services
    check_services
    
    # Start backend
    start_backend
    echo "⏳ Waiting for backend to start..."
    sleep 30
    
    # Start frontend
    start_frontend
    echo "⏳ Waiting for frontend to start..."
    sleep 10
    
    echo ""
    echo "🎉 Atomix is now running!"
    echo ""
    echo "📱 Frontend: http://localhost:3000"
    echo "🔗 Backend API: http://localhost:8080/api/v1"
    echo "📚 API Docs: http://localhost:8080/swagger-ui.html"
    echo "🗄️  pgAdmin: http://localhost:5050 (admin@atomix.com / admin123)"
    echo "🍃 Mongo Express: http://localhost:8081 (admin / admin123)"
    echo ""
    echo "Press Ctrl+C to stop all services..."
    
    # Wait for user to stop services
    wait
}

# Run main function
main 