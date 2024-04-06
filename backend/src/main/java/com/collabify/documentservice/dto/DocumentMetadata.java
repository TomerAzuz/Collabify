package com.collabify.documentservice.dto;

import com.collabify.documentservice.model.RichTextDocument;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DocumentMetadata {
    private String id;

    private String title;

    private String previewUrl;

    private String createdBy;

    private Instant createdAt;

    private Set<String> collaborators;

    private Instant updatedAt;

    private String updatedBy;

    private int version;

    public static DocumentMetadata mapToDocumentMetadata(RichTextDocument document) {
        return new DocumentMetadata(
                document.getId(),
                document.getTitle(),
                document.getPreviewUrl(),
                document.getCreatedBy(),
                document.getCreatedAt(),
                document.getCollaborators(),
                document.getUpdatedAt(),
                document.getUpdatedBy(),
                document.getVersion()
        );
    }
}
