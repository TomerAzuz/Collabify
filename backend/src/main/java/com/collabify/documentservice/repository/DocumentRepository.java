package com.collabify.documentservice.repository;

import com.collabify.documentservice.model.RichTextDocument;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface DocumentRepository extends MongoRepository<RichTextDocument, String> {
    List<RichTextDocument> findByCreatedBy(String userId);
}
