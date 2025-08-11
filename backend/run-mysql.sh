#!/bin/bash
echo "Starting Finwise Backend with MySQL Database..."
echo "Make sure MySQL server is running and configured properly."
echo ""
echo "MySQL Configuration:"
echo "  Database: finwise_db (auto-created)"
echo "  Username: root"
echo "  Password: password"
echo ""
echo "Default login credentials:"
echo "  Admin: admin@finwise.com / admin123"
echo "  User: john.doe@example.com / user123"
echo ""
./mvnw spring-boot:run
