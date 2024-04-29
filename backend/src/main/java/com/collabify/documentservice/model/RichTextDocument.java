package com.collabify.documentservice.model;

import com.collabify.documentservice.dto.Collaborator;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.annotation.Version;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "documents")
public class RichTextDocument {

    @Id
    private String id;

    private String title;

    @NotNull(message = "Content cannot be null")
    private List<Map<String, Object>> content;

    private String previewUrl;

    private Collaborator createdBy;

    private Set<Collaborator> collaborators;

    private String permission;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;

    private String updatedBy;

    @Version
    private int version;
}
