package com.collabify.documentservice.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.*;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "documents")
public class RichTextDocument {

    @Id
    private String id;

    private String title;

    private List<Map<String, Object>> content;

    private String previewUrl;

    @CreatedBy
    private String createdBy;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;

    @LastModifiedBy
    private String updatedBy;

    @Version
    private int version;
}
