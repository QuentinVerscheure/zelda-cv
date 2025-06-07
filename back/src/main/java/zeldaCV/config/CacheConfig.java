package zeldaCV.config;

import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableCaching
public class CacheConfig {
    // Spring utilise ConcurrentMapCacheManager par défaut, aucune autre configuration n'est nécessaire.
}
