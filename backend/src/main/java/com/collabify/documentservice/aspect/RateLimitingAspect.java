package com.collabify.documentservice.aspect;

import com.collabify.documentservice.annotation.RateLimited;
import com.collabify.documentservice.exception.RateLimitExceededException;
import com.collabify.documentservice.exception.UserNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.Objects;
import java.util.concurrent.TimeUnit;

@Aspect
@Component
public class RateLimitingAspect {

    private final RedisTemplate<String, Integer> redisTemplate;
    private final static Logger log = LoggerFactory.getLogger(RateLimitingAspect.class);

    @Autowired
    public RateLimitingAspect(RedisTemplate<String, Integer> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    @Before("@annotation(com.collabify.documentservice.annotation.RateLimited)")
    public void rateLimitCheck(RateLimited rateLimited) {
        String clientId = getClientId();

        int limit = rateLimited.limit();
        TimeUnit window = rateLimited.window();

        String key = "rate-limit:" + clientId;

        redisTemplate.opsForValue().increment(key, 1);
        redisTemplate.expire(key, window.toMinutes(1), window);

        Integer requestCount = redisTemplate.opsForValue().get(key);

        if (requestCount != null && requestCount > limit) {
            log.warn("Rate limit exceeded for client " + clientId);
            throw new RateLimitExceededException("Rate limit exceeded for client: " + clientId);
        }
    }

    private String getClientId() {
        HttpServletRequest request = ((ServletRequestAttributes) Objects.requireNonNull(RequestContextHolder.getRequestAttributes())).getRequest();
        String uid = (String) request.getAttribute("userId");
        if (uid != null) {
            return uid;
        } else {
            throw new UserNotFoundException("UID not found.");
        }
    }
    @AfterThrowing(pointcut = "@annotation(com.collabify.documentservice.annotation.RateLimited)", throwing = "ex")
    public ResponseEntity<Object> handleRateLimitException(RateLimitExceededException ex) {
        String errorMessage = "Rate limit exceeded. Please try again later.";
        return new ResponseEntity<>(errorMessage, HttpStatus.TOO_MANY_REQUESTS);
    }
}
