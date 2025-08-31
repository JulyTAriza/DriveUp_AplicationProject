package com.dh.AlquilerAutosMVC.config;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CloudinaryConfig {

    @Bean
    public Cloudinary cloudinary() {
        return new Cloudinary(ObjectUtils.asMap(
                "cloud_name", "dshvpcyud",
                "api_key", "957594964365763",
                "api_secret", "4kNDm_49-Q9tziq1NStIom21Kb4"
        ));
    }
}
