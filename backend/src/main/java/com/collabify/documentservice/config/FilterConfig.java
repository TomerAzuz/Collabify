package com.collabify.documentservice.config;

import com.collabify.documentservice.filter.FirebaseAuthFilter;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FilterConfig {

    @Bean
    public FilterRegistrationBean<FirebaseAuthFilter> firebaseAuthFilterFilter() {
        FilterRegistrationBean<FirebaseAuthFilter> registrationBean = new FilterRegistrationBean<>();
        registrationBean.setFilter(new FirebaseAuthFilter());
        registrationBean.addUrlPatterns("/api/*");
        return registrationBean;
    }
}
