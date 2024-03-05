package com.collabify.documentservice.controller;

import com.collabify.documentservice.advice.DocumentNotFoundException;
import com.collabify.documentservice.model.RichTextDocument;
import com.collabify.documentservice.service.DocumentService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("api/documents")
public class DocumentController {
    private static final Logger log = LoggerFactory.getLogger(DocumentController.class);

    @Autowired
    private DocumentService documentService;


    @PostMapping
    public ResponseEntity<RichTextDocument> createDocument(@RequestBody RichTextDocument document) {
        log.info("Creating a new document.");
        RichTextDocument savedDocument = documentService.saveDocument(document);
        URI location = URI.create("/documents/" + savedDocument.getId());
        return ResponseEntity
                .created(location)
                .body(savedDocument);
    }

    @GetMapping
    public ResponseEntity<List<RichTextDocument>> getAllDocuments() {
        log.info("Getting all documents.");
        List<RichTextDocument> documents = documentService.getAllDocuments();
        if (documents.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(documents);
    }

    @GetMapping("{id}")
    public ResponseEntity<RichTextDocument> getDocumentById(@PathVariable("id") String id) {
        log.info("Getting document with id: {}.", id);
        try {
            RichTextDocument document = documentService.getDocumentById(id);
            return ResponseEntity.ok(document);
        } catch (DocumentNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> deleteDocumentById(@PathVariable("id") String id) {
        log.info("Deleting document with id: {}.", id);
        documentService.deleteDocumentById(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("{id}")
    public ResponseEntity<RichTextDocument> updateById(@PathVariable("id") String id, @RequestBody RichTextDocument document) {
        log.info("Updating document with id: {}.", id);
        RichTextDocument updatedDoc = documentService.updateDocumentById(id, document);
        return ResponseEntity.ok(updatedDoc);
    }
}
