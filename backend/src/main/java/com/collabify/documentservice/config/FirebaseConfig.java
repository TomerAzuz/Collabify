package com.collabify.documentservice.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.Base64;

@Configuration
public class FirebaseConfig {

    @Value("${FIREBASE_CONFIG_BASE64}")
    private String firebaseConfigBase64;

    @Bean
    public FirebaseApp firebaseApp() throws IOException {
        byte[] decodedBytes = Base64.getDecoder().decode(firebaseConfigBase64);
        FirebaseOptions options = FirebaseOptions.builder()
                .setCredentials(GoogleCredentials.fromStream(new ByteArrayInputStream(decodedBytes)))
                .build();

        return FirebaseApp.initializeApp(options);
    }
}
