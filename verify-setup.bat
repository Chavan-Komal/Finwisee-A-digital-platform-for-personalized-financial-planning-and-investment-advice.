@echo off
echo ========================================
echo   FINWISE APPLICATION SETUP VERIFICATION
echo ========================================
echo.

echo [1/4] Checking Java...
java -version 2>nul
if %errorlevel% neq 0 (
    echo ❌ Java not found! Please install Java 17 or higher.
    goto :end
) else (
    echo ✅ Java is installed
)
echo.

echo [2/4] Checking Maven...
cd backend
call mvnw.cmd --version 2>nul
if %errorlevel% neq 0 (
    echo ❌ Maven wrapper not working! Please check Maven installation.
    cd ..
    goto :end
) else (
    echo ✅ Maven is working
)
cd ..
echo.

echo [3/4] Checking Node.js...
node --version 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js not found! Please install Node.js 16 or higher.
    goto :end
) else (
    echo ✅ Node.js is installed
)
echo.

echo [4/4] Checking npm packages...
if exist "node_modules" (
    echo ✅ Node modules are installed
) else (
    echo ⚠️  Node modules not found. Run 'npm install' to install dependencies.
)
echo.

echo ========================================
echo   DATABASE CONFIGURATION
echo ========================================
echo.
echo MySQL Database:
echo   • Host: localhost:3306
echo   • Database: finwise_db (auto-created)
echo   • Username: root
echo   • Password: password
echo   • Requires MySQL Server installation
echo   • Persistent data storage
echo.
echo Make sure MySQL Server is installed and running!
echo See backend\DATABASE_SETUP.md for MySQL setup details.
echo.

echo ========================================
echo   QUICK START COMMANDS
echo ========================================
echo.
echo Backend:   cd backend ^&^& .\run.bat
echo Frontend:  npm run dev
echo.
echo Default Login Credentials:
echo   Admin: admin@finwise.com / admin123
echo   User:  john.doe@example.com / user123
echo.
echo Backend:  http://localhost:8080
echo Frontend: http://localhost:5173
echo.

:end
echo Press any key to exit...
pause >nul
