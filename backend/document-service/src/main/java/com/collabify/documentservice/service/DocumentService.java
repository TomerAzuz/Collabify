package com.collabify.documentservice.service;

import com.collabify.documentservice.advice.DocumentNotFoundException;
import com.collabify.documentservice.model.RichTextDocument;
import com.collabify.documentservice.repository.DocumentRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class DocumentService {

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    ObjectMapper mapper;

    public RichTextDocument saveDocument(RichTextDocument document) {
        String id = UUID.randomUUID().toString();
        document.setId(id);
        System.out.println(document.getContent());
        return documentRepository.save(document);
    }

    public List<RichTextDocument> getAllDocuments() {
        return documentRepository.findAll();
    }

    public RichTextDocument getDocumentById(String id) {
        return documentRepository.findById(id)
                .orElseThrow(() -> new DocumentNotFoundException(id));
    }

    public void deleteDocumentById(String id) {
        documentRepository.deleteById(id);
    }

    public RichTextDocument updateDocumentById(String id, RichTextDocument document) {
        return documentRepository
                .findById(id)
                .map(existingDoc -> {
                    var docToUpdate = new RichTextDocument(
                            existingDoc.getId(),
                            document.getTitle(),
                            document.getContent(),
                            document.getPreviewUrl(),
                            existingDoc.getCreatedBy(),
                            existingDoc.getCreatedAt(),
                            existingDoc.getUpdatedAt(),
                            existingDoc.getUpdatedBy(),
                            existingDoc.getVersion());
                    return documentRepository.save(docToUpdate);
                })
                .orElseGet(() -> saveDocument(document));
    }
}
