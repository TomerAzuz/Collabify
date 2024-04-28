package com.collabify.documentservice;

import com.collabify.documentservice.dto.Collaborator;
import com.collabify.documentservice.model.RichTextDocument;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.json.JsonTest;
import org.springframework.boot.test.json.JacksonTester;

import java.time.Instant;
import java.util.HashSet;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@JsonTest
public class DocumentJsonTests {

    @Autowired
    private JacksonTester<RichTextDocument> json;

    @Test
    void testSerialization() throws Exception {
        var content = List.of(Map.of(
                "type", "paragraph",
                "children", List.of(
                        Map.of("text", ""))));

        var instant = Instant.parse("2024-04-25T10:15:30Z");
        var collaborator = new Collaborator("123", "https://example.com/avatar.jpg", "Tomer");

        RichTextDocument expectedDocument = new RichTextDocument("123", "Title", content,
                "http://example.com/preview.jpg", collaborator, new HashSet<>(), "Viewer",
                instant, instant, "Tomer", 1);

        var serializedJson = json.write(expectedDocument);

        assertThat(serializedJson).extractingJsonPathStringValue("@.id")
                .isEqualTo(expectedDocument.getId());
        assertThat(serializedJson).extractingJsonPathStringValue("@.title")
                .isEqualTo(expectedDocument.getTitle());
        assertThat(serializedJson).extractingJsonPathArrayValue("@.content")
                .isEqualTo(expectedDocument.getContent());
        assertThat(serializedJson).extractingJsonPathStringValue("@.previewUrl")
                .isEqualTo(expectedDocument.getPreviewUrl());
        assertThat(serializedJson).extractingJsonPathStringValue("@.createdBy.uid")
                .isEqualTo(expectedDocument.getCreatedBy().getUid());
        assertThat(serializedJson).extractingJsonPathStringValue("@.createdBy.photoURL")
                .isEqualTo(expectedDocument.getCreatedBy().getPhotoURL());
        assertThat(serializedJson).extractingJsonPathStringValue("@.createdBy.displayName")
                .isEqualTo(expectedDocument.getCreatedBy().getDisplayName());
        assertThat(serializedJson).extractingJsonPathStringValue("@.permission")
                .isEqualTo(expectedDocument.getPermission());
        assertThat(serializedJson).extractingJsonPathStringValue("@.createdAt")
                .isEqualTo(expectedDocument.getCreatedAt().toString());
        assertThat(serializedJson).extractingJsonPathStringValue("@.updatedAt")
                .isEqualTo(expectedDocument.getUpdatedAt().toString());
        assertThat(serializedJson).extractingJsonPathStringValue("@.updatedBy")
                .isEqualTo(expectedDocument.getUpdatedBy());
        assertThat(serializedJson).extractingJsonPathNumberValue("@.version")
                .isEqualTo(expectedDocument.getVersion());
    }

    @Test
    void testDeserialize() throws Exception {
        var document = """
        {
          "id": "123",
          "title": "Title",
          "content": [
            { "type": "paragraph", "children": [{ "text": "" }] }
          ],
          "previewUrl": "http://example.com/preview.jpg",
          "createdBy": { "uid": "123", "photoURL": "https://example.com/avatar.jpg", "displayName": "Tomer" },
          "collaborators": [],
          "permission": "Viewer",
          "createdAt": "2024-04-25T10:15:30Z",
          "updatedAt": "2024-04-25T10:15:30Z",
          "updatedBy": "Tomer",
          "version": 1
        }
        """;

        var content = List.of(Map.of(
                "type", "paragraph",
                "children", List.of(
                        Map.of("text", ""))));

        var instant = Instant.parse("2024-04-25T10:15:30Z");
        var collaborator = new Collaborator("123", "https://example.com/avatar.jpg", "Tomer");

        RichTextDocument expectedDocument = new RichTextDocument("123", "Title", content,
                "http://example.com/preview.jpg", collaborator, new HashSet<>(), "Viewer",
                instant, instant, "Tomer", 1);

        RichTextDocument parsedDocument = json.parseObject(document);

        assertThat(parsedDocument)
                .usingRecursiveComparison()
                .isEqualTo(expectedDocument);
    }
}
