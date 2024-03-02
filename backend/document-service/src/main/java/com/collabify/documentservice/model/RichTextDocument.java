package com.collabify.documentservice.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "documents")
public class RichTextDocument {

    @Id
    private String id;

    private String content;
}
