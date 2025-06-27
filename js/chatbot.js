// Chatbot JavaScript
let currentChat = 'chat1';
let isRecording = false;
let mediaRecorder = null;
let audioChunks = [];
let currentTheme = 'light';
let chatToDelete = null;
let chatToEdit = null;

// Audio feedback
const sendSound = new Audio('https://cdn.pixabay.com/audio/2022/07/26/audio_124bfae0b2.mp3'); // صوت إرسال
const receiveSound = new Audio('https://cdn.pixabay.com/audio/2022/07/26/audio_124bfae0b2.mp3'); // صوت استقبال (يمكن تغييره)

function playSendSound() {
  sendSound.currentTime = 0;
  sendSound.play();
}
function playReceiveSound() {
  receiveSound.currentTime = 0;
  receiveSound.play();
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadTheme();
    setupEventListeners();
    loadUserData();
    updateMiniSidebar();
    renderMiniChats();
    const sendBtn = document.querySelector('.send-btn');
    const messageInput = document.getElementById('messageInput');
    if (sendBtn) sendBtn.onclick = sendMessage;
    if (messageInput) {
        messageInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
            // إذا كان Shift+Enter لا تمنع السلوك الافتراضي (ينزل سطر)
        });
    }
});

// Theme Management
function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
    
    // Update toggle switch state
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.checked = currentTheme === 'dark';
    }
    
    // Update mini sidebar theme icon
    const miniThemeBtn = document.getElementById('miniThemeBtn');
    if (miniThemeBtn) {
        const icon = miniThemeBtn.querySelector('i');
        if (currentTheme === 'dark') {
            icon.className = 'fas fa-sun';
            miniThemeBtn.title = 'الوضع الفاتح';
        } else {
            icon.className = 'fas fa-moon';
            miniThemeBtn.title = 'الوضع الداكن';
        }
    }
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    currentTheme = savedTheme;
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    // Update toggle switch state
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.checked = currentTheme === 'dark';
    }
    
    // Update mini sidebar theme icon
    const miniThemeBtn = document.getElementById('miniThemeBtn');
    if (miniThemeBtn) {
        const icon = miniThemeBtn.querySelector('i');
        if (currentTheme === 'dark') {
            icon.className = 'fas fa-sun';
            miniThemeBtn.title = 'الوضع الفاتح';
        } else {
            icon.className = 'fas fa-moon';
            miniThemeBtn.title = 'الوضع الداكن';
        }
    }
}

// Sidebar Toggle
function toggleSidebarMenu() {
    const sidebar = document.getElementById('chatSidebar');
    const miniSidebar = document.getElementById('miniSidebar');
    
    if (sidebar.classList.contains('hidden')) {
        // فتح السايدبار
        sidebar.classList.remove('hidden');
        if (miniSidebar) {
            miniSidebar.style.display = 'none';
        }
    } else {
        // إغلاق السايدبار
        sidebar.classList.add('hidden');
        if (miniSidebar) {
            miniSidebar.style.display = 'flex';
        }
    }
    updateMiniSidebar();
    renderMiniChats();
}

// إغلاق السايدبار عند الضغط خارج المنطقة - تم تعطيله
// window.addEventListener('click', function(e) {
//     const sidebar = document.getElementById('chatSidebar');
//     const menuBtn = document.getElementById('sidebarMenuBtn');
//     const miniSidebar = document.getElementById('miniSidebar');
    
//     if (
//         sidebar &&
//         !sidebar.classList.contains('hidden') &&
//         !sidebar.contains(e.target) &&
//         !menuBtn.contains(e.target) &&
//         !miniSidebar.contains(e.target)
//     ) {
//         sidebar.classList.add('hidden');
//         if (miniSidebar) {
//             miniSidebar.style.display = 'flex';
//         }
//     }
// });

// User Menu
function toggleUserMenu() {
    const dropdown = document.getElementById('userDropdown');
    dropdown.classList.toggle('show');
}

// Close dropdowns when clicking outside
document.addEventListener('click', function(event) {
    const userDropdown = document.getElementById('userDropdown');
    const fileMenu = document.getElementById('fileMenu');
    
    if (!event.target.closest('.user-menu')) {
        userDropdown.classList.remove('show');
    }
    
    if (!event.target.closest('.input-actions')) {
        fileMenu.classList.remove('show');
    }
});

