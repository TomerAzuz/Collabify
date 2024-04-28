package com.collabify.documentservice;

import com.collabify.documentservice.dto.Collaborator;
import com.collabify.documentservice.model.RichTextDocument;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.time.Instant;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

public class DocumentValidationTests {

    private static Validator validator;


    @BeforeAll
    static void setup() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
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
    void whenAllFieldsCorrectThenValidationSucceeds() {
        var id = "123";
        var document = createDocument(id);
        Set<ConstraintViolation<RichTextDocument>> violations = validator.validate(document);
        assertThat(violations).isEmpty();
    }

    @Test
    void whenTitleNotDefinedThenValidationFails() {
        var id = "123";
        var now = Instant.now();

        List<Map<String, Object>> content = List.of(Map.of(
                "type", "paragraph",
                "children", List.of(
                        Map.of("text", "A line of text in a paragraph"))));

        var document = new RichTextDocument(id, null, content, "preview",
                new Collaborator("123", "https://example.com/avatar.jpg", "username"),
                new HashSet<>(),
                "Viewer",
                now,
                now,
                "Tomer",
                0
                );

        Set<ConstraintViolation<RichTextDocument>> violations = validator.validate(document);
        assertThat(violations).hasSize(1);
        List<String> violationMessages = violations.stream()
                .map(ConstraintViolation::getMessage).toList();
        assertThat(violationMessages)
                .contains("Title is required");
    }

    @Test
    void whenContentNotDefinedThenValidationFails() {
        var id = "123";
        var now = Instant.now();

        var document = new RichTextDocument(id, "title", null, "preview",
                new Collaborator("123", "https://example.com/avatar.jpg", "username"),
                new HashSet<>(),
                "Viewer",
                now,
                now,
                "Tomer",
                0
        );

        Set<ConstraintViolation<RichTextDocument>> violations = validator.validate(document);
        assertThat(violations).hasSize(1);
        List<String> violationMessages = violations.stream()
                .map(ConstraintViolation::getMessage).toList();
        assertThat(violationMessages)
                .contains("Content cannot be null");
    }

    @Test
    void whenCreatedByNotDefinedThenValidationFails() {
        var id = "123";
        var now = Instant.now();

        List<Map<String, Object>> content = List.of(Map.of(
                "type", "paragraph",
                "children", List.of(
                        Map.of("text", "A line of text in a paragraph"))));

        var document = new RichTextDocument(id, "title", content, "preview",
                null,
                new HashSet<>(),
                "Viewer",
                now,
                now,
                "Tomer",
                0
        );

        Set<ConstraintViolation<RichTextDocument>> violations = validator.validate(document);
        assertThat(violations).hasSize(1);
        List<String> violationMessages = violations.stream()
                .map(ConstraintViolation::getMessage).toList();
        assertThat(violationMessages)
                .contains("Created by field cannot be null");
    }
}
