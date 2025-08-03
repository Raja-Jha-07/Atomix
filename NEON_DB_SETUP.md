# 🐘 Neon DB Setup Guide for Atomix

This guide will help you set up PostgreSQL with Neon DB (free cloud database) for your Atomix project.

## 🚀 Step 1: Create Neon DB Account

1. Go to [https://neon.tech](https://neon.tech)
2. Sign up for a free account (GitHub/Google login available)
3. Create a new project named "atomix-cafeteria"

## 📊 Step 2: Get Database Connection Details

After creating your project, you'll get:
- **Host**: `ep-example-123456.us-east-1.aws.neon.tech`
- **Database**: `neondb` (default) or create `atomix_cafeteria`
- **Username**: Your Neon username
- **Password**: Generated password
- **Connection String**: Complete JDBC URL

## 🔧 Step 3: Configure Your Application

### Option A: Using Environment Variables (Recommended)

1. Copy `.env.example` to `.env` in the backend directory:
```bash
cp backend/.env.example backend/.env
```

2. Update the `.env` file with your Neon DB details:
```env
DATABASE_URL=jdbc:postgresql://ep-your-endpoint.region.aws.neon.tech/neondb?sslmode=require
DB_USERNAME=your_neon_username
DB_PASSWORD=your_neon_password
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
```

### Option B: Direct Configuration

Update `application.yml` directly (not recommended for production):
```yaml
spring:
  datasource:
    url: jdbc:postgresql://ep-your-endpoint.region.aws.neon.tech/neondb?sslmode=require
    username: your_neon_username
    password: your_neon_password
```

## 🏗️ Step 4: Database Schema Setup

The application will automatically create tables using Hibernate DDL (set to `update` mode).

### Manual Schema Creation (Optional)
If you want to create the database manually:

```sql
-- Connect to your Neon DB and run:
CREATE DATABASE atomix_cafeteria;
```

## 🧪 Step 5: Test the Connection

1. Start your Spring Boot application:
```bash
cd backend
./mvnw spring-boot:run
```

2. Check the logs for successful database connection:
```
INFO  - HikariPool-1 - Start completed.
INFO  - Started CafeteriaApplication
```

3. Visit the health endpoint:
```
http://localhost:8080/api/v1/actuator/health
```

## 📈 Neon DB Free Tier Limits

- **Storage**: 512 MB
- **Compute**: 1 vCPU, 256 MB RAM
- **Connections**: 100 concurrent
- **Data Transfer**: 5 GB/month
- **Branches**: 10 (great for dev/staging)

## 🔄 Migration from MySQL

Your entities and repositories will work without changes! The migration includes:

✅ **Updated Dependencies**: PostgreSQL driver instead of MySQL  
✅ **Updated Dialect**: PostgreSQL Hibernate dialect  
✅ **Optimized Connection Pool**: Reduced for free tier limits  
✅ **SSL Support**: Required for Neon DB connections  

## 🎯 Benefits of This Setup

- **Zero Infrastructure**: No local database setup needed
- **Cloud Backups**: Automatic backups and point-in-time recovery
- **Branching**: Create database branches for different environments
- **Scaling**: Easy to upgrade when you outgrow free tier
- **Security**: SSL connections and managed security updates

## 🔧 Troubleshooting

### Connection Issues
- Ensure `sslmode=require` is in your connection string
- Check if your IP is whitelisted (Neon allows all IPs by default)
- Verify username/password are correct

### Performance Issues
- Free tier has compute limits - consider upgrading for production
- Use connection pooling (already configured with HikariCP)
- Monitor your usage in Neon dashboard

### Schema Issues
- Check Hibernate logs for DDL execution
- Use `show-sql: true` in dev profile for debugging
- Consider enabling Flyway for production deployments

## 🚀 Next Steps

1. **Development**: Use the free tier for development and testing
2. **Staging**: Create a separate Neon project/branch for staging
3. **Production**: Upgrade to paid tier for production workloads
4. **Monitoring**: Set up alerts for storage/compute usage

Your Atomix application is now ready to run with cloud-hosted PostgreSQL! 🎉
