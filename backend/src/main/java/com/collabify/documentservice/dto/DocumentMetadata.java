package com.collabify.documentservice.dto;

import com.collabify.documentservice.model.RichTextDocument;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DocumentMetadata {
    private String id;

    private String title;

    private String previewUrl;

    private String createdBy;

    private String role;

    private Instant createdAt;

    private Instant updatedAt;

    private String updatedBy;

    private int version;

    public static DocumentMetadata mapToDocumentMetadata(RichTextDocument document) {
        return new DocumentMetadata(
                document.getId(),
                document.getTitle(),
                document.getPreviewUrl(),
                document.getCreatedBy(),
                document.getRole(),
                document.getCreatedAt(),
                document.getUpdatedAt(),
                document.getUpdatedBy(),
                document.getVersion()
        );
    }
}
