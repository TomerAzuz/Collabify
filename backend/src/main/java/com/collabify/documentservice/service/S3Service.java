package com.collabify.documentservice.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.collabify.documentservice.controller.DocumentController;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Date;
import java.util.Objects;

@Service
public class S3Service {

    private static final Logger log = LoggerFactory.getLogger(DocumentController.class);
    private final AmazonS3 s3client;

    @Value("${AWS_S3_BUCKET}")
    private String bucketName;

    public S3Service(AmazonS3 s3client) {
        this.s3client = s3client;
    }

    public String uploadImage(String keyName, MultipartFile file) throws IOException {
        String contentType = getContentTypeByFilename(Objects.requireNonNull(file.getOriginalFilename()));
        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentType(contentType);

        var putObjectResult = s3client.putObject(bucketName, keyName, file.getInputStream(), metadata);
        log.info(putObjectResult.getMetadata().toString());

        int expirationInDays = 7;
        Date expirationDate = new Date(System.currentTimeMillis() + (expirationInDays * 24 * 60 * 60 * 1000));
        String url = s3client.generatePresignedUrl(
                bucketName, keyName, expirationDate).toString();

        return url;
    }

    private String getContentTypeByFilename(String filename) {
        if (filename.endsWith(".jpg") || filename.endsWith(".jpeg")) {
            return "image/jpeg";
        } else if (filename.endsWith(".png")) {
            return "image/png";
        } else {
            return "application/octet-stream";
        }
    }
}
