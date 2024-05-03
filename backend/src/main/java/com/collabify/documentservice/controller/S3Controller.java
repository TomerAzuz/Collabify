package com.collabify.documentservice.controller;

import com.collabify.documentservice.service.S3Service;
import io.swagger.v3.oas.annotations.Operation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("api/v1/s3")
public class S3Controller {
    private static final Logger log = LoggerFactory.getLogger(DocumentController.class);

    private final S3Service s3Service;

    public S3Controller(S3Service s3Service) {
        this.s3Service = s3Service;
    }

    @PostMapping("/upload")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Upload a new image.",
               description = "Create a new image in an AWS S3 bucket.")
    public void uploadFile(@RequestParam("file") MultipartFile file) {
        log.info("Uploading image");
        s3Service.uploadImage(file.getOriginalFilename(), file);
    }
}
