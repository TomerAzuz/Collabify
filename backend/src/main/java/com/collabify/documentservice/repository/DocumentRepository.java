package com.collabify.documentservice.repository;

import com.collabify.documentservice.model.RichTextDocument;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface DocumentRepository extends MongoRepository<RichTextDocument, String> {
    @Query("{ $or: [ { 'createdBy.uid': ?0 }, { 'collaborators.uid': ?0 } ] }")
    List<RichTextDocument> findByCreatedByOrCollaboratorsOrderByUpdatedAtDesc(String userId, Sort sort);
}
