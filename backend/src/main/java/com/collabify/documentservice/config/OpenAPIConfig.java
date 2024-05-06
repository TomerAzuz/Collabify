package com.collabify.documentservice.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenAPIConfig {

    @Value("${server.url}")
    private String serverUrl;

    @Bean
    public OpenAPI defineOpenApi() {
        Server server = new Server();
        server.setUrl(serverUrl);

        Info information = new Info()
                .title("Document Management API")
                .version("1.0")
                .description("This API exposes endpoints to manage documents.");

        return new OpenAPI().info(information).servers(List.of(server));
    }
}
