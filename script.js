// NEET Website JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('NEET Website loaded successfully!');

    // Hidden admin access - press Ctrl+Shift+A+D+M+I+N
    let secretSequence = [];
    const adminSequence = ['ControlLeft', 'ShiftLeft', 'KeyA', 'KeyD', 'KeyM', 'KeyI', 'KeyN'];
    let sequenceTimeout;

    document.addEventListener('keydown', function(e) {
        // Clear sequence if too much time passes
        clearTimeout(sequenceTimeout);

        // Add current key to sequence
        secretSequence.push(e.code);

        // Keep only the last 7 keys
        if (secretSequence.length > adminSequence.length) {
            secretSequence.shift();
        }

        // Check if sequence matches
        if (secretSequence.length === adminSequence.length) {
            const isMatch = secretSequence.every((key, index) => key === adminSequence[index]);
            if (isMatch) {
                window.location.href = 'admin.html';
                return;
            }
        }

        // Reset sequence after 2 seconds of inactivity
        sequenceTimeout = setTimeout(() => {
            secretSequence = [];
        }, 2000);
    });

    // Alternative hidden access via URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('secret') === 'neet2025admin') {
        window.location.href = 'admin.html';
    }

    // Initialize real-time date and time
    initializeDateTime();

    // News ticker pause/play functionality
    let isNewsPaused = false;
    const newsPauseBtn = document.querySelector('.news-btn');
    const mobileNewsPauseBtn = document.querySelector('.news-play-pause');

    function toggleNewsState() {
        isNewsPaused = !isNewsPaused;
        const symbol = isNewsPaused ? '▶' : '❚❚';

        if (newsPauseBtn) {
            newsPauseBtn.textContent = symbol;
        }
        if (mobileNewsPauseBtn) {
            mobileNewsPauseBtn.textContent = symbol;
        }

        // Add visual feedback
        const newsText = document.querySelector('.news-text');
        if (newsText) {
            if (isNewsPaused) {
                newsText.style.animationPlayState = 'paused';
                newsText.style.opacity = '0.7';
            } else {
                newsText.style.animationPlayState = 'running';
                newsText.style.opacity = '1';
            }
        }
    }

    if (newsPauseBtn) {
        newsPauseBtn.addEventListener('click', toggleNewsState);
    }

    if (mobileNewsPauseBtn) {
        mobileNewsPauseBtn.addEventListener('click', toggleNewsState);
    }

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add active class to current navigation item
    const navItems = document.querySelectorAll('.nav-menu a');

    navItems.forEach(item => {
        item.addEventListener('click', function() {
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // News ticker animation (optional enhancement)
    const newsItems = document.querySelectorAll('.news-item');
    newsItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
        item.classList.add('fade-in');
    });

    // Add hover effects to info boxes
    const infoBoxes = document.querySelectorAll('.info-box');
    infoBoxes.forEach(box => {
        box.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.transition = 'transform 0.3s ease';
        });

        box.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Simple form validation (if forms are added later)
    function validateForm(formElement) {
        const inputs = formElement.querySelectorAll('input[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                input.style.borderColor = '#dc3545';
                isValid = false;
            } else {
                input.style.borderColor = '#28a745';
            }
        });

        return isValid;
    }

    // Mobile navigation toggle
    const mobileToggle = document.querySelector('.mobile-nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
            }
        });
    }

    // Add fade-in animation class to CSS
    const style = document.createElement('style');
    style.textContent = `
        .fade-in {
            animation: fadeIn 0.6s ease-in-out forwards;
            opacity: 0;
        }

        @keyframes fadeIn {
            to {
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
});

// Utility functions
function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-IN', options);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#0066cc'};
        color: white;
        border-radius: 5px;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Tab functionality for Public Notices section
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');

            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));

            // Add active class to clicked button and corresponding pane
            this.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });

    // View More button functionality
    const viewMoreButtons = document.querySelectorAll('.view-more-btn');
    viewMoreButtons.forEach(button => {
        button.addEventListener('click', function() {
            window.location.href = 'https://neet.nta.nic.in/public-notices/';
        });
    });

    // Function to handle admit card link behavior
    function handleAdmitCardLinks() {
        const admitCardLinks = document.querySelectorAll('a[href="login.html"]');

        admitCardLinks.forEach(link => {
            // Check if device is desktop (screen width > 768px)
            if (window.innerWidth > 768) {
                link.setAttribute('target', '_blank');
                link.setAttribute('rel', 'noopener noreferrer');
            } else {
                // For mobile devices, remove target attribute to open in same window
                link.removeAttribute('target');
                link.removeAttribute('rel');
            }
        });
    }

    // Initialize admit card link handling
    handleAdmitCardLinks();

    // Mobile expand/collapse functionality for Public Notices and News & Events
    function initializeMobileCollapse() {
        // Only apply on mobile screens
        if (window.innerWidth <= 768) {
            const publicNoticesSection = document.querySelector('#public-notices');
            const newsEventsSection = document.querySelector('#news-events');

            // Handle Public Notices section
            if (publicNoticesSection) {
                const header = publicNoticesSection.querySelector('h3');
                const content = publicNoticesSection.querySelector('.notice-list');
                const viewMoreBtn = publicNoticesSection.querySelector('.view-more-btn');

                // Set initial state
                let isPublicNoticesExpanded = true; // Default to expanded

                if (header && !header.hasAttribute('data-listener-added')) {
                    header.setAttribute('data-listener-added', 'true');
                    header.addEventListener('click', function() {
                        // Toggle state
                        isPublicNoticesExpanded = !isPublicNoticesExpanded;

                        if (content) {
                            content.style.display = isPublicNoticesExpanded ? 'block' : 'none';
                        }
                        if (viewMoreBtn) {
                            viewMoreBtn.style.display = isPublicNoticesExpanded ? 'block' : 'none';
                        }

                        // Update the symbol by removing old style and adding new one
                        const existingStyle = document.getElementById('public-notices-style');
                        if (existingStyle) {
                            existingStyle.remove();
                        }

                        const style = document.createElement('style');
                        style.id = 'public-notices-style';
                        style.textContent = `
                            #public-notices h3::after {
                                content: ${isPublicNoticesExpanded ? '"⊖"' : '"⊞"'} !important;
                            }
                        `;
                        document.head.appendChild(style);
                    });
                }
            }

            // Handle News & Events section
            if (newsEventsSection) {
                const header = newsEventsSection.querySelector('h3');
                const content = newsEventsSection.querySelector('.notice-list');
                const viewMoreBtn = newsEventsSection.querySelector('.view-more-btn');

                // Set initial state
                let isNewsEventsExpanded = false; // Default to collapsed
                newsEventsSection.classList.add('collapsed'); // Add initial collapsed class

                if (header && !header.hasAttribute('data-listener-added')) {
                    header.setAttribute('data-listener-added', 'true');
                    header.addEventListener('click', function() {
                        // Toggle state
                        isNewsEventsExpanded = !isNewsEventsExpanded;

                        if (content) {
                            content.style.display = isNewsEventsExpanded ? 'block' : 'none';
                        }
                        if (viewMoreBtn) {
                            viewMoreBtn.style.display = isNewsEventsExpanded ? 'block' : 'none';
                        }

                        // Add/remove collapsed class for proper rounded corners
                        if (isNewsEventsExpanded) {
                            newsEventsSection.classList.remove('collapsed');
                        } else {
                            newsEventsSection.classList.add('collapsed');
                        }

                        // Update the symbol by removing old style and adding new one
                        const existingStyle = document.getElementById('news-events-style');
                        if (existingStyle) {
                            existingStyle.remove();
                        }

                        const style = document.createElement('style');
                        style.id = 'news-events-style';
                        style.textContent = `
                            #news-events h3::after {
                                content: ${isNewsEventsExpanded ? '"⊖"' : '"⊞"'} !important;
                            }
                        `;
                        document.head.appendChild(style);
                    });
                }
            }
        }
    }

    // Initialize mobile collapse functionality
    initializeMobileCollapse();

    // Re-initialize on window resize
    window.addEventListener('resize', function() {
        initializeMobileCollapse();
    });

    // Real-time date and time functionality
    function initializeDateTime() {
        const datetimeElement = document.getElementById('real-time-datetime');

        if (!datetimeElement) return;

        function updateDateTime() {
            const now = new Date();

            // Format: "13 June 2025 16:29:23" - explicitly without "at"
            const day = now.getDate().toString().padStart(2, '0');
            const month = now.toLocaleString('en-GB', { month: 'long' });
            const year = now.getFullYear();
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const seconds = now.getSeconds().toString().padStart(2, '0');

            const formattedDateTime = `${day} ${month} ${year} ${hours}:${minutes}:${seconds}`;
            datetimeElement.textContent = formattedDateTime;
        }

        // Update immediately
        updateDateTime();

        // Update every second
        setInterval(updateDateTime, 1000);
    }

    // Export functions for potential use in other scripts
window.NEETWebsite = {
    formatDate,
    showNotification,
    handleAdmitCardLinks,
    initializeDateTime
};