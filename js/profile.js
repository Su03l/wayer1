// Profile JavaScript
document.addEventListener('DOMContentLoaded', function() {
    setupProfileHandlers();
    setupPasswordHandlers();
    setupSettingsHandlers();
    setupSectionNavigation();
});

// Profile Handlers
function setupProfileHandlers() {
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData);
            
            // Update profile view fields
            const profileFields = document.querySelectorAll('.field-value');
            if (profileFields.length > 0) {
                // Update profile view with new data
                const firstName = document.getElementById('firstName').value;
                const lastName = document.getElementById('lastName').value;
                const email = document.getElementById('email').value;
                const phone = document.getElementById('phone').value;
                const birthDate = document.getElementById('birthDate').value;
                const gender = document.getElementById('gender').value;
                const address = document.getElementById('address').value;
                
                // Update profile view
                profileFields[0].textContent = firstName; // الاسم الأول
                profileFields[1].textContent = lastName; // الاسم الأخير
                profileFields[2].textContent = email; // البريد الإلكتروني
                profileFields[3].textContent = phone; // رقم الجوال
                
                // Format birth date
                if (birthDate) {
                    const date = new Date(birthDate);
                    const formattedDate = date.toLocaleDateString('ar-SA');
                    profileFields[4].textContent = formattedDate; // تاريخ الميلاد
                }
                
                profileFields[5].textContent = gender === 'male' ? 'ذكر' : 'أنثى'; // الجنس
                profileFields[6].textContent = address; // العنوان
            }
            
            // Handle profile form submission
            console.log('تم حفظ البيانات الشخصية');
            showNotification('تم حفظ البيانات الشخصية بنجاح', 'success');
            
            // Go back to profile view
            showSection('profile');
        });
    }
}

// Password Handlers
function setupPasswordHandlers() {
    const passwordForm = document.getElementById('passwordForm');
    if (passwordForm) {
        passwordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Handle password change
            console.log('تم تغيير كلمة المرور');
            showNotification('تم تغيير كلمة المرور بنجاح', 'success');
        });
    }
}

// Settings Handlers
function setupSettingsHandlers() {
    // Email notifications toggle
    const emailNotifications = document.getElementById('emailNotifications');
    if (emailNotifications) {
        emailNotifications.addEventListener('change', function() {
            console.log('Email notifications:', this.checked);
            showNotification(`الإشعارات ${this.checked ? 'مفعلة' : 'معطلة'}`, 'info');
        });
    }
    
    // Newsletter toggle
    const newsletter = document.getElementById('newsletter');
    if (newsletter) {
        newsletter.addEventListener('change', function() {
            console.log('Newsletter:', this.checked);
            showNotification(`النشرة الإخبارية ${this.checked ? 'مفعلة' : 'معطلة'}`, 'info');
        });
    }
}

// Section Navigation
function setupSectionNavigation() {
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            const target = this.getAttribute('data-section');
            if (target) {
                showSection(target);
            }
        });
    });
}

// Show Section
function showSection(sectionName) {
    // Hide all sections
    const sections = document.querySelectorAll('.profile-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from all menu items
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionName + '-section');
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Add active class to clicked menu item
    const activeMenuItem = document.querySelector(`[data-section="${sectionName}"]`);
    if (activeMenuItem) {
        activeMenuItem.classList.add('active');
    }
}

// Toggle Password Visibility
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const toggle = input.nextElementSibling;
    const icon = toggle.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Reset Form
function resetForm() {
    const form = document.getElementById('profileForm');
    if (form) {
        // Reset form fields
        document.getElementById('firstName').value = 'أحمد';
        document.getElementById('lastName').value = 'محمد';
        document.getElementById('email').value = 'ahmed@example.com';
        document.getElementById('phone').value = '+966 50 123 4567';
        document.getElementById('birthDate').value = '1990-01-01';
        document.getElementById('gender').value = 'male';
        document.getElementById('address').value = 'الرياض، المملكة العربية السعودية';
        
        showNotification('تم إعادة تعيين النموذج', 'info');
    }
}

// Select Avatar
function selectAvatar() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const avatar = document.getElementById('editUserAvatar');
                if (avatar) {
                    avatar.src = e.target.result;
                }
                showNotification('تم تغيير الصورة الشخصية', 'success');
            };
            reader.readAsDataURL(file);
        }
    };
    input.click();
}

// Show Notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 3000);
}

