package com.collabify.documentservice.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.collabify.documentservice.annotation.RateLimited;
import com.collabify.documentservice.controller.DocumentController;
import io.sentry.Sentry;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.Objects;

@Service
public class S3Service {

    private static final Logger log = LoggerFactory.getLogger(DocumentController.class);
    private final AmazonS3 s3client;

    @Value("${AWS_S3_BUCKET}")
    private String bucketName;

    @Value("${AWS_CLOUDFRONT_DOMAIN}")
    private String cloudFrontDomain;


    public S3Service(AmazonS3 s3client) {
        this.s3client = s3client;
    }


    @RateLimited(limit = 60)
    public void uploadImage(String keyName, MultipartFile file) throws IOException {
        String contentType = getContentTypeByFilename(Objects.requireNonNull(file.getOriginalFilename()));
        ObjectMetadata metadata = new ObjectMetadata();

        metadata.setContentType(contentType);
        metadata.setContentLength(file.getSize());

        try (InputStream inputStream = file.getInputStream()) {
            s3client.putObject(bucketName, keyName, inputStream, metadata);
            Sentry.captureMessage("Uploaded image: " + keyName);
        } catch (IOException e) {
            Sentry.captureException(e);
        }
    }

    public void deleteObject(String keyName) {
        s3client.deleteObject(bucketName, keyName);
        Sentry.captureMessage("Deleted image: " + keyName);
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
