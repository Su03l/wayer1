// Toggle password visibility for multiple password fields
function togglePassword(fieldId) {
    const passwordInput = document.getElementById(fieldId);
    const toggleBtn = passwordInput.parentNode.querySelector('.password-toggle i');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleBtn.classList.remove('fa-eye');
        toggleBtn.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        toggleBtn.classList.remove('fa-eye-slash');
        toggleBtn.classList.add('fa-eye');
    }
}

// Register page functionality
document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    
    // Password visibility toggle
    window.togglePassword = function(inputId) {
        const input = document.getElementById(inputId);
        const toggleBtn = input.parentElement.querySelector('.password-toggle i');
        
        if (input.type === 'password') {
            input.type = 'text';
            toggleBtn.className = 'fas fa-eye-slash';
        } else {
            input.type = 'password';
            toggleBtn.className = 'fas fa-eye';
        }
    };
    
    // Password confirmation validation
    function validatePasswordMatch() {
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        
        if (confirmPassword && password !== confirmPassword) {
            confirmPasswordInput.parentElement.classList.add('error');
            return false;
        } else {
            confirmPasswordInput.parentElement.classList.remove('error');
            return true;
        }
    }
    
    // Real-time password match validation
    confirmPasswordInput.addEventListener('input', validatePasswordMatch);
    passwordInput.addEventListener('input', validatePasswordMatch);
    
    // Form submission
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword');
        const agree = document.getElementById('agree').checked;
        
        // Basic validation
        if (!firstName || !lastName || !email || !phone || !password) {
            showNotification('يرجى ملء جميع الحقول المطلوبة', 'error');
            return;
        }
        
        if (password !== confirmPassword.value) {
            showNotification('كلمة المرور غير متطابقة', 'error');
            return;
        }
        
        if (!agree) {
            showNotification('يجب الموافقة على الشروط والأحكام', 'error');
            return;
        }
        
        // Show loading state
        const submitBtn = this.querySelector('.auth-btn');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.classList.add('loading');
        submitBtn.innerHTML = '';
        
        // Simulate registration process
        setTimeout(() => {
            // Store user info
            const fullName = `${firstName} ${lastName}`;
            localStorage.setItem('userName', fullName);
            localStorage.setItem('userEmail', email);
            
            // Reset button
            submitBtn.classList.remove('loading');
            submitBtn.innerHTML = originalText;
            
            // Show success message
            showNotification('تم إنشاء الحساب بنجاح!', 'success');
            
            // Redirect to chatbot after 1 second
            setTimeout(() => {
                window.location.href = 'chatbot.html';
            }, 1000);
            
        }, 2000);
    });
    
    // Input focus effects
    const inputs = registerForm.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
            if (this.value.trim()) {
                this.parentElement.classList.add('success');
            } else {
                this.parentElement.classList.remove('success');
            }
        });
    });
    
    // Enhanced checkbox styling
    const checkboxes = registerForm.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const wrapper = this.parentElement;
            if (this.checked) {
                wrapper.classList.add('checked');
            } else {
                wrapper.classList.remove('checked');
            }
        });
    });
});

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    if (type === 'error') {
        notification.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
    } else if (type === 'success') {
        notification.style.background = 'linear-gradient(135deg, #27ae60, #2ecc71)';
    } else {
        notification.style.background = 'linear-gradient(135deg, #3498db, #2980b9)';
    }
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Registration success display
function showRegistrationSuccess() {
    const authCard = document.querySelector('.auth-card');
    const currentContent = authCard.innerHTML;
    
    const successContent = `
        <div class="registration-success">
            <i class="fas fa-check-circle"></i>
            <h2>تم إنشاء الحساب بنجاح!</h2>
            <p>مرحباً بك في مكتب العدالة. سيتم تحويلك تلقائياً إلى صفحة تسجيل الدخول خلال 3 ثوانٍ.</p>
            <div class="countdown">3</div>
            <button class="auth-btn" onclick="window.location.href='login.html'">
                <span>تسجيل الدخول الآن</span>
                <i class="fas fa-arrow-left"></i>
            </button>
        </div>
    `;
    
    authCard.innerHTML = successContent;
    
    // Add animation
    authCard.style.animation = 'successBounce 0.8s ease';
    
    // Reset animation after it completes
    setTimeout(() => {
        authCard.style.animation = '';
    }, 800);
    
    // Countdown and redirect
    let countdown = 3;
    const countdownElement = authCard.querySelector('.countdown');
    
    const countdownInterval = setInterval(() => {
        countdown--;
        if (countdownElement) {
            countdownElement.textContent = countdown;
        }
        
        if (countdown <= 0) {
            clearInterval(countdownInterval);
            window.location.href = 'login.html';
        }
    }, 1000);
}

// Enhanced form validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^(\+966|966|0)?[5][0-9]{8}$/;
    return re.test(phone.replace(/\s/g, ''));
}

// Real-time validation
document.addEventListener('DOMContentLoaded', function() {
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            if (this.value && !validateEmail(this.value)) {
                this.parentElement.classList.add('error');
                showNotification('يرجى إدخال بريد إلكتروني صحيح', 'error');
            } else {
                this.parentElement.classList.remove('error');
            }
        });
    }
    
    if (phoneInput) {
        phoneInput.addEventListener('blur', function() {
            if (this.value && !validatePhone(this.value)) {
                this.parentElement.classList.add('error');
                showNotification('يرجى إدخال رقم جوال صحيح', 'error');
            } else {
                this.parentElement.classList.remove('error');
            }
        });
    }
});

// Terms and conditions link
document.querySelector('.terms-link').addEventListener('click', function(e) {
    e.preventDefault();
    showSuccess('سيتم فتح الشروط والأحكام في نافذة جديدة');
});

// Initialize password strength and match indicators
document.addEventListener('DOMContentLoaded', function() {
    createPasswordStrengthIndicator();
    createPasswordMatchIndicator();
    
    // Auto-focus on first input
    document.getElementById('firstName').focus();
});

// Add ripple effect to buttons
document.querySelectorAll('.auth-btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add ripple styles
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    .auth-btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

console.log('صفحة إنشاء الحساب جاهزة! 🚀');

function goBackOrHome() {
    if (window.history.length > 1) {
        window.history.back();
    } else {
        window.location.href = 'index.html';
    }
} 