// File Menu
function toggleFileMenu() {
    const fileMenu = document.getElementById('fileMenu');
    const menuBtn = document.querySelector('.menu-btn');
    
    if (fileMenu.classList.contains('show')) {
        fileMenu.classList.remove('show');
        fileMenu.classList.remove('above');
    } else {
        // إغلاق القوائم الأخرى أولاً
        const userDropdown = document.getElementById('userDropdown');
        if (userDropdown) {
            userDropdown.classList.remove('show');
        }
        
        // فتح القائمة
        fileMenu.classList.add('show');
        
        // التحقق من الموضع
        setTimeout(() => {
            const rect = fileMenu.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            
            // إذا كانت القائمة ستظهر خارج الشاشة من الأسفل
            if (rect.bottom > viewportHeight) {
                fileMenu.classList.add('above');
            } else {
                fileMenu.classList.remove('above');
            }
        }, 10);
    }
}

function sendFile(type) {
    const fileMenu = document.getElementById('fileMenu');
    if (fileMenu) fileMenu.classList.remove('show');
    const fileNames = {
        'document': 'مستند قانوني.docx',
        'pdf': 'عقد.pdf',
        'image': 'صورة.jpg',
        'video': 'فيديو.mp4'
    };
    addMessage(`تم إرسال ${fileNames[type]}`, 'user');
    playSendSound();
    showToast('تم إرسال الملف بنجاح');
    setTimeout(() => {
        addMessage(`تم استلام ${fileNames[type]} بنجاح. سأقوم بمراجعته والرد عليك قريباً.`, 'bot');
    }, 1000);
}

// Voice Recording
function toggleVoiceRecorder() {
    if (isRecording) {
        stopVoiceRecorder();
    } else {
        startVoiceRecorder();
    }
}

async function startVoiceRecorder() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];
        
        mediaRecorder.ondataavailable = (event) => {
            audioChunks.push(event.data);
        };
        
        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            const audioUrl = URL.createObjectURL(audioBlob);
            addVoiceMessage(audioUrl, audioChunks.length * 0.1);
        };
        
        mediaRecorder.start();
        isRecording = true;
        
        const voiceBtn = document.querySelector('.voice-btn');
        voiceBtn.classList.add('recording');
        voiceBtn.innerHTML = '<i class="fas fa-stop"></i>';
        
        const voiceRecorder = document.getElementById('voiceRecorder');
        voiceRecorder.classList.add('show');
        
    } catch (error) {
        console.error('Error accessing microphone:', error);
        alert('لا يمكن الوصول إلى الميكروفون');
    }
}

function stopVoiceRecorder() {
    if (mediaRecorder && isRecording) {
        mediaRecorder.stop();
        isRecording = false;
        
        const voiceBtn = document.querySelector('.voice-btn');
        voiceBtn.classList.remove('recording');
        voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
        
        const voiceRecorder = document.getElementById('voiceRecorder');
        voiceRecorder.classList.remove('show');
        
        // Stop all tracks
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
        
        // Show transcription modal
        setTimeout(() => {
            showModal('voiceToTextModal');
        }, 500);
    }
}

function addVoiceMessage(audioUrl, duration) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message user-message';
    
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    const durationText = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    messageDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-user"></i>
        </div>
        <div class="message-content">
            <div class="voice-message">
                <div class="voice-controls">
                    <button class="play-pause-btn" onclick="playPauseVoice(this, '${audioUrl}')">
                        <i class="fas fa-play"></i>
                    </button>
                    <span class="voice-duration">${durationText}</span>
                </div>
                <div class="voice-waveform">
                    <div class="voice-progress" style="width: 0%"></div>
                </div>
                <button class="transcribe-btn" onclick="transcribeVoice('${audioUrl}')">
                    تحويل إلى نص
                </button>
            </div>
            <span class="message-time">الآن</span>
        </div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    scrollToBottom();
}

