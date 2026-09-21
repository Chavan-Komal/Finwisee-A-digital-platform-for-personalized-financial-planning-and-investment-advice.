@echo off
echo Starting Finwise Backend with MySQL...
echo Make sure MySQL server is running.
echo.
echo Database: finwise_db (auto-created)
echo Credentials come from DB_USERNAME / DB_PASSWORD (default root / password), e.g.:
echo   set DB_PASSWORD=your_mysql_password
echo.
echo Default login credentials:
echo   Admin: admin@finwise.com / admin123
echo   User:  john.doe@example.com / user123
echo.
call "%~dp0mvnw.cmd" spring-boot:run
