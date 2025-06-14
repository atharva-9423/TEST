
// Admit Card JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Admit Card page loaded successfully!');
    
    // Force desktop view on mobile devices
    function forceDesktopView() {
        // Check if device is mobile (screen width <= 768px)
        if (window.innerWidth <= 768) {
            // Remove existing viewport meta tag
            const existingViewport = document.querySelector('meta[name="viewport"]');
            if (existingViewport) {
                existingViewport.remove();
            }
            
            // Add new viewport meta tag for desktop view
            const desktopViewport = document.createElement('meta');
            desktopViewport.name = 'viewport';
            desktopViewport.content = 'width=1024, initial-scale=0.5, user-scalable=yes';
            document.head.appendChild(desktopViewport);
            
            // Add CSS to ensure desktop layout
            const desktopStyle = document.createElement('style');
            desktopStyle.textContent = `
                body {
                    min-width: 1024px;
                    overflow-x: auto;
                }
                
                .main-content {
                    min-width: 1024px;
                }
                
                .login-container {
                    min-width: 800px;
                    margin: 0 auto;
                }
            `;
            document.head.appendChild(desktopStyle);
        }
    }
    
    // Initialize desktop view
    forceDesktopView();
    
    // Re-check on window resize
    window.addEventListener('resize', forceDesktopView);
    
    // CAPTCHA functionality
    const captchaText = document.querySelector('.captcha-text');
    const refreshCaptchaBtn = document.querySelector('.refresh-captcha');
    
    // Function to generate random CAPTCHA
    function generateCaptcha() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let captcha = '';
        
        // Generate 6 character CAPTCHA
        for (let i = 0; i < 6; i++) {
            captcha += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        
        return captcha;
    }
    
    // Function to update CAPTCHA display
    function refreshCaptcha() {
        const newCaptcha = generateCaptcha();
        captchaText.textContent = newCaptcha;
        
        // Add visual feedback for refresh
        captchaText.style.opacity = '0.5';
        setTimeout(() => {
            captchaText.style.opacity = '1';
        }, 150);
        
        // Clear captcha input field
        const captchaInput = document.getElementById('captcha');
        if (captchaInput) {
            captchaInput.value = '';
        }
    }
    
    // Add click event listener to refresh button
    if (refreshCaptchaBtn) {
        refreshCaptchaBtn.addEventListener('click', function(e) {
            e.preventDefault();
            refreshCaptcha();
            
            // Add rotation animation to the icon
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.transform = 'rotate(360deg)';
                icon.style.transition = 'transform 0.3s ease';
                setTimeout(() => {
                    icon.style.transform = 'rotate(0deg)';
                }, 300);
            }
        });
    }
    
    // Initialize with a random CAPTCHA on page load
    refreshCaptcha();
    
    // Handle form submission
    const loginForm = document.querySelector('.login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const applicationNo = document.getElementById('application-no').value.trim();
            const password = document.getElementById('password').value.trim();
            const captchaInput = document.getElementById('captcha').value.trim();
            const captchaDisplay = document.querySelector('.captcha-text').textContent.trim();
            
            // Check if all fields are filled
            if (!applicationNo || !password || !captchaInput) {
                alert('Please fill in all fields');
                return;
            }
            
            // Check if CAPTCHA matches
            if (captchaInput.toLowerCase() !== captchaDisplay.toLowerCase()) {
                alert('Invalid CAPTCHA. Please try again.');
                refreshCaptcha();
                return;
            }
            
            // Check credentials against stored results
            const storedResults = JSON.parse(localStorage.getItem('neet_results') || '[]');
            const validCredential = storedResults.find(result => 
                result.applicationNumber === applicationNo && result.password === password
            );
            
            // Also check the default credential
            const isDefaultCredential = applicationNo === '250410121270' && password === 'mh12445055';
            
            if (validCredential || isDefaultCredential) {
                // Store the application number for the result page
                sessionStorage.setItem('current_application_no', applicationNo);
                
                // Redirect to result page
                window.location.href = 'result.html';
            } else {
                alert('Invalid Application Number or Password. Please try again.');
                // Clear password field
                document.getElementById('password').value = '';
                refreshCaptcha();
            }
        });
    }
});
