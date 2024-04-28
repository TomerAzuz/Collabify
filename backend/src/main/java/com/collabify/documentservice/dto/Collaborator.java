package com.collabify.documentservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Collaborator {

    @NotBlank(message = "UID cannot be null")
    private String uid;

    @Pattern(regexp = "(http|https)://[^\\s]+\\.(?:jpg|jpeg|png|gif)", message = "Invalid photo URL format")
    private String photoURL;

    @NotBlank(message = "Display Name cannot be blank")
    private String displayName;
}
