@echo off
echo Starting Finwise Backend with the embedded H2 database (no MySQL needed)...
echo Data is stored in backend\data\ and survives restarts.
echo.
echo Default login credentials:
echo   Admin: admin@finwise.com / admin123
echo   User:  john.doe@example.com / user123
echo.
call "%~dp0mvnw.cmd" spring-boot:run -Dspring-boot.run.profiles=h2
