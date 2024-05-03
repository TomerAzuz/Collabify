package com.collabify.documentservice.service;

import com.collabify.documentservice.dto.Collaborator;
import com.collabify.documentservice.dto.DocumentMetadata;
import com.collabify.documentservice.exception.DocumentNotFoundException;
import com.collabify.documentservice.annotation.RateLimited;
import com.collabify.documentservice.model.RichTextDocument;
import com.collabify.documentservice.repository.DocumentRepository;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.UserRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class DocumentService {

    private final DocumentRepository documentRepository;

    private final S3Service s3Service;

    @Autowired
    public DocumentService(DocumentRepository documentRepository, S3Service s3Service) {
        this.documentRepository = documentRepository;
        this.s3Service = s3Service;
    }

    @RateLimited(limit = 60)
    public RichTextDocument createDocument(RichTextDocument document, String userId) {
        String id = UUID.randomUUID().toString();
        document.setId(id);
        document.setCollaborators(new HashSet<>());
        document.setPermission("Viewer");
        document.setUpdatedBy(userId);
        return documentRepository.save(document);
    }

    @RateLimited
    public List<DocumentMetadata> getAllDocuments(String userId) {
        List<RichTextDocument> documents = documentRepository
                .findByCreatedByOrCollaboratorsOrderByUpdatedAtDesc(userId, Sort.by(Sort.Direction.DESC, "updatedAt"));
        return documents.stream()
                .map(DocumentMetadata::mapToDocumentMetadata)
                .collect(Collectors.toList());
    }


    @RateLimited
    public RichTextDocument getDocumentById(String id, String userId) throws FirebaseAuthException {
        RichTextDocument document =  documentRepository.findById(id)
                .orElseThrow(() -> new DocumentNotFoundException(id));

        boolean isCollaborator = document.getCreatedBy().getUid().equals(userId) ||
                document.getCollaborators().stream()
                        .map(Collaborator::getUid)
                        .anyMatch(uid -> uid.equals(userId));

        if (!isCollaborator) {
            UserRecord userRecord = FirebaseAuth.getInstance().getUser(userId);
            Collaborator collaborator = new Collaborator(userRecord.getUid(),
                                                         userRecord.getPhotoUrl(),
                                                         userRecord.getDisplayName());
            document.getCollaborators().add(collaborator);
            return documentRepository.save(document);
        }
        return document;
    }

    @RateLimited
    public void deleteDocumentById(String id, String userId) {
        RichTextDocument document = documentRepository.findById(id)
                .orElseThrow(() -> new DocumentNotFoundException(id));

        boolean isOwner = document.getCreatedBy().getUid().equals(userId);
        if (isOwner) {
            String previewImageId = id + ".jpg";
            s3Service.deleteObject(previewImageId);
            documentRepository.deleteById(id);
            return;
        }
        // Remove user from collaborators set
        Set<Collaborator> updatedCollaborators = document.getCollaborators()
                .stream()
                .filter(collab -> !collab.getUid().equals(userId))
                .collect(Collectors.toSet());

        document.setCollaborators(updatedCollaborators);
        documentRepository.save(document);
    }

    @RateLimited(limit = 200)
    public RichTextDocument updateDocumentById(String id, RichTextDocument document, String userId) {
        return documentRepository.findById(id)
                .map(doc -> {
                    doc.setTitle(Optional.ofNullable(document.getTitle()).orElse(doc.getTitle()));
                    doc.setContent(Optional.ofNullable(document.getContent()).orElse(doc.getContent()));
                    doc.setPreviewUrl(Optional.ofNullable(document.getPreviewUrl()).orElse(doc.getPreviewUrl()));
                    doc.setCollaborators(Optional.ofNullable(document.getCollaborators()).orElse(doc.getCollaborators()));
                    doc.setPermission(Optional.ofNullable(document.getPermission()).orElse(doc.getPermission()));
                    doc.setUpdatedBy(userId);
                    return documentRepository.save(doc);
                })
                .orElseGet(() -> createDocument(document, userId));
    }
}
