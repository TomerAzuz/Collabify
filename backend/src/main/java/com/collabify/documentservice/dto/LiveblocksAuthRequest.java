package com.collabify.documentservice.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.Map;

@Getter
@AllArgsConstructor
public class LiveblocksAuthRequest {

    private String userId;

    private Collaborator userInfo;

    private Map<String, String[]> permissions;
}