package com.finwise.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@Configuration
public class DatabaseConfig {
    
    // Additional configuration can be added here if needed
    
    @Configuration
    @Profile("mysql")
    static class MySQLConfig {
        // MySQL specific configuration if needed
    }
    
    @Configuration
    @Profile("h2")
    static class H2Config {
        // H2 specific configuration if needed
    }
}
