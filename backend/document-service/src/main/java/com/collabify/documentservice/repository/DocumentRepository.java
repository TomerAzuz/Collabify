package com.collabify.documentservice.repository;

import com.collabify.documentservice.model.RichTextDocument;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface DocumentRepository extends MongoRepository<RichTextDocument, String> {}