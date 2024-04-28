package com.collabify.documentservice;

import com.collabify.documentservice.dto.Collaborator;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

public class CollaboratorValidationTests {

    private static Validator validator;

    @BeforeAll
    static void setup() {
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            validator = factory.getValidator();
        }
    }

    @Test
    void whenAllFieldsCorrectThenValidationSucceeds() {
        var id = "123";
        var collaborator = new Collaborator(id, "https://example.com/avatar.jpg", "username");
        Set<ConstraintViolation<Collaborator>> violations = validator.validate(collaborator);
        assertThat(violations).isEmpty();
    }

    @Test
    void whenUidNotDefinedThenValidationFails() {
        var collaborator = new Collaborator(null, "https://example.com/avatar.jpg", "username");
        Set<ConstraintViolation<Collaborator>> violations = validator.validate(collaborator);
        assertThat(violations).hasSize(1);
        List<String> violationMessages = violations.stream()
                .map(ConstraintViolation::getMessage).toList();
        assertThat(violationMessages)
                .contains("UID cannot be null");
    }

    @Test
    void whenPhotoURLInvalidThenValidationFails() {
        var collaborator = new Collaborator("123", "aaaa", "username");

        Set<ConstraintViolation<Collaborator>> violations = validator.validate(collaborator);
        assertThat(violations).hasSize(1);
        List<String> violationMessages = violations.stream()
                .map(ConstraintViolation::getMessage).toList();
        assertThat(violationMessages)
                .contains("Invalid photo URL format");
    }

    @Test
    void whenDisplayNameNotDefinedThenValidationFails() {
        var collaborator = new Collaborator("123", "https://example.com/avatar.jpg", "");
        Set<ConstraintViolation<Collaborator>> violations = validator.validate(collaborator);
        assertThat(violations).hasSize(1);
        List<String> violationMessages = violations.stream()
                .map(ConstraintViolation::getMessage).toList();
        assertThat(violationMessages)
                .contains("Display Name cannot be blank");
    }
}
