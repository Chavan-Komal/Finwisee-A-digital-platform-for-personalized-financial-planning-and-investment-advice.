# Database Setup Guide

This application uses MySQL database for persistent data storage.

## MySQL Database Configuration

MySQL is recommended for production use with persistent data storage.

### Prerequisites:
1. Install MySQL Server
2. Create database and user (optional)

### MySQL Installation:

#### Windows:
1. Download MySQL Installer from https://dev.mysql.com/downloads/installer/
2. Install MySQL Server
3. Set root password during installation

#### Linux (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install mysql-server
sudo mysql_secure_installation
```

#### macOS:
```bash
brew install mysql
brew services start mysql
mysql_secure_installation
```

### Database Setup:

1. **Login to MySQL:**
```bash
mysql -u root -p
```

2. **Create Database (Optional - auto-created by application):**
```sql
CREATE DATABASE finwise_db;
```

3. **Create User (Optional):**
```sql
CREATE USER 'finwise_user'@'localhost' IDENTIFIED BY 'finwise_password';
GRANT ALL PRIVILEGES ON finwise_db.* TO 'finwise_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Current Configuration:

The application is configured with the following MySQL settings in `application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/finwise_db?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=password
```

### Usage:
```bash
# Run the application
./mvnw spring-boot:run

# Or use the provided scripts
.\run.bat        # Windows
./run.sh         # Linux/Mac
```

## Sample Data

The application automatically initializes with sample data including:

### Default Users:
- **Admin User**: `admin@finwise.com` / `admin123`
- **Regular User**: `john.doe@example.com` / `user123`
- **Instructor**: `instructor@finwise.com` / `instructor123`

### Sample Data Includes:
- 8 Financial Categories
- 5 Courses with pricing
- 6 Investment Products
- 5 Financial Services/Items

### Data Initialization:
- **First Run**: Tables are created and sample data is inserted
- **Subsequent Runs**: Uses `update` mode to preserve existing data

## Troubleshooting

### Common Issues:

1. **MySQL Connection Error:**
   - Ensure MySQL server is running
   - Check username/password in configuration
   - Verify database exists or enable auto-creation

2. **Data Not Persisting:**
   - Check database connection and permissions
   - Verify MySQL service is running

3. **Tables Not Created:**
   - Check if database user has CREATE privileges
   - Verify database exists or auto-creation is enabled

### Useful Commands:

```bash
# Check MySQL status (Linux/macOS)
sudo systemctl status mysql

# Start MySQL (Linux/macOS)
sudo systemctl start mysql

# Check running Java processes
jps -l

# Check application logs
./mvnw spring-boot:run > app.log 2>&1
```

## Production Recommendations

1. **Use MySQL for production**
2. **Set strong passwords**
3. **Configure proper database user with limited privileges**
4. **Enable SSL for database connections**
5. **Set up database backups**
6. **Monitor database performance**

## Environment Variables

You can also configure database settings using environment variables:

```bash
export SPRING_PROFILES_ACTIVE=mysql
export SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/finwise_db
export SPRING_DATASOURCE_USERNAME=your_username
export SPRING_DATASOURCE_PASSWORD=your_password

./mvnw spring-boot:run
```
