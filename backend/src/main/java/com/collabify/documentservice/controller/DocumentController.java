package com.collabify.documentservice.controller;

import com.collabify.documentservice.exception.DocumentNotFoundException;
import com.collabify.documentservice.dto.DocumentMetadata;
import com.collabify.documentservice.model.RichTextDocument;
import com.collabify.documentservice.service.DocumentService;

import com.collabify.documentservice.service.S3Service;
import com.fasterxml.jackson.core.JsonProcessingException;
import io.sentry.Sentry;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("api/v1/documents")
public class DocumentController {

    @Autowired
    private DocumentService documentService;

    @Autowired
    private S3Service s3Service;

    @PostMapping
    public ResponseEntity<RichTextDocument> createDocument(@RequestBody RichTextDocument document,
                                                           @RequestAttribute("userId") String userId)  {
        Sentry.captureMessage("Creating document.");

        RichTextDocument savedDocument = documentService.createDocument(document, userId);
        URI location = URI.create("/documents/" + savedDocument.getId());
        return ResponseEntity.created(location).body(savedDocument);
    }

    @GetMapping
    public ResponseEntity<List<DocumentMetadata>> getAllDocuments(@RequestAttribute("userId") String userId) {
        Sentry.captureMessage("Getting all documents for user id " + userId + ".");

        List<DocumentMetadata> documentsMetadata = documentService.getAllDocuments(userId);
        return ResponseEntity.ok(documentsMetadata);
    }

    @GetMapping("{id}")
    public ResponseEntity<RichTextDocument> getDocumentById(@PathVariable("id") String id) {
        Sentry.captureMessage("Getting document with id " + id + ".");

        try {
            RichTextDocument document = documentService.getDocumentById(id);
            return ResponseEntity.ok(document);
        } catch (DocumentNotFoundException e) {
            Sentry.captureException(e);
            return ResponseEntity.notFound().build();
        } catch (JsonProcessingException e) {
            Sentry.captureException(e);
            throw new RuntimeException(e);
        }
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> deleteDocumentById(@PathVariable("id") String id) {
        Sentry.captureMessage("Deleting document with id " + id + ".");

        documentService.deleteDocumentById(id);
        String previewImageId = id + ".jpg";
        s3Service.deleteObject(previewImageId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("{id}")
    public ResponseEntity<RichTextDocument> updateById(@PathVariable("id") String id,
                                                       @RequestBody RichTextDocument document,
                                                       @RequestAttribute("userId") String userId) {
        Sentry.captureMessage("Updating document with id " + id + ".");

        RichTextDocument updatedDoc = documentService.updateDocumentById(id, document, userId);
        return ResponseEntity.ok(updatedDoc);
    }
}
