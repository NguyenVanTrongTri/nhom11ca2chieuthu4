@Bean
public CorsFilter corsFilter() {
    CorsConfiguration configuration = new CorsConfiguration();
    
  
    configuration.setAllowedOriginPatterns(Arrays.asList(
        "https://frontend-admin-jctj.onrender.com", 
        "https://frontend-user-getq.onrender.com",
        "http://localhost:[*]",  
        "http://127.0.0.1:[*]"
    ));
    
    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
    configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Cache-Control", "Accept"));
    configuration.setAllowCredentials(true);
    configuration.setExposedHeaders(Arrays.asList("Authorization"));

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    
    return new CorsFilter(source);
}
