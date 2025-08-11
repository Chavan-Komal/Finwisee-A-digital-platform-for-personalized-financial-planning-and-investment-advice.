Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    FINWISE BACKEND - MySQL Database" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "MySQL Configuration:" -ForegroundColor Yellow
Write-Host "  Host: localhost:3306" -ForegroundColor White
Write-Host "  Database: finwise_db (auto-created)" -ForegroundColor White
Write-Host "  Username: root" -ForegroundColor White
Write-Host "  Password: password" -ForegroundColor White
Write-Host ""
Write-Host "Make sure MySQL server is running!" -ForegroundColor Red
Write-Host ""
Write-Host "Default Login Credentials:" -ForegroundColor Yellow
Write-Host "  Admin: admin@finwise.com / admin123" -ForegroundColor Green
Write-Host "  User:  john.doe@example.com / user123" -ForegroundColor Green
Write-Host ""
Write-Host "Backend will be available at: http://localhost:8080" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Starting application..." -ForegroundColor Yellow
& ".\mvnw.cmd" "spring-boot:run"
