package com.collabify.documentservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Collaborator {

    private String uid;
    private String photoURL;
    private String displayName;
}
