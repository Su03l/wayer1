// Toggle password visibility
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleBtn = document.querySelector('.password-toggle i');
    
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

// Form validation and submission
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;
    
    // Clear previous error messages
    clearErrors();
    
    // Validate form
    let isValid = true;
    
    if (!email.trim()) {
        showError('email', 'يرجى إدخال البريد الإلكتروني أو رقم الجوال');
        isValid = false;
    } else if (!isValidEmail(email) && !isValidPhone(email)) {
        showError('email', 'يرجى إدخال بريد إلكتروني أو رقم جوال صحيح');
        isValid = false;
    }
    
    if (!password.trim()) {
        showError('password', 'يرجى إدخال كلمة المرور');
        isValid = false;
    } else if (password.length < 6) {
        showError('password', 'كلمة المرور يجب أن تكون 6 أحرف على الأقل');
        isValid = false;
    }
    
    if (isValid) {
        // Show loading state
        const submitBtn = document.querySelector('.auth-btn');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.classList.add('loading');
        submitBtn.innerHTML = '';
        
        // Simulate login process
        setTimeout(() => {
            // Reset button
            submitBtn.classList.remove('loading');
            submitBtn.innerHTML = originalText;
            
            // Show success message
            showNotification('تم تسجيل الدخول بنجاح!', 'success');
            
            // Redirect to chatbot page after a short delay
            setTimeout(() => {
                window.location.href = 'chatbot.html';
            }, 1500);
        }, 2000);
    }
});

// Validation functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^(\+966|966|0)?5[0-9]{8}$/;
    return phoneRegex.test(phone);
}

// Error handling functions
function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const wrapper = field.closest('.input-wrapper');
    
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

function showSuccess(message) {
    // Create success notification
    const notification = document.createElement('div');
    notification.className = 'success-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
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
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Forgot password link
document.querySelector('.forgot-password').addEventListener('click', function(e) {
    e.preventDefault();
    window.location.href = 'forgot-password.html';
});

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
        if (this.value.trim() && this.id === 'email' && (isValidEmail(this.value) || isValidPhone(this.value))) {
            wrapper.classList.add('success');
        } else if (this.value.trim() && this.id === 'password' && this.value.length >= 6) {
            wrapper.classList.add('success');
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
        box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
    }
    
    .input-wrapper.success input {
        border-color: #27ae60;
        box-shadow: 0 0 0 3px rgba(39, 174, 96, 0.1);
    }
    
    .input-wrapper.success i {
        color: #27ae60;
    }
`;
document.head.appendChild(focusedStyle);

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        const focusedElement = document.activeElement;
        if (focusedElement.tagName === 'INPUT') {
            document.getElementById('loginForm').dispatchEvent(new Event('submit'));
        }
    }
});

// Auto-focus on first input
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('email').focus();
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

console.log('صفحة تسجيل الدخول جاهزة! 🚀');

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

function goBackOrHome() {
    if (document.referrer && document.referrer.includes(window.location.origin)) {
        window.history.back();
    } else {
        window.location.href = 'index.html';
    }
} 