function playPauseVoice(button, audioUrl) {
    const icon = button.querySelector('i');
    const progress = button.closest('.voice-message').querySelector('.voice-progress');
    
    if (icon.classList.contains('fa-play')) {
        // Start playing
        icon.className = 'fas fa-pause';
        
        // Simulate audio playing
        let progressWidth = 0;
        const interval = setInterval(() => {
            progressWidth += 2;
            progress.style.width = progressWidth + '%';
            
            if (progressWidth >= 100) {
                clearInterval(interval);
                icon.className = 'fas fa-play';
                progress.style.width = '0%';
            }
        }, 100);
        
    } else {
        // Stop playing
        icon.className = 'fas fa-play';
        progress.style.width = '0%';
    }
}

function transcribeVoice(audioUrl) {
    // Simulate transcription
    const transcriptionText = document.getElementById('transcriptionText');
    transcriptionText.textContent = 'مرحباً، هذا نص محول من الصوت. يمكنك تعديله قبل الإرسال.';
    showModal('voiceToTextModal');
}

function sendTranscription() {
    const transcriptionText = document.getElementById('transcriptionText');
    const text = transcriptionText.textContent;
    
    if (text && text.trim() !== '') {
        addMessage(text, 'user');
        closeModal('voiceToTextModal');
        
        // Simulate bot response
        setTimeout(() => {
            addMessage('تم استلام رسالتك الصوتية بنجاح. كيف يمكنني مساعدتك؟', 'bot');
        }, 1000);
    }
}

