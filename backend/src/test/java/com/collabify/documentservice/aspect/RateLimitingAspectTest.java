package com.collabify.documentservice.aspect;

import com.collabify.documentservice.annotation.RateLimited;
import com.collabify.documentservice.exception.RateLimitExceededException;
import com.collabify.documentservice.exception.UserNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class RateLimitingAspectTest {

    @Mock
    private RedisTemplate<String, Integer> redisTemplate;

    @InjectMocks
    private RateLimitingAspect aspect;

    @Mock
    private HttpServletRequest request;


    @BeforeEach
    void setup() {
        RequestAttributes attributes = new ServletRequestAttributes(request);
        RequestContextHolder.setRequestAttributes(attributes);
    }

    @Test
    void whenRateWithinLimitThenSuccess() {
        RateLimited rateLimited = mock(RateLimited.class);
        when(rateLimited.limit()).thenReturn(100);
        when(rateLimited.window()).thenReturn(TimeUnit.MINUTES);

        ValueOperations<String, Integer> valueOps = mock(ValueOperations.class);
        when(redisTemplate.opsForValue()).thenReturn(valueOps);
        when(valueOps.get("rate-limit:testClientId")).thenReturn(5);
        when(request.getAttribute("userId")).thenReturn("testClientId");

        assertDoesNotThrow(() -> aspect.rateLimitCheck(rateLimited));

        String key = "rate-limit:testClientId";
        verify(valueOps).get(key);
        verify(valueOps).increment(key, 1);
        verify(redisTemplate).expire(key, 1, TimeUnit.MINUTES);
    }

    @Test
    void whenRateLimitExceedsThenThrowException() {
        RateLimited rateLimited = mock(RateLimited.class);
        when(rateLimited.limit()).thenReturn(100);
        when(rateLimited.window()).thenReturn(TimeUnit.MINUTES);

        ValueOperations<String, Integer> valueOps = mock(ValueOperations.class);
        when(redisTemplate.opsForValue()).thenReturn(valueOps);
        when(valueOps.get("rate-limit:testClientId")).thenReturn(101);

        when(request.getAttribute("userId")).thenReturn("testClientId");

        assertThrows(RateLimitExceededException.class, () -> aspect.rateLimitCheck(rateLimited));

        verify(valueOps).get("rate-limit:testClientId");
        verify(valueOps, never()).increment(anyString(), anyInt());
    }

    @Test
    void whenUidNotFoundThenThrowException() {
        RateLimited rateLimited = mock(RateLimited.class);
        when(request.getAttribute("userId")).thenReturn(null);

        assertThrows(UserNotFoundException.class, () -> aspect.rateLimitCheck(rateLimited));

        verify(redisTemplate, never()).opsForValue();
        verify(redisTemplate, never()).expire(anyString(), anyLong(), any());
    }
}
