
// NEET Result Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('NEET Result page loaded successfully!');
    
    // Check if user accessed this page directly without login
    const referrer = document.referrer;
    const hasLoginReferrer = referrer.includes('login.html') || 
                            referrer.includes('login') || 
                            sessionStorage.getItem('neet_authenticated') === 'true';
    
    // If no proper referrer and not authenticated, redirect back to login
    if (!hasLoginReferrer && !referrer) {
        alert('Please login to view your result.');
        window.location.href = 'login.html';
        return;
    }
    
    // Set authentication flag
    sessionStorage.setItem('neet_authenticated', 'true');
    
    // Load the correct result based on application number
    loadCorrectResult();
    
    // Add print functionality
    const downloadBtn = document.querySelector('.download-btn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function() {
            // Small delay to ensure button click is registered
            setTimeout(() => {
                window.print();
            }, 100);
        });
    }
    
    // Handle back button
    const backBtn = document.querySelector('.back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            // Clear authentication
            sessionStorage.removeItem('neet_authenticated');
            window.location.href = 'login.html';
        });
    }
    
    // Prevent right-click on result image (basic protection)
    const resultImage = document.querySelector('.result-image');
    if (resultImage) {
        resultImage.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            return false;
        });
        
        // Prevent drag and drop
        resultImage.addEventListener('dragstart', function(e) {
            e.preventDefault();
            return false;
        });
    }
    
    // Add warning when user tries to leave the page
    window.addEventListener('beforeunload', function() {
        sessionStorage.removeItem('neet_authenticated');
    });
});

// Load the correct result based on application number
function loadCorrectResult() {
    const currentApplicationNo = sessionStorage.getItem('current_application_no');
    
    if (!currentApplicationNo) {
        console.error('No application number found');
        return;
    }
    
    // Update the application number display
    const applicationInfo = document.querySelector('.application-info');
    if (applicationInfo) {
        applicationInfo.textContent = `Application Number: ${currentApplicationNo}`;
    }
    
    // Load stored results
    const storedResults = JSON.parse(localStorage.getItem('neet_results') || '[]');
    const userResult = storedResults.find(result => result.applicationNumber === currentApplicationNo);
    
    // Update result image and student name if found
    if (userResult) {
        const resultImage = document.querySelector('.result-image');
        if (resultImage) {
            resultImage.src = userResult.imageData;
            resultImage.alt = `${userResult.studentName} - NEET Result`;
        }
        
        // Update page title with student name
        document.title = `NEET (UG) 2025 Result - ${userResult.studentName}`;
    }
    // If not found in stored results but it's the default credential, keep the existing image
    else if (currentApplicationNo === '250410121270') {
        // Keep the default result image (aditya-result.png)
        console.log('Using default result for application number 250410121270');
    }
}

// Utility function to format current date/time
function getCurrentDateTime() {
    const now = new Date();
    return now.toLocaleString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}
