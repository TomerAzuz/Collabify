package com.collabify.documentservice.model;

import com.google.cloud.firestore.annotation.DocumentId;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.annotation.Version;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "documents")
public class RichTextDocument {

    @DocumentId
    private String id;

    private String title;

    private List<Map<String, Object>> content;

    private List<Revision> revisions;

    private String previewUrl;

    private String createdBy;

    private String role;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;

    private String updatedBy;

    @Version
    private int version;
}
