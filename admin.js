
// Admin Panel JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('Admin panel loaded successfully!');
    
    // Check if user is authenticated as admin
    checkAdminAuth();
    
    // Initialize admin panel
    initializeAdminPanel();
    
    // Load existing results
    loadExistingResults();
});

// Admin authentication check
function checkAdminAuth() {
    const isAdminAuthenticated = sessionStorage.getItem('admin_authenticated');
    if (!isAdminAuthenticated) {
        const adminPassword = prompt('Enter admin password:');
        if (adminPassword !== 'admin123') {
            alert('Access denied. Redirecting to home page.');
            window.location.href = 'index.html';
            return;
        }
        sessionStorage.setItem('admin_authenticated', 'true');
    }
}

// Initialize admin panel functionality
function initializeAdminPanel() {
    const uploadForm = document.getElementById('uploadForm');
    const imageInput = document.getElementById('resultImage');
    
    // Handle file preview
    imageInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        const preview = document.getElementById('imagePreview');
        
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
            };
            reader.readAsDataURL(file);
        } else {
            preview.innerHTML = '';
        }
    });
    
    // Handle form submission
    uploadForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleResultUpload();
    });
}

// Handle result upload
function handleResultUpload() {
    const applicationNumber = document.getElementById('applicationNumber').value;
    const password = document.getElementById('password').value;
    const studentName = document.getElementById('studentName').value;
    const imageFile = document.getElementById('resultImage').files[0];
    
    if (!imageFile) {
        alert('Please select an image file');
        return;
    }
    
    // Convert image to base64
    const reader = new FileReader();
    reader.onload = function(e) {
        const imageData = e.target.result;
        
        // Save to localStorage (in a real app, this would be a database)
        saveResult({
            applicationNumber: applicationNumber,
            password: password,
            studentName: studentName,
            imageData: imageData,
            uploadDate: new Date().toISOString()
        });
        
        // Reset form
        document.getElementById('uploadForm').reset();
        document.getElementById('imagePreview').innerHTML = '';
        
        // Reload results list
        loadExistingResults();
        
        alert('Result uploaded successfully!');
    };
    reader.readAsDataURL(imageFile);
}

// Save result to localStorage
function saveResult(resultData) {
    let results = getStoredResults();
    
    // Check if application number already exists
    const existingIndex = results.findIndex(r => r.applicationNumber === resultData.applicationNumber);
    
    if (existingIndex !== -1) {
        // Update existing result
        results[existingIndex] = resultData;
    } else {
        // Add new result
        results.push(resultData);
    }
    
    localStorage.setItem('neet_results', JSON.stringify(results));
}

// Get stored results from localStorage
function getStoredResults() {
    const results = localStorage.getItem('neet_results');
    return results ? JSON.parse(results) : [];
}

// Load and display existing results
function loadExistingResults() {
    const results = getStoredResults();
    const resultsList = document.getElementById('resultsList');
    
    if (results.length === 0) {
        resultsList.innerHTML = '<div class="no-results">No results uploaded yet.</div>';
        return;
    }
    
    resultsList.innerHTML = results.map((result, index) => `
        <div class="result-item">
            <div class="result-info">
                <h3>${result.studentName}</h3>
                <p><strong>Application No:</strong> ${result.applicationNumber}</p>
                <p><strong>Password:</strong> ${result.password}</p>
                <p><strong>Uploaded:</strong> ${new Date(result.uploadDate).toLocaleDateString()}</p>
            </div>
            <div class="result-actions">
                <button class="edit-btn" onclick="editResult(${index})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="delete-btn" onclick="deleteResult(${index})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `).join('');
}

// Edit result
function editResult(index) {
    const results = getStoredResults();
    const result = results[index];
    
    if (result) {
        document.getElementById('applicationNumber').value = result.applicationNumber;
        document.getElementById('password').value = result.password;
        document.getElementById('studentName').value = result.studentName;
        
        // Show current image in preview
        document.getElementById('imagePreview').innerHTML = `<img src="${result.imageData}" alt="Current Image">`;
        
        // Delete the old result (will be replaced when form is submitted)
        deleteResult(index);
    }
}

// Delete result
function deleteResult(index) {
    if (confirm('Are you sure you want to delete this result?')) {
        let results = getStoredResults();
        results.splice(index, 1);
        localStorage.setItem('neet_results', JSON.stringify(results));
        loadExistingResults();
    }
}

// Logout function
function logout() {
    sessionStorage.removeItem('admin_authenticated');
    window.location.href = 'index.html';
}

// Export results (for backup)
function exportResults() {
    const results = getStoredResults();
    const dataStr = JSON.stringify(results, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'neet_results_backup.json';
    link.click();
}