// Chat Management
function createNewChat() {
    const chatId = 'chat' + Date.now();
    const chatTitle = 'محادثة جديدة';
    
    // Add to chat history
    const chatHistory = document.querySelector('.chat-history');
    const newChatItem = document.createElement('div');
    newChatItem.className = 'chat-item';
    newChatItem.onclick = () => loadChat(chatId);
    
    newChatItem.innerHTML = `
        <div class="chat-item-content">
            <div class="chat-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="chat-info">
                <h4>${chatTitle}</h4>
                <p>ابدأ محادثة جديدة...</p>
            </div>
        </div>
        <div class="chat-actions">
            <button class="action-btn edit-btn" onclick="editChatName(event, '${chatId}')">
                <i class="fas fa-edit"></i>
            </button>
            <button class="action-btn delete-btn" onclick="deleteChat(event, '${chatId}')">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    
    chatHistory.appendChild(newChatItem);
    
    // Load the new chat
    loadChat(chatId);
    
    // Update mini sidebar
    updateMiniSidebar();
    renderMiniChats();
}

function loadChat(chatId) {
    currentChat = chatId;
    
    // Update active state
    document.querySelectorAll('.chat-item').forEach(item => {
        item.classList.remove('active');
    });
    
    const clickedItem = event.target.closest('.chat-item');
    if (clickedItem) {
        clickedItem.classList.add('active');
    }
    
    // Update chat title
    const chatTitle = clickedItem ? clickedItem.querySelector('h4').textContent : 'محادثة جديدة';
    document.getElementById('currentChatTitle').textContent = chatTitle;
    
    // Clear messages and add welcome message
    const messagesContainer = document.getElementById('chatMessages');
    messagesContainer.innerHTML = `
        <div class="message bot-message">
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <p>مرحباً! أنا المساعد القانوني لمكتب العدالة. كيف يمكنني مساعدتك اليوم؟</p>
                <span class="message-time">الآن</span>
            </div>
        </div>
    `;
    
    // Update mini sidebar
    updateMiniSidebar();
    renderMiniChats();
}

function editChatName(event, chatId) {
    event.stopPropagation();
    chatToEdit = chatId;
    
    const chatItem = event.target.closest('.chat-item');
    const currentName = chatItem.querySelector('h4').textContent;
    
    const editInput = document.getElementById('editChatName');
    editInput.value = currentName;
    
    showModal('editModal');
}

function confirmEdit() {
    const newName = document.getElementById('editChatName').value.trim();
    
    if (newName && chatToEdit) {
        // Update chat name in UI
        const chatItems = document.querySelectorAll('.chat-item');
        chatItems.forEach(item => {
            if (item.onclick && item.onclick.toString().includes(chatToEdit)) {
                item.querySelector('h4').textContent = newName;
            }
        });
        
        // Update current chat title if it's the active chat
        if (currentChat === chatToEdit) {
            document.getElementById('currentChatTitle').textContent = newName;
        }
        
        closeModal('editModal');
        chatToEdit = null;
        
        // Update mini sidebar
        updateMiniSidebar();
        renderMiniChats();
    }
}

function deleteChat(event, chatId) {
    event.stopPropagation();
    chatToDelete = chatId;
    showModal('deleteModal');
}

function confirmDelete() {
    if (chatToDelete) {
        // Remove chat from UI
        const chatItems = document.querySelectorAll('.chat-item');
        chatItems.forEach(item => {
            if (item.onclick && item.onclick.toString().includes(chatToDelete)) {
                item.remove();
            }
        });
        
        // If deleted chat was active, load first available chat
        if (currentChat === chatToDelete) {
            const firstChat = document.querySelector('.chat-item');
            if (firstChat) {
                firstChat.click();
            } else {
                // No chats left, create new one
                createNewChat();
            }
        }
        
        closeModal('deleteModal');
        chatToDelete = null;
        
        // Update mini sidebar
        updateMiniSidebar();
        renderMiniChats();
    }
}

// Loader أثناء انتظار رد البوت
function showLoader() {
  let loader = document.getElementById('chatLoader');
  if (!loader) {
    loader = document.createElement('div');
    loader.id = 'chatLoader';
    loader.className = 'chat-loader';
    loader.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
    chatMessages.appendChild(loader);
    scrollToBottom();
  }
}
function hideLoader() {
  const loader = document.getElementById('chatLoader');
  if (loader) loader.remove();
}
// عند إرسال رسالة، أظهر اللودر قبل رد البوت
const originalAddMessage = addMessage;
addMessage = function(message, sender) {
  if (sender === 'user') {
    hideLoader();
    originalAddMessage.apply(this, arguments);
    showLoader();
  } else if (sender === 'bot') {
    hideLoader();
    originalAddMessage.apply(this, arguments);
    playBotReceiveSound();
  } else {
    originalAddMessage.apply(this, arguments);
  }
}

// Message Functions
function sendMessage() {
  const input = document.getElementById('messageInput');
  const message = input.value.trim();
  if (message) {
    addMessage(message, 'user');
    input.value = '';
    playSendSound();
    setTimeout(() => {
      const responses = [
        'شكرًا لرسالتك. سأقوم بمراجعتها والرد عليك قريبًا.',
        'أفهم استفسارك. دعني أساعدك في هذا الأمر.',
        'هذا سؤال مهم. سأحتاج إلى مزيد من التفاصيل.',
        'أعتذر، لكنني أحتاج إلى مزيد من المعلومات للإجابة بدقة.'
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      addMessage(randomResponse, 'bot');
    }, 1000 + Math.random() * 2000);
  }
}

function getCurrentTimeString() {
  const now = new Date();
  const time = now.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', hour12: false });
  const date = now.toLocaleDateString('ar-EG');
  return `${time} - ${date}`;
}

function addMessage(message, sender) {
  const chatMessages = document.getElementById('chatMessages');
  // تنسيق التاريخ والوقت بالإنجليزية
  const now = new Date();
  const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  const date = now.toLocaleDateString('en-US');
  let msgClass = '';
  let msgHtml = '';
  // معالجة الأسطر الجديدة
  const formattedMessage = message.replace(/\n/g, '<br>');
  if (sender === 'user') {
    msgClass = 'user-message';
    msgHtml = `<div class="message ${msgClass}">
      <div class='message-avatar'><img src='https://www.pngarts.com/files/10/Default-Profile-Picture-PNG-Download-Image.png' alt='User Profile' class='mini-profile-img'></div>
      <div class='message-content'>${formattedMessage}
        <div class='message-meta'><span>${date}</span> <span>${time}</span></div>
      </div>
    </div>`;
  } else {
    msgClass = 'bot-message';
    msgHtml = `<div class="message ${msgClass}">
      <div class='message-avatar'><i class='fas fa-robot'></i></div>
      <div class='message-content'>${formattedMessage}
        <div class='message-meta'><span>${date}</span> <span>${time}</span></div>
      </div>
    </div>`;
  }
  chatMessages.appendChild(document.createRange().createContextualFragment(msgHtml));
  scrollToBottom();
  handleScrollBtnVisibility && handleScrollBtnVisibility();
  if (sender === 'bot') playBotReceiveSound && playBotReceiveSound();
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

function scrollToBottom() {
    const messagesContainer = document.getElementById('chatMessages');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Modal Functions
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add('show');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('show');
}

// User Functions
function loadUserData() {
    // Load user data from localStorage or API
    const userName = localStorage.getItem('userName') || 'أحمد محمد';
    document.getElementById('userName').textContent = userName;
}

function logout() {
    if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
        localStorage.removeItem('userName');
        window.location.href = 'login.html';
    }
}

// Setup Event Listeners
function setupEventListeners() {
    // Close modals when clicking outside
    document.addEventListener('click', function(event) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (event.target === modal) {
                modal.classList.remove('show');
            }
        });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(event) {
        const userDropdown = document.getElementById('userDropdown');
        const fileMenu = document.getElementById('fileMenu');
        
        if (!event.target.closest('.user-menu')) {
            userDropdown.classList.remove('show');
        }
        
        if (!event.target.closest('.input-actions')) {
            fileMenu.classList.remove('show');
        }
    });
    
    // Handle escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            const modals = document.querySelectorAll('.modal');
            modals.forEach(modal => {
                modal.classList.remove('show');
            });
            
            const dropdowns = document.querySelectorAll('.user-dropdown, .file-menu');
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('show');
            });
        }
    });
}

// Mini Sidebar Functions
function updateMiniSidebar() {
    const sidebar = document.getElementById('chatSidebar');
    const miniSidebar = document.getElementById('miniSidebar');
    
    if (sidebar.classList.contains('hidden')) {
        if (miniSidebar) {
            miniSidebar.style.display = 'flex';
            miniSidebar.style.right = '0';
        }
    } else {
        if (miniSidebar) {
            miniSidebar.style.display = 'none';
        }
    }
}

function renderMiniChats() {
    const miniChats = document.getElementById('miniChats');
    if (!miniChats) return;
    
    miniChats.innerHTML = '';
    
    const chatItems = document.querySelectorAll('.chat-item');
    chatItems.forEach((item, index) => {
        const chatIcon = document.createElement('button');
        chatIcon.className = 'mini-chat-icon';
        chatIcon.title = item.querySelector('h4').textContent;
        chatIcon.innerHTML = '<i class="fas fa-comment"></i>';
        
        if (item.classList.contains('active')) {
            chatIcon.classList.add('active');
        }
        
        chatIcon.onclick = () => item.click();
        miniChats.appendChild(chatIcon);
    });
}

// Mini Profile Dropdown
const miniProfile = document.getElementById('miniProfile');
const miniProfileDropdown = document.getElementById('miniProfileDropdown');

if (miniProfile) {
  miniProfile.addEventListener('click', function(e) {
    e.stopPropagation();
    miniProfile.classList.toggle('show-dropdown');
  });
}

document.addEventListener('click', function(e) {
  if (miniProfile && miniProfile.classList.contains('show-dropdown')) {
    if (!miniProfile.contains(e.target)) {
      miniProfile.classList.remove('show-dropdown');
    }
  }
});

// عدل استقبال رسالة البوت لتشغيل صوت الاستقبال
function playBotReceiveSound() {
  playReceiveSound();
}

// Scroll to bottom button
const scrollToBottomBtn = document.getElementById('scrollToBottomBtn');
const chatMessages = document.getElementById('chatMessages');

function handleScrollBtnVisibility() {
  if (!chatMessages) return;
  // إظهار الزر إذا كان هناك رسائل كثيرة ولم يكن المستخدم في الأسفل
  const threshold = 200; // بكسل
  if (chatMessages.scrollHeight - chatMessages.scrollTop - chatMessages.clientHeight > threshold) {
    scrollToBottomBtn.style.display = 'flex';
  } else {
    scrollToBottomBtn.style.display = 'none';
  }
}

if (chatMessages) {
  chatMessages.addEventListener('scroll', handleScrollBtnVisibility);
  // عند إضافة رسالة جديدة، مرر للأسفل وأخفي الزر
  const observer = new MutationObserver(() => {
    handleScrollBtnVisibility();
  });
  observer.observe(chatMessages, { childList: true });
}

function showToast(message, type = 'success') {
  let toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => { toast.classList.add('show'); }, 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 2500);
} 