package com.collabify.documentservice.service;

import com.collabify.documentservice.exception.DocumentNotFoundException;
import com.collabify.documentservice.annotation.RateLimited;
import com.collabify.documentservice.model.RichTextDocument;
import com.collabify.documentservice.repository.DocumentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.TimeUnit;

@Service
public class DocumentService {

    @Autowired
    private DocumentRepository documentRepository;

    @RateLimited(limit = 30, window = TimeUnit.MINUTES)
    public RichTextDocument saveDocument(RichTextDocument document, String userId) {
        try {
            String id = UUID.randomUUID().toString();
            document.setId(id);
            document.setCreatedBy(userId);
            document.setUpdatedBy(userId);
            documentRepository.save(document);
            return document;
        } catch (RuntimeException e) {
            throw new RuntimeException("Failed to save document.", e);
        }
    }

    @RateLimited(limit = 30, window = TimeUnit.SECONDS)
    public List<RichTextDocument> getAllDocuments(String userId) {
        return documentRepository.findByCreatedBy(userId);
    }

    @RateLimited(limit = 30, window = TimeUnit.MINUTES)
    public RichTextDocument getDocumentById(String id) {
        return documentRepository.findById(id)
                .orElseThrow(() -> new DocumentNotFoundException(id));
    }

    @RateLimited(limit = 30, window = TimeUnit.MINUTES)
    public void deleteDocumentById(String id) {
        Optional<RichTextDocument> optionalDoc = documentRepository.findById(id);
        if (optionalDoc.isPresent()) {
            documentRepository.deleteById(id);
        } else {
            throw new DocumentNotFoundException(id);
        }
    }

    @RateLimited(limit = 50, window = TimeUnit.SECONDS)
    public RichTextDocument updateDocumentById(String id, RichTextDocument document, String userId) {
        return documentRepository.findById(id)
                .map(existingDoc -> {
                    existingDoc.setTitle(Optional.ofNullable(document.getTitle()).orElse(existingDoc.getTitle()));
                    existingDoc.setContent(Optional.ofNullable(document.getContent()).orElse(existingDoc.getContent()));
                    existingDoc.setPreviewUrl(Optional.ofNullable(document.getPreviewUrl()).orElse(existingDoc.getPreviewUrl()));
                    existingDoc.setRole(Optional.ofNullable(document.getRole()).orElse(existingDoc.getRole()));
                    existingDoc.setUpdatedBy(userId);
                    return documentRepository.save(existingDoc);
                })
                .orElseGet(() -> saveDocument(document, userId));
    }
}
