package com.collabify.documentservice;

import com.collabify.documentservice.advice.DocumentNotFoundException;
import com.collabify.documentservice.controller.DocumentController;
import com.collabify.documentservice.model.RichTextDocument;
import com.collabify.documentservice.service.DocumentService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;
import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(DocumentController.class)
public class DocumentControllerMvcTests {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private DocumentService documentService;

    @Autowired
    private ObjectMapper objectMapper;

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
                now,
                now,
                "Tomer",
                0);
    }

    @Test
    void whenGetDocumentNotExistingThenShouldReturn404() throws Exception {
        var id = "123";
        given(documentService.getDocumentById(id))
                .willThrow(DocumentNotFoundException.class);
        mockMvc
                .perform(get("/api/documents/" + id))
                .andExpect(status().isNotFound());
    }

    @Test
    void whenGetDocumentExistingThenShouldReturn200() throws Exception {
        var id = "123";
        var document = createDocument(id);
        given(documentService.getDocumentById(id)).willReturn(document);
        mockMvc
                .perform(get("/api/documents/" + id))
                .andExpect(status().isOk());
    }

    @Test
    void whenGetAllDocumentsThenShouldReturn200() throws Exception {
        var id1 = "123";
        var doc1 = createDocument(id1);

        var id2 = "456";
        var doc2 = createDocument(id2);
        given(documentService.getAllDocuments()).willReturn(List.of(doc1, doc2));
        mockMvc
                .perform(get("/api/documents"))
                .andExpect(status().isOk());
    }

    @Test
    void whenPostDocumentThenShouldReturn201() throws Exception {
        var id = "123";
        var document = createDocument(id);

        String requestBody = objectMapper.writeValueAsString(document);
        given(documentService.saveDocument(any(RichTextDocument.class))).willReturn(document);
        mockMvc
                .perform(post("/api/documents")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isCreated());
    }

    @Test
    void whenPutDocumentThenShouldReturn200() throws Exception {
        String id = "123";
        var documentToCreate = createDocument(id);

        String requestBody = objectMapper.writeValueAsString(documentToCreate);
        given(documentService.saveDocument(any(RichTextDocument.class))).willReturn(documentToCreate);
        mockMvc
                .perform(put("/api/documents/" + id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isOk());
    }

    @Test
    void whenDeleteDocumentThenShouldReturn204() throws Exception {
        mockMvc
                .perform(delete("/api/documents/123"))
                .andExpect(status().isNoContent());
    }
}
