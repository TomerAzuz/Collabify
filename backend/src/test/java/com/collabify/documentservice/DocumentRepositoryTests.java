package com.collabify.documentservice;

import com.collabify.documentservice.dto.Collaborator;
import com.collabify.documentservice.model.RichTextDocument;
import com.collabify.documentservice.repository.DocumentRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mongodb.ConnectionString;
import com.mongodb.MongoClientSettings;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.data.mongo.DataMongoTest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.testcontainers.containers.MongoDBContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@DataMongoTest
@Testcontainers
@Import(DocumentRepositoryTests.TestMongoClientSettings.class)
public class DocumentRepositoryTests {

    @Container
    private static final MongoDBContainer mongoDBContainer = new MongoDBContainer("mongo:4.4.0");

    @Autowired
    private DocumentRepository documentRepository;

    @BeforeEach
    void cleanDB() {
        documentRepository.deleteAll();
    }

    private RichTextDocument createDocument(String id) {
        var now = Instant.now();

        List<Map<String, Object>> content = List.of(Map.of(
                "type", "paragraph",
                "children", List.of(
                        Map.of("text", "A line of text in a paragraph"))));

        return new RichTextDocument(
                id,
                "title",
                content,
                "preview",
                new Collaborator("123",
                        "https://example.com/avatar.jpg",
                        "username"),
                new HashSet<>(),
                "Viewer",
                now,
                now,
                "Tomer",
                0);
    }

    @Test
    void findAllDocuments() {
        var document1 = createDocument("123");
        var document2 = createDocument("456");

        documentRepository.save(document1);
        documentRepository.save(document2);

        List<RichTextDocument> actualDocuments = documentRepository.findAll();

        assertThat(actualDocuments.parallelStream()
                .filter(document -> document.getId().equals(document1.getId()) ||
                        document.getId().equals(document2.getId()))
                .collect(Collectors.toList())).hasSize(2);
    }


    @Test
    void findDocumentByIdWhenExisting() {
        var id = "123";
        var document = createDocument(id);

        documentRepository.save(document);

        Optional<RichTextDocument> actualDocument = documentRepository.findById(id);

        assertThat(actualDocument).isPresent();
        assertThat(actualDocument.get().getId()).isEqualTo(document.getId());
    }

    @Test
    void findDocumentByIdWhenNotExisting() {
        Optional<RichTextDocument> actualDocument = documentRepository.findById("123");
        assertThat(actualDocument).isEmpty();
    }

    @Test
    void existsByIdWhenExisting() {
        var id = "123";
        var document = createDocument(id);

        documentRepository.save(document);
        boolean existing = documentRepository.existsById(id);

        assertThat(existing).isTrue();
    }

    @Test
    void existsByIdWhenNotExisting() {
        var id = "123";
        boolean existing = documentRepository.existsById(id);

        assertThat(existing).isFalse();
    }

    @Test
    void deleteById() {
        var id = "123";
        var document = createDocument(id);
        var savedDocument = documentRepository.save(document);

        documentRepository.deleteById(id);
        boolean existing = documentRepository.existsById(savedDocument.getId());

        assertThat(existing).isFalse();
    }

    static class TestMongoClientSettings {
        @Bean
        MongoClient mongoClient() {
            ConnectionString connectionString = new ConnectionString(mongoDBContainer.getReplicaSetUrl());
            MongoClientSettings mongoClientSettings = MongoClientSettings.builder()
                    .applyConnectionString(connectionString)
                    .build();
            return MongoClients.create(mongoClientSettings);
        }

        @Bean
        public ObjectMapper objectMapper() {
            return new ObjectMapper();
        }
    }
}
