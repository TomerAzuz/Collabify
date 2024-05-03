package com.collabify.documentservice.controller;

import com.collabify.documentservice.dto.DocumentMetadata;
import com.collabify.documentservice.exception.DocumentNotFoundException;
import com.collabify.documentservice.model.RichTextDocument;
import com.collabify.documentservice.service.DocumentService;
import com.google.firebase.auth.FirebaseAuthException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/documents")
public class DocumentController {
    private static final Logger log = LoggerFactory.getLogger(DocumentController.class);

    @Autowired
    private DocumentService documentService;

    @PostMapping
    @Operation(summary = "Create a document",
            description = "Create a new document. The response is the new Document object.")
    public ResponseEntity<RichTextDocument> createDocument(@Valid @RequestBody RichTextDocument document,
                                                           @RequestAttribute("userId") String userId) {
        log.info("Creating a new document");
        try {
            RichTextDocument createdDocument = documentService.createDocument(document, userId);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdDocument);
        } catch (Exception e) {
            log.error("Error creating document", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Tag(name = "get", description = "GET methods of Document API")
    @GetMapping
    public ResponseEntity<List<DocumentMetadata>> getAllDocuments(@RequestAttribute("userId") String userId) {
        log.info("Getting all documents for user id {}", userId);
        try {
            List<DocumentMetadata> documents = documentService.getAllDocuments(userId);
            return ResponseEntity.ok(documents);
        } catch (Exception e) {
            log.error("Error getting all documents", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Tag(name = "get", description = "GET methods of Document API")
    @GetMapping("{id}")
    public ResponseEntity<RichTextDocument> getDocumentById(@PathVariable("id") String id,
                                                            @RequestAttribute("userId") String userId) {
        log.info("Getting document with id: {}", id);
        try {
            RichTextDocument document = documentService.getDocumentById(id, userId);
            return ResponseEntity.ok(document);
        } catch (DocumentNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            if (e instanceof FirebaseAuthException) {
                log.error("Firebase Authentication Error: {}", e.getMessage());
            } else {
                log.error("Error getting document", e);
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("{id}")
    @Operation(summary = "Delete a document",
            description = "Delete an existing document.")
    public ResponseEntity<Void> deleteDocumentById(@PathVariable("id") String id,
                                                   @RequestAttribute("userId") String userId) {
        log.info("Deleting document with id: {}", id);
        try {
            documentService.deleteDocumentById(id, userId);
            return ResponseEntity.noContent().build();
        } catch (DocumentNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Error deleting document", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("{id}")
    @Operation(summary = "Update a document",
            description = "Update an existing document. The response is the updated Document object.")
    public ResponseEntity<RichTextDocument> updateById(@PathVariable("id") String id,
                                                       @Valid @RequestBody RichTextDocument document,
                                                       @RequestAttribute("userId") String userId) {
        log.info("Updating document with id: {}", id);
        try {
            RichTextDocument updatedDocument = documentService.updateDocumentById(id, document, userId);
            return ResponseEntity.ok(updatedDocument);
        } catch (DocumentNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Error updating document", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
