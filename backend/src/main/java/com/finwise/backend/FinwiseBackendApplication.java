package com.finwise.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class FinwiseBackendApplication {
    public static void main(String[] args) {
        // Hibernate's bundled Byte Buddy only officially knows JDKs up to its release date;
        // this lets it generate lazy-loading proxies on newer JDKs (e.g. Java 24+).
        if (System.getProperty("net.bytebuddy.experimental") == null) {
            System.setProperty("net.bytebuddy.experimental", "true");
        }
        SpringApplication.run(FinwiseBackendApplication.class, args);
    }
}
