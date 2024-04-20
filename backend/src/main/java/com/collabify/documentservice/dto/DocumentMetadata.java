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

    private Collaborator createdBy;

    private Instant createdAt;

    private Set<Collaborator> collaborators;


    public static DocumentMetadata mapToDocumentMetadata(RichTextDocument document) {
        return new DocumentMetadata(
                document.getId(),
                document.getTitle(),
                document.getPreviewUrl(),
                document.getCreatedBy(),
                document.getCreatedAt(),
                document.getCollaborators());
    }
}
