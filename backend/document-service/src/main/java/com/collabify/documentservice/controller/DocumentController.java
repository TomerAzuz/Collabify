package com.collabify.documentservice.controller;

import com.collabify.documentservice.dto.DocumentContent;
import com.collabify.documentservice.model.RichTextDocument;
import com.collabify.documentservice.service.DocumentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.List;

@RestController
@RequestMapping("api/documents")
public class DocumentController {
    private static final Logger log = LoggerFactory.getLogger(DocumentController.class);

    @Autowired
    private DocumentService documentService;

    @PostMapping
    public ResponseEntity<RichTextDocument> createDocument(@RequestBody String content, UriComponentsBuilder builder) {
        log.info("Creating a new document.");
        RichTextDocument document = new RichTextDocument();
        document.setContent(content);
        RichTextDocument savedDocument = documentService.saveDocument(document);

        return ResponseEntity
                .created(builder.path("/documents/{id}")
                        .buildAndExpand(savedDocument.getId()).toUri())
                .body(savedDocument);
    }

    @GetMapping
    public ResponseEntity<List<RichTextDocument>> getAllDocuments() {
        List<RichTextDocument> documents = documentService.getAllDocuments();
        if (documents.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(documents);
    }

    @GetMapping("{id}")
    public ResponseEntity<RichTextDocument> getDocumentById(@PathVariable("id") String id) {
        RichTextDocument document = documentService.getDocumentById(id);
        if (document == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(document);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> deleteDocument(@PathVariable("id") String id) {
        documentService.deleteDocument(id);
        return ResponseEntity.noContent().build();
    }
}
