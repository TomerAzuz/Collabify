package com.collabify.documentservice.service;

import com.collabify.documentservice.dto.DocumentMetadata;
import com.collabify.documentservice.exception.DocumentNotFoundException;
import com.collabify.documentservice.annotation.RateLimited;
import com.collabify.documentservice.model.RichTextDocument;
import com.collabify.documentservice.repository.DocumentRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
public class DocumentService {

    private final DocumentRepository documentRepository;

    @Autowired
    public DocumentService(DocumentRepository documentRepository) {
        this.documentRepository = documentRepository;
    }

    @RateLimited(limit = 30) // Default window - 1 Min.
    public RichTextDocument saveDocument(RichTextDocument document, String userId) {
        String id = UUID.randomUUID().toString();
        document.setId(id);
        document.setCollaborators(new HashSet<>());
        document.setPermission("Viewer");
        document.setCreatedBy(userId);
        document.setUpdatedBy(userId);
        return documentRepository.save(document);
    }

    @RateLimited(limit = 30, window = TimeUnit.SECONDS)
    public List<DocumentMetadata> getAllDocuments(String userId) {
        List<RichTextDocument> documents = documentRepository.findByCreatedByOrCollaboratorsOrderByUpdatedAtDesc(userId, Sort.by(Sort.Direction.DESC, "updatedAt"));
        return documents.stream()
                .map(DocumentMetadata::mapToDocumentMetadata)
                .collect(Collectors.toList());
    }

    @RateLimited(limit = 30)
    public RichTextDocument getDocumentById(String id) throws JsonProcessingException {
        return documentRepository.findById(id)
                .orElseThrow(() -> new DocumentNotFoundException(id));
    }

    @RateLimited(limit = 30)
    public void deleteDocumentById(String id) {
        if (documentRepository.existsById(id)) {
            documentRepository.deleteById(id);
        } else {
            throw new DocumentNotFoundException(id);
        }
    }

    @RateLimited(limit = 30, window = TimeUnit.SECONDS)
    public RichTextDocument updateDocumentById(String id, RichTextDocument document, String userId) {
        return documentRepository.findById(id)
                .map(existingDoc -> {
                    existingDoc.setTitle(Optional.ofNullable(document.getTitle()).orElse(existingDoc.getTitle()));
                    existingDoc.setContent(Optional.ofNullable(document.getContent()).orElse(existingDoc.getContent()));
                    existingDoc.setPreviewUrl(Optional.ofNullable(document.getPreviewUrl()).orElse(existingDoc.getPreviewUrl()));
                    existingDoc.setCollaborators(Optional.ofNullable(document.getCollaborators()).orElse(existingDoc.getCollaborators()));
                    existingDoc.setPermission(Optional.ofNullable(document.getPermission()).orElse(existingDoc.getPermission()));
                    existingDoc.setUpdatedBy(userId);
                    return documentRepository.save(existingDoc);
                })
                .orElseGet(() -> saveDocument(document, userId));
    }
}
