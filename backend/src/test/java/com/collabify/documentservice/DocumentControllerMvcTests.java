package com.collabify.documentservice;

import com.collabify.documentservice.dto.Collaborator;
import com.collabify.documentservice.dto.DocumentMetadata;
import com.collabify.documentservice.exception.DocumentNotFoundException;
import com.collabify.documentservice.controller.DocumentController;
import com.collabify.documentservice.model.RichTextDocument;
import com.collabify.documentservice.service.DocumentService;
import com.collabify.documentservice.service.S3Service;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.time.Instant;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(DocumentController.class)
@AutoConfigureMockMvc(addFilters = false)
public class DocumentControllerMvcTests {

    @Autowired
    MockMvc mockMvc;

    @MockBean
    DocumentService documentService;

    @Autowired
    ObjectMapper objectMapper;

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
    void whenGetDocumentNotExistingThenShouldReturn404() throws Exception {
        var id = "123";
        given(documentService.getDocumentById(id, id))
                .willThrow(DocumentNotFoundException.class);

        mockMvc
                .perform(get("/api/v1/documents/" + id)
                        .requestAttr("userId", id))
                .andExpect(status().isNotFound());
    }

    @Test
    void whenGetDocumentExistingThenShouldReturn200() throws Exception {
        var id = "123";
        var document = createDocument(id);
        given(documentService.getDocumentById(id, id)).willReturn(document);
        mockMvc
                .perform(get("/api/v1/documents/" + id)
                        .requestAttr("userId", id))
                .andExpect(status().isOk());
    }

    @Test
    void whenGetAllDocumentsThenShouldReturn200() throws Exception {
        var collab = new Collaborator("123",
                "https://example.com/avatar.jpg",
                "username");
        var id1 = "123";
        var doc1 = createDocument(id1);
        doc1.setCreatedBy(collab);

        var id2 = "456";
        var doc2 = createDocument(id2);
        doc2.setCreatedBy(collab);

        List<DocumentMetadata> documentsMetadata = List.of(
                DocumentMetadata.mapToDocumentMetadata(doc1),
                DocumentMetadata.mapToDocumentMetadata(doc2));

        given(documentService.getAllDocuments(anyString())).willReturn(documentsMetadata);

        mockMvc.perform(MockMvcRequestBuilders.get("/api/v1/documents")
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON)
                        .requestAttr("userId", collab.getUid()))
                .andExpect(status().isOk());
    }

    @Test
    void whenPostDocumentThenShouldReturn201() throws Exception {
        var userId = UUID.randomUUID().toString();
        var id = "123";
        var document = createDocument(id);

        String requestBody = objectMapper.writeValueAsString(document);
        given(documentService.createDocument(any(RichTextDocument.class), eq(userId))).willReturn(document);

        mockMvc.perform(MockMvcRequestBuilders.post("/api/v1/documents")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody)
                        .requestAttr("userId", userId))
                .andExpect(status().isCreated());
    }

    @Test
    void whenPutDocumentThenShouldReturn200() throws Exception {
        var userId = UUID.randomUUID().toString();
        String id = "123";
        var documentToCreate = createDocument(id);

        String requestBody = objectMapper.writeValueAsString(documentToCreate);
        given(documentService.createDocument(any(RichTextDocument.class), eq(userId))).willReturn(documentToCreate);

        mockMvc.perform(MockMvcRequestBuilders.put("/api/v1/documents/" + id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody)
                        .requestAttr("userId", userId))
                .andExpect(status().isOk());
    }

    @Test
    void whenDeleteDocumentThenShouldReturn204() throws Exception {
        var userId = UUID.randomUUID().toString();
        mockMvc
                .perform(delete("/api/v1/documents/123")
                        .requestAttr("userId", userId))
                .andExpect(status().isNoContent());
    }
}
