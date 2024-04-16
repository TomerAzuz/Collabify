package com.collabify.documentservice.exception;

public class RevisionNotFoundException extends RuntimeException {
    public RevisionNotFoundException(String id) {
        super("The revision with id " + id + " was not found.");
    }
}
