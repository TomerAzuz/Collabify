package com.collabify.documentservice.controller;

import com.collabify.documentservice.exception.DocumentNotFoundException;
import com.collabify.documentservice.dto.DocumentMetadata;
import com.collabify.documentservice.model.RichTextDocument;
import com.collabify.documentservice.service.DocumentService;

import com.collabify.documentservice.service.S3Service;
import com.fasterxml.jackson.core.JsonProcessingException;
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

    @Autowired
    private S3Service s3Service;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public RichTextDocument createDocument(@Valid @RequestBody RichTextDocument document,
                                                           @RequestAttribute("userId") String userId)  {
        log.info("Creating document");
        return documentService.createDocument(document, userId);
    }

    @GetMapping
    public List<DocumentMetadata> getAllDocuments(@RequestAttribute("userId") String userId) {
        log.info("Getting all documents for user id {}", userId);
        return documentService.getAllDocuments(userId);
    }

    @GetMapping("{id}")
    public ResponseEntity<RichTextDocument> getDocumentById(@PathVariable("id") String id) {
        log.info("Getting document with id: {}", id);
        try {
            RichTextDocument document = documentService.getDocumentById(id);
            return ResponseEntity.ok(document);
        } catch (DocumentNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

    @DeleteMapping("{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteDocumentById(@PathVariable("id") String id) {
        log.info("Deleting document with id: {}", id);
        documentService.deleteDocumentById(id);
        String previewImageId = id + ".jpg";
        s3Service.deleteObject(previewImageId);
    }

    @PutMapping("{id}")
    public RichTextDocument updateById(@PathVariable("id") String id,
                                                       @Valid @RequestBody RichTextDocument document,
                                                       @RequestAttribute("userId") String userId) {
        log.info("Updating document with id: {}", id);
        return documentService.updateDocumentById(id, document, userId);
    }
}
