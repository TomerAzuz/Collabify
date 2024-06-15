package com.collabify.documentservice.controller;

import com.collabify.documentservice.service.LiveblocksService;
import com.google.firebase.auth.FirebaseAuthException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("api/liveblocks-auth")
public class LiveblocksController {

    @Autowired
    private LiveblocksService liveblocksService;

    @PostMapping
    public ResponseEntity<String> authenticateUser(@RequestAttribute("userId") String userId,
                                                   @RequestBody Map<String, String> requestBody) {
        try {
            String roomId = requestBody.get("room");
            if (roomId == null) {
                return ResponseEntity.badRequest().body("Room ID is required.");
            }

            String idToken = liveblocksService.authUser(userId, roomId);
            if (idToken != null) {
                return ResponseEntity.ok(idToken);
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to authenticate with Liveblocks");
            }
        } catch (FirebaseAuthException e) {
            throw new RuntimeException(e);
        }
    }
}