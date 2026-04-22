const rateLimitMap = new Map();

/**
 * Simple in-memory rate limiter
 * @param {string} key - Unique key for the limiter (e.g., IP address + endpoint)
 * @param {number} limit - Maximum number of requests allowed
 * @param {number} windowMs - Time window in milliseconds
 * @returns {Promise<{success: boolean, remaining: number, reset: number}>}
 */
export async function checkRateLimit(key, limit, windowMs) {
    const now = Date.now();
    const record = rateLimitMap.get(key) || { count: 0, resetTime: now + windowMs };

    if (now > record.resetTime) {
        record.count = 0;
        record.resetTime = now + windowMs;
    }

    record.count++;
    rateLimitMap.set(key, record);

    const isRateLimited = record.count > limit;
    
    return {
        success: !isRateLimited,
        remaining: Math.max(0, limit - record.count),
        reset: record.resetTime
    };
}

// Optional cleaner for memory management
setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitMap.entries()) {
        if (now > record.resetTime) {
            rateLimitMap.delete(key);
        }
    }
}, 60000); // Clean every minute
