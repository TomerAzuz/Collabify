package com.collabify.documentservice.advice;

import com.collabify.documentservice.exception.DocumentNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class DocumentControllerAdvice {

    @ExceptionHandler
    @ResponseStatus(HttpStatus.NOT_FOUND)
    String documentNotFoundHandler(DocumentNotFoundException ex) {
        return ex.getMessage();
    }
}
