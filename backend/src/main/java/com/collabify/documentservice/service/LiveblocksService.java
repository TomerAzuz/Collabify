package com.collabify.documentservice.service;

import com.collabify.documentservice.dto.Collaborator;
import com.collabify.documentservice.dto.LiveblocksAuthRequest;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.UserRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class LiveblocksService {

    private static final Logger log = LoggerFactory.getLogger(LiveblocksService.class);

    @Value("${liveblocks.key}")
    private String key;

    public String authUser(String userId, String roomId) throws FirebaseAuthException {
        // Get user details from firebase
        UserRecord userRecord = FirebaseAuth.getInstance().getUser(userId);
        Collaborator userInfo = new Collaborator(userRecord.getUid(),
                userRecord.getPhotoUrl(),
                userRecord.getDisplayName());

        // Set room permissions for user
        Map<String, String[]> permissions = new HashMap<>();

        permissions.put(roomId, new String[]{"room:write"});
        LiveblocksAuthRequest request = new LiveblocksAuthRequest(userId, userInfo, permissions);

        // Set the authorization header
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + key);

        HttpEntity<LiveblocksAuthRequest> requestBody = new HttpEntity<>(request, headers);

        RestTemplate restTemplate = new RestTemplate();
        String apiUrl = "https://api.liveblocks.io/v2/authorize-user";

        try {
            ResponseEntity<String> response = restTemplate.exchange(apiUrl, HttpMethod.POST, requestBody, String.class);
            return response.getBody();
        } catch (Exception e) {
            return null;
        }
    }

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