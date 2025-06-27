// Toggle password visibility
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

// Make togglePassword available globally
window.togglePassword = togglePassword;

// Current step tracking
let currentStep = 1;
const totalSteps = 3;

// Email form submission
document.getElementById('emailForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    
    if (!email.trim()) {
        showError('email', 'يرجى إدخال البريد الإلكتروني');
        return;
    }
    
    if (!isValidEmail(email)) {
        showError('email', 'يرجى إدخال بريد إلكتروني صحيح');
        return;
    }
    
    // Show loading state
    const submitBtn = this.querySelector('.auth-btn');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.classList.add('loading');
    submitBtn.innerHTML = '';
    
    // Simulate API call
    setTimeout(() => {
        // Hide email form and show OTP form
        document.getElementById('emailForm').style.display = 'none';
        document.getElementById('otpForm').style.display = 'block';
        
        // Reset button
        submitBtn.classList.remove('loading');
        submitBtn.innerHTML = originalText;
        
        // Focus on first OTP input
        document.querySelector('.otp-input').focus();
        
        // Update step
        currentStep = 2;
        
        showSuccess('تم إرسال رمز التحقق إلى بريدك الإلكتروني');
        
    }, 2000);
});

// OTP form submission
document.getElementById('otpForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const otpInputs = document.querySelectorAll('.otp-input');
    let otp = '';
    let isValid = true;
    
    otpInputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('error');
        } else {
            input.classList.remove('error');
            otp += input.value;
        }
    });
    
    if (!isValid) {
        showError('otp', 'يرجى إدخال رمز التحقق كاملاً');
        return;
    }
    
    if (otp.length !== 6) {
        showError('otp', 'رمز التحقق يجب أن يكون 6 أرقام');
        return;
    }
    
    // Show loading state
    const submitBtn = this.querySelector('.auth-btn');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.classList.add('loading');
    submitBtn.innerHTML = '';
    
    // Simulate API call
    setTimeout(() => {
        // Hide OTP form and show password form
        document.getElementById('otpForm').style.display = 'none';
        document.getElementById('passwordForm').style.display = 'block';
        
        // Reset button
        submitBtn.classList.remove('loading');
        submitBtn.innerHTML = originalText;
        
        // Update step
        currentStep = 3;
        
        showSuccess('تم التحقق من الرمز بنجاح');
        
    }, 2000);
});

// Password form submission
document.getElementById('passwordForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Clear previous errors
    clearErrors();
    
    let isValid = true;
    
    if (!newPassword.trim()) {
        showError('newPassword', 'يرجى إدخال كلمة المرور الجديدة');
        isValid = false;
    } else if (newPassword.length < 8) {
        showError('newPassword', 'كلمة المرور يجب أن تكون 8 أحرف على الأقل');
        isValid = false;
    }
    
    if (!confirmPassword.trim()) {
        showError('confirmPassword', 'يرجى تأكيد كلمة المرور');
        isValid = false;
    } else if (newPassword !== confirmPassword) {
        showError('confirmPassword', 'كلمات المرور غير متطابقة');
        isValid = false;
    }
    
    if (isValid) {
        // Show loading state
        const submitBtn = this.querySelector('.auth-btn');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.classList.add('loading');
        submitBtn.innerHTML = '';
        
        // Simulate API call
        setTimeout(() => {
            // Show success message
            showPasswordResetSuccess();
            
            // Reset button
            submitBtn.classList.remove('loading');
            submitBtn.innerHTML = originalText;
            
        }, 2000);
    }
});

// OTP input handling
document.querySelectorAll('.otp-input').forEach((input, index) => {
    input.addEventListener('input', function() {
        // Remove error state
        this.classList.remove('error');
        
        // Add filled state if has value
        if (this.value.trim()) {
            this.classList.add('filled');
        } else {
            this.classList.remove('filled');
        }
        
        // Auto-focus next input
        if (this.value && index < 5) {
            document.querySelectorAll('.otp-input')[index + 1].focus();
        }
    });
    
    input.addEventListener('keydown', function(e) {
        // Allow only numbers
        if (e.key >= '0' && e.key <= '9') {
            return;
        }
        
        // Handle backspace
        if (e.key === 'Backspace' && !this.value && index > 0) {
            document.querySelectorAll('.otp-input')[index - 1].focus();
        }
        
        // Prevent other keys
        if (e.key !== 'Backspace' && e.key !== 'Tab' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
            e.preventDefault();
        }
    });
    
    input.addEventListener('paste', function(e) {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text');
        const numbers = pastedData.replace(/\D/g, '').slice(0, 6);
        
        if (numbers.length === 6) {
            document.querySelectorAll('.otp-input').forEach((input, i) => {
                input.value = numbers[i];
                input.classList.add('filled');
            });
        }
    });
});

// Validation functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Error handling functions
function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const wrapper = field.closest('.input-wrapper');
    
    if (wrapper) {
        wrapper.classList.add('error');
        
        // Remove existing error message
        const existingError = wrapper.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Add new error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i>${message}`;
        wrapper.parentNode.appendChild(errorDiv);
    } else {
        // For OTP inputs
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i>${message}`;
        errorDiv.style.textAlign = 'center';
        errorDiv.style.marginBottom = '1rem';
        document.getElementById('otpForm').insertBefore(errorDiv, document.querySelector('.otp-inputs'));
    }
}

function clearErrors() {
    // Remove all error states
    document.querySelectorAll('.input-wrapper.error').forEach(wrapper => {
        wrapper.classList.remove('error');
    });
    
    // Remove all error messages
    document.querySelectorAll('.error-message').forEach(error => {
        error.remove();
    });
}

// Success notification function
function showSuccess(message) {
    const notification = document.createElement('div');
    notification.className = 'success-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #27ae60;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(39, 174, 96, 0.3);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        font-family: 'Cairo', sans-serif;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Password reset success function
function showPasswordResetSuccess() {
    const authCard = document.querySelector('.auth-card');
    const originalContent = authCard.innerHTML;
    
    authCard.innerHTML = `
        <div class="success-animation">
            <i class="fas fa-check-circle"></i>
            <h2>تم تغيير كلمة المرور بنجاح!</h2>
            <p>سيتم تحويلك تلقائياً إلى صفحة تسجيل الدخول خلال 3 ثوانٍ.</p>
            <div class="countdown">3</div>
            <button class="auth-btn" onclick="redirectToLogin()">
                <span>تسجيل الدخول الآن</span>
                <i class="fas fa-arrow-left"></i>
            </button>
        </div>
    `;
    
    // Store original content for potential back functionality
    authCard.dataset.originalContent = originalContent;
    
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
            redirectToLogin();
        }
    }, 1000);
}

function redirectToLogin() {
    window.location.href = 'login.html';
}

// Input focus effects
document.querySelectorAll('.input-wrapper input').forEach(input => {
    input.addEventListener('focus', function() {
        this.closest('.input-wrapper').classList.add('focused');
    });
    
    input.addEventListener('blur', function() {
        this.closest('.input-wrapper').classList.remove('focused');
    });
    
    // Real-time validation
    input.addEventListener('input', function() {
        const wrapper = this.closest('.input-wrapper');
        const errorMessage = wrapper.parentNode.querySelector('.error-message');
        
        if (errorMessage) {
            wrapper.classList.remove('error');
            errorMessage.remove();
        }
        
        // Add success state for valid input
        if (this.value.trim()) {
            if (this.id === 'email' && isValidEmail(this.value)) {
                wrapper.classList.add('success');
            } else if (this.id === 'newPassword' && this.value.length >= 8) {
                wrapper.classList.add('success');
            } else if (this.id === 'confirmPassword' && this.value === document.getElementById('newPassword').value) {
                wrapper.classList.add('success');
            } else {
                wrapper.classList.remove('success');
            }
        } else {
            wrapper.classList.remove('success');
        }
    });
});

// Add focused state styles
const focusedStyle = document.createElement('style');
focusedStyle.textContent = `
    .input-wrapper.focused {
        transform: scale(1.02);
    }
    
    .input-wrapper.focused input {
        border-color: var(--secondary-color);
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
    
    .input-wrapper.success input {
        border-color: #27ae60;
        box-shadow: 0 0 0 3px rgba(39, 174, 96, 0.1);
    }
    
    .input-wrapper.success i {
        color: #27ae60;
    }
    
    .input-wrapper.error input {
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
    
    .error-message {
        color: #667eea;
        font-size: 0.8rem;
        margin-top: 0.5rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
`;
document.head.appendChild(focusedStyle);

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

// Auto-focus on first input
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('email').focus();
});

console.log('صفحة نسيت كلمة المرور جاهزة! 🔑');

function goBackOrHome() {
    if (window.history.length > 1) {
        window.history.back();
    } else {
        window.location.href = 'index.html';
    }
} 