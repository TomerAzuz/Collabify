package com.collabify.documentservice.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

@Service
public class LiveblocksService {

    private static final Logger log = LoggerFactory.getLogger(LiveblocksService.class);

    @Value("${liveblocks.key}")
    private String key;

    public void deleteRoom(String roomId) {
        RestTemplate restTemplate = new RestTemplate();

        String apiUrl = "https://api.liveblocks.io/v2/rooms/" + roomId;

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + key);

        try {
            ResponseEntity<String> response = restTemplate.exchange(apiUrl, HttpMethod.DELETE, new HttpEntity<>(headers), String.class);

            if (response.getStatusCode() == HttpStatus.NO_CONTENT) {
                log.info("Room with id {} was deleted", roomId);
            } else {
                log.error("Liveblocks error: {}", response.getStatusCode());
            }
        } catch (HttpClientErrorException e) {
            log.error("Liveblocks client error: {}", e.getStatusCode());
        } catch (Exception e) {
            log.error("Exception while deleting room: {}", e.getMessage());
        }
    }
}
