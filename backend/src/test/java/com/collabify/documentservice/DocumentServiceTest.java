package com.collabify.documentservice;

import com.collabify.documentservice.dto.Collaborator;
import com.collabify.documentservice.exception.DocumentNotFoundException;
import com.collabify.documentservice.model.RichTextDocument;
import com.collabify.documentservice.repository.DocumentRepository;
import com.collabify.documentservice.service.DocumentService;
import com.collabify.documentservice.service.LiveblocksService;
import com.collabify.documentservice.service.S3Service;
import com.google.firebase.auth.FirebaseAuthException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class DocumentServiceTest {

    @Mock
    private DocumentRepository documentRepository;

    @InjectMocks
    private DocumentService documentService;

    @Mock
    private S3Service s3Service;

    @Mock
    private LiveblocksService liveblocksService;

    private RichTextDocument createDocument(String id) {
        var now = Instant.now();

        List<Map<String, Object>> content = List.of(Map.of(
                "type", "paragraph",
                "children", List.of(
                        Map.of("text", "A line of text in a paragraph"))));

        return new RichTextDocument(
                id,
                "title",
                content,
                "http://example.com/preview.jpg",
                new Collaborator("123",
                        "https://example.com/avatar.jpg",
                        "username"),
                new HashSet<>(),
                "Viewer",
                now,
                now,
                "Tomer",
                0);
    }

    @Test
    void whenDocumentDoesNotExistThenThrows() {
        var id = "123";
        var userId = "1";
        when(documentRepository.findById(id)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> documentService.getDocumentById(id, userId))
                .isInstanceOf(DocumentNotFoundException.class)
                .hasMessage("The document with id " + id + " was not found.");
    }

    @Test
    void whenDocumentExistsThenReturns() throws FirebaseAuthException {
        var id = "123";
        var userId = "123";
        var document = createDocument(id);

        when(documentRepository.findById(id)).thenReturn(Optional.of(document));

        assertThat(documentService.getDocumentById(id, userId))
                .isEqualTo(document);
    }

    @Test
    void whenDocumentSavedThenReturns() {
        var id = "123";
        var document = createDocument(id);
        var userId = UUID.randomUUID().toString();

        when(documentRepository.save(document)).thenReturn(document);

        var savedDocument = documentService.createDocument(document, userId);

        assertThat(savedDocument).isNotNull();
        assertThat(savedDocument.getId()).isEqualTo(document.getId());
        assertThat(savedDocument.getContent()).isEqualTo(document.getContent());

        verify(documentRepository, times(1)).save(document);
    }

    @Test
    void whenExistingDocumentDeletedThenReturns() {
        var id = "123";
        var document = createDocument(id);

        when(documentRepository.findById(id)).thenReturn(Optional.of(document));
        doNothing().when(s3Service).deleteObject(id + ".jpg");
        doNothing().when(liveblocksService).deleteRoom(id);

        documentService.deleteDocumentById(id, id);

        verify(s3Service, times(1)).deleteObject(id + ".jpg");
        verify(documentRepository, times(1)).deleteById(id);
    }

    @Test
    void whenNonExistingDocumentDeletedThenThrows() {
        var id = "123";

        when(documentRepository.findById(id)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> documentService.deleteDocumentById(id, id))
                .isInstanceOf(DocumentNotFoundException.class)
                .hasMessage("The document with id " + id + " was not found.");
    }

    @Test
    void whenDeleteDocumentNotOwnerThenRemoveCollaborator() {
        var id = "123";
        var collab = new Collaborator("collab123", "", "username");
        var document = createDocument(id);
        document.getCollaborators().add(collab);

        when(documentRepository.findById(id)).thenReturn(Optional.of(document));

        documentService.deleteDocumentById(id, collab.getUid());

        verify(s3Service, times(0)).deleteObject(id + ".jpg");
        verify(documentRepository, times(0)).deleteById(id);
        verify(documentRepository, times(1)).save(document);
    }
}