// Add CSS for notification animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
    
    @keyframes fadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }
    
    @keyframes slideUp {
        from {
            transform: translateY(50px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
    
    @keyframes slideDown {
        from {
            transform: translateY(0);
            opacity: 1;
        }
        to {
            transform: translateY(50px);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 1rem;
    }
    
    .notification-content button {
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .btn-cancel:hover {
        background: #f7fafc !important;
        border-color: #cbd5e0 !important;
        transform: translateY(-1px);
    }
    
    .btn-confirm:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(229, 62, 62, 0.3);
    }
`;
document.head.appendChild(style);

// Logout function
function logout() {
    showLogoutConfirmation();
}

// Show Logout Confirmation Modal
function showLogoutConfirmation() {
    // Create modal overlay
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    modalOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    `;

    // Create modal content
    const modal = document.createElement('div');
    modal.className = 'logout-modal';
    modal.style.cssText = `
        background: white;
        border-radius: 16px;
        padding: 2rem;
        max-width: 400px;
        width: 90%;
        text-align: center;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
        animation: slideUp 0.3s ease;
    `;

    modal.innerHTML = `
        <div class="modal-icon" style="
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #e53e3e, #c53030);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1.5rem;
            color: white;
            font-size: 1.5rem;
        ">
            <i class="fas fa-sign-out-alt"></i>
        </div>
        <h3 style="
            margin: 0 0 1rem 0;
            color: #2d3748;
            font-size: 1.3rem;
            font-weight: 600;
        ">تأكيد تسجيل الخروج</h3>
        <p style="
            margin: 0 0 2rem 0;
            color: #718096;
            font-size: 1rem;
            line-height: 1.5;
        ">هل أنت متأكد من تسجيل الخروج؟</p>
        <div class="modal-actions" style="
            display: flex;
            gap: 1rem;
            justify-content: center;
        ">
            <button class="btn-cancel" style="
                padding: 0.75rem 1.5rem;
                border: 1px solid #e2e8f0;
                background: white;
                color: #4a5568;
                border-radius: 8px;
                cursor: pointer;
                font-size: 1rem;
                font-weight: 600;
                transition: all 0.3s ease;
            ">إلغاء</button>
            <button class="btn-confirm" style="
                padding: 0.75rem 1.5rem;
                border: none;
                background: linear-gradient(135deg, #e53e3e, #c53030);
                color: white;
                border-radius: 8px;
                cursor: pointer;
                font-size: 1rem;
                font-weight: 600;
                transition: all 0.3s ease;
            ">تسجيل الخروج</button>
        </div>
    `;

    // Add modal to page
    modalOverlay.appendChild(modal);
    document.body.appendChild(modalOverlay);

    // Add event listeners
    const cancelBtn = modal.querySelector('.btn-cancel');
    const confirmBtn = modal.querySelector('.btn-confirm');

    cancelBtn.addEventListener('click', () => {
        closeModal(modalOverlay);
    });

    confirmBtn.addEventListener('click', () => {
        closeModal(modalOverlay);
        performLogout();
    });

    // Close modal when clicking overlay
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal(modalOverlay);
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function escapeHandler(e) {
        if (e.key === 'Escape') {
            closeModal(modalOverlay);
            document.removeEventListener('keydown', escapeHandler);
        }
    });
}

// Close Modal
function closeModal(modalOverlay) {
    modalOverlay.style.animation = 'fadeOut 0.3s ease';
    const modal = modalOverlay.querySelector('.logout-modal');
    modal.style.animation = 'slideDown 0.3s ease';
    
    setTimeout(() => {
        if (modalOverlay.parentElement) {
            modalOverlay.remove();
        }
    }, 300);
}

// Perform Logout
function performLogout() {
    // Clear localStorage
    localStorage.clear();
    
    // Show success message
    showNotification('تم تسجيل الخروج بنجاح', 'success');
    
    // Redirect to login page after 1 second
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1000);
}

// Forgot Password function
function forgotPassword() {
    // Show confirmation dialog
    if (confirm('سيتم توجيهك إلى صفحة إعادة تعيين كلمة المرور. هل تريد المتابعة؟')) {
        // Show notification
        showNotification('جاري توجيهك إلى صفحة إعادة تعيين كلمة المرور...', 'info');
        
        // Redirect to forgot password page after 1 second
        setTimeout(() => {
            window.location.href = 'forgot-password.html';
        }, 1000);
    }
}

console.log('صفحة الملف الشخصي جاهزة! 👤'); 