// Loading Screen Management
class LoadingScreen {
    constructor() {
        this.loadingScreen = null;
        this.init();
    }

    init() {
        // Create loading screen element
        this.loadingScreen = document.createElement('div');
        this.loadingScreen.className = 'loading-screen';
        this.loadingScreen.innerHTML = `
            <div class="loader">
                <div class="box1"></div>
                <div class="box2"></div>
                <div class="box3"></div>
            </div>
        `;
        
        // Add to body
        document.body.appendChild(this.loadingScreen);
        
        // Hide loading screen after page loads
        this.hideAfterLoad();
    }

    show() {
        if (this.loadingScreen) {
            this.loadingScreen.classList.remove('hidden');
        }
    }

    hide() {
        if (this.loadingScreen) {
            this.loadingScreen.classList.add('hidden');
        }
    }

    hideAfterLoad() {
        // Hide loading screen when page is fully loaded
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.hide();
            }, 1000); // Show for at least 1 second
        });

        // Also hide if DOM is ready and page is taking too long
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                this.hide();
            }, 2000); // Hide after 2 seconds max
        });
    }
}

// Initialize loading screen
const loadingScreen = new LoadingScreen();

// Show loading screen when navigating between pages
window.addEventListener('beforeunload', () => {
    loadingScreen.show();
});

// Show loading screen for form submissions
document.addEventListener('submit', (e) => {
    // Don't show for search forms or other non-navigation forms
    if (!e.target.classList.contains('search-form')) {
        loadingScreen.show();
    }
});

// Show loading screen for navigation links
document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (link && link.href && !link.href.startsWith('javascript:') && !link.href.startsWith('#')) {
        // Don't show for same-page links or external links that open in new tab
        if (!link.target || link.target !== '_blank') {
            loadingScreen.show();
        }
    }
});

// Show loading screen for AJAX requests
if (typeof XMLHttpRequest !== 'undefined') {
    const originalXHROpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function() {
        loadingScreen.show();
        return originalXHROpen.apply(this, arguments);
    };
}

// Show loading screen for fetch requests
if (typeof fetch !== 'undefined') {
    const originalFetch = window.fetch;
    window.fetch = function() {
        loadingScreen.show();
        return originalFetch.apply(this, arguments);
    };
} 