package com.collabify.documentservice.advice;

public class DocumentNotFoundException extends RuntimeException {

    public DocumentNotFoundException(String id) {
        super("The document with id " + id + " was not found.");
    }
}
