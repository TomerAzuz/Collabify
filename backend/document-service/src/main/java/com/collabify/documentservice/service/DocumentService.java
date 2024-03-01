package com.collabify.documentservice.service;

import com.collabify.documentservice.advice.DocumentNotFoundException;
import com.collabify.documentservice.model.RichTextDocument;
import com.collabify.documentservice.repository.DocumentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class DocumentService {

    @Autowired
    private DocumentRepository documentRepository;

    public RichTextDocument saveDocument(RichTextDocument document) {
        String id = UUID.randomUUID().toString();
        document.setId(id);
        return documentRepository.save(document);
    }

    public List<RichTextDocument> getAllDocuments() {
        return documentRepository.findAll();
    }

    public RichTextDocument getDocumentById(String id) {
        return documentRepository.findById(id)
                .orElseThrow(() -> new DocumentNotFoundException(id));
    }

    public void deleteDocument(String id) {
        documentRepository.deleteById(id);
    }
}
