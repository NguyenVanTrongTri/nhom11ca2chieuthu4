// ============================================
// Authentication JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
});

// Handle Login
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;
    
    try {
        const response = await loginUser(email, password);
        
        if (response.success) {
            // Save user data
            localStorage.setItem('currentUser', JSON.stringify(response.user));
            localStorage.setItem('authToken', response.token);
            
            if (remember) {
                localStorage.setItem('rememberEmail', email);
            }
            
            // Show success message
            showNotification('Đăng nhập thành công!', 'success');
            
            // Redirect based on user role
            setTimeout(() => {
                const role = response.user.role?.toUpperCase();
                if (role === 'ADMIN') {
                    window.location.href = 'user/dashboard.html';
                } else {
                    window.location.href = 'user/dashboard.html';
                }
            }, 1000);
        } else {
            showNotification(response.message || 'Đăng nhập thất bại', 'danger');
        }
    } catch (error) {
        showNotification('Lỗi: ' + error.message, 'danger');
        console.error('Login error:', error);
    }
}

// Handle Register
async function handleRegister(e) {
    e.preventDefault();
    
    const fullname = document.getElementById('fullname').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    // Validate passwords
    if (password !== confirmPassword) {
        showNotification('Mật khẩu không khớp', 'danger');
        return;
    }
    
    if (password.length < 6) {
        showNotification('Mật khẩu phải có ít nhất 6 ký tự', 'danger');
        return;
    }
    
    try {
        const response = await registerUser(fullname, email, password);
        
        if (response.success) {
            showNotification('Đăng ký thành công! Vui lòng đăng nhập.', 'success');
            
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
        } else {
            showNotification(response.message || 'Đăng ký thất bại', 'danger');
        }
    } catch (error) {
        showNotification('Lỗi: ' + error.message, 'danger');
        console.error('Register error:', error);
    }
}

async function loginUser(email, password) {
    try {
        // Gọi API thật đến Server Render
        const response = await fetch(CONFIG.getEndpointUrl(CONFIG.ENDPOINTS.LOGIN), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email, 
                password: password
            })
        });

        // Chờ Server phản hồi dữ liệu thật
        const data = await response.json();

        if (response.ok) {
            // Lấy thông tin thật từ Database trả về
            return {
                success: true,
                user: {
                    email: data.email,
                    role: data.role // Trả về 'ADMIN' hoặc 'USER' thật
                },
                token: data.token // JWT token thật để dùng cho các request sau
            };
        } else {
            return {
                success: false,
                message: data.message || 'Email hoặc mật khẩu không chính xác'
            };
        }
    } catch (error) {
        // Lỗi này xảy ra khi không thể kết nối tới Server
        console.error('Fetch error:', error);
        return {
            success: false,
            message: 'Không thể kết nối đến server Backend User'
        };
    }
}

async function registerUser(fullname, email, password) {
    try {
        const response = await fetch(CONFIG.getEndpointUrl(CONFIG.ENDPOINTS.REGISTER), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                // Lấy fullName gán cho username để thỏa mãn điều kiện bắt buộc của Java
                username: fullname,     
                fullName: fullname,     // Khớp với @Column(name = "full_name") trong Java
                email: email,           // Khớp với @Column(unique = true)
                password: password,
                role: "USER"            // Gán cứng role USER để tránh lỗi 400
            })
        });

        if (response.ok) {
            return { success: true };
        } else {
            const data = await response.json();
            return {
                success: false,
                message: data.message || 'Đăng ký thất bại'
            };
        }
    } catch (error) {
        return {
            success: false,
            message: 'Lỗi kết nối khi đăng ký'
        };
    }
}

// Show notification
function showNotification(message, type = 'info') {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show`;
    alert.setAttribute('role', 'alert');
    alert.style.marginBottom = '1rem';
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    const form = document.querySelector('.auth-form') || document.body;
    form.insertBefore(alert, form.firstChild);
    
    // Auto dismiss
    setTimeout(() => {
        alert.remove();
    }, 5000);
}

// Check for remembered email
window.addEventListener('load', () => {
    const rememberedEmail = localStorage.getItem('rememberEmail');
    if (rememberedEmail) {
        const emailInput = document.getElementById('email');
        if (emailInput) {
            emailInput.value = rememberedEmail;
        }
    }
});
