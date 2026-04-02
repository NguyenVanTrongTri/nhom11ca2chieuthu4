package com.nhom11.admin.security;

import com.nhom11.admin.service.CustomUserDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private CustomUserDetailsService userDetailsService; // lấy thông tin user từ email

    //phần xử lý quan trọng nhất
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {
        // authenzization: phân quyền
        //authorication:xác thực (chứa email,usernam ,vv)

       // Client thường gửi token trong header
        final String authHeader = request.getHeader("Authorization");

        //xly khi token ko hợp lệ
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            //cho request đi tiếp
            filterChain.doFilter(request, response);
            return;
        }
        //lấy token thực
        String token = authHeader.substring(7);
        //lấy email từ token
        String email = jwtUtil.extractEmail(token);


        //•	Nếu có email và chưa có thông tin xác thực trong SecurityContext
        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            // lấy thông tin user thoong qua email
            var userDetails = userDetailsService.loadUserByUsername(email);

            // kiểm tra token có hợp lệ ko
            if (jwtUtil.validateToken(token)) {
                //nếu hợp lệ sẽ tạo thông tin xác thực trong SecurityContext
                // Spring Security biết request này thuộc về user nào và có quyền gì.
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        filterChain.doFilter(request, response);
    }
}
