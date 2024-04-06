package com.collabify.documentservice;

import com.collabify.documentservice.exception.DocumentNotFoundException;
import com.collabify.documentservice.model.RichTextDocument;
import com.collabify.documentservice.repository.DocumentRepository;
import com.collabify.documentservice.service.DocumentService;
import com.fasterxml.jackson.core.JsonProcessingException;
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
                "preview",
                "Tomer",
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

        when(documentRepository.findById(id)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> documentService.getDocumentById(id))
                .isInstanceOf(DocumentNotFoundException.class)
                .hasMessage("The document with id " + id + " was not found.");
    }

    @Test
    void whenDocumentExistsThenReturns() throws JsonProcessingException {
        var id = "123";
        var document = createDocument(id);

        when(documentRepository.findById(id)).thenReturn(Optional.of(document));

        assertThat(documentService.getDocumentById(id))
                .isEqualTo(document);
    }

    @Test
    void whenDocumentSavedThenReturns() {
        var id = "123";
        var document = createDocument(id);
        var userId = UUID.randomUUID().toString();

        when(documentRepository.save(document)).thenReturn(document);

        var savedDocument = documentService.saveDocument(document, userId);

        assertThat(savedDocument).isNotNull();
        assertThat(savedDocument.getId()).isEqualTo(document.getId());
        assertThat(savedDocument.getContent()).isEqualTo(document.getContent());

        verify(documentRepository, times(1)).save(document);
    }

    @Test
    void whenExistingDocumentDeletedThenReturns() {
        String id = "123";

        when(documentRepository.existsById(id)).thenReturn(true);
        documentService.deleteDocumentById(id);

        verify(documentRepository, times(1)).existsById(id);
        verify(documentRepository, times(1)).deleteById(id);
    }

    @Test
    void whenNonExistingDocumentDeletedThenThrows() {
        var id = "123";
        when(documentRepository.existsById(id)).thenReturn(false);
        assertThatThrownBy(() -> documentService.deleteDocumentById(id))
                .isInstanceOf(DocumentNotFoundException.class)
                .hasMessage("The document with id " + id + " was not found.");
    }
}
