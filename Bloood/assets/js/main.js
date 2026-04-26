// BloodLink main JavaScript file

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
    
    // Blood type compatibility checker
    const bloodTypeChecker = document.getElementById('blood-type-checker');
    if (bloodTypeChecker) {
        const donorSelect = document.getElementById('donor-blood-type');
        const recipientSelect = document.getElementById('recipient-blood-type');
        const checkButton = document.getElementById('check-compatibility');
        const resultDiv = document.getElementById('compatibility-result');
        
        checkButton.addEventListener('click', function() {
            const donorType = donorSelect.value;
            const recipientType = recipientSelect.value;
            const isCompatible = checkBloodCompatibility(donorType, recipientType);
            
            if (isCompatible) {
                resultDiv.innerHTML = `<div class="bg-green-100 text-green-800 p-4 rounded-md mt-4">
                    <strong>Compatible!</strong> Blood type ${donorType} can donate to ${recipientType}.
                </div>`;
            } else {
                resultDiv.innerHTML = `<div class="bg-red-100 text-red-800 p-4 rounded-md mt-4">
                    <strong>Not Compatible.</strong> Blood type ${donorType} cannot donate to ${recipientType}.
                </div>`;
            }
        });
    }
    
    // Form validation for registration and requests
    const forms = document.querySelectorAll('form.validate-form');
    if (forms.length > 0) {
        forms.forEach(form => {
            form.addEventListener('submit', function(event) {
                event.preventDefault();
                if (validateForm(form)) {
                    // Show search results section on successful form submission
                    const searchResultsSection = document.getElementById('search-results');
                    const bloodBanksResults = document.getElementById('blood-banks-results');
                    
                    if (searchResultsSection) {
                        searchResultsSection.classList.remove('hidden');
                        // Smooth scroll to results
                        setTimeout(() => {
                            searchResultsSection.scrollIntoView({ behavior: 'smooth' });
                        }, 300);
                    }
                    
                    if (bloodBanksResults) {
                        bloodBanksResults.classList.remove('hidden');
                        // Smooth scroll to results
                        setTimeout(() => {
                            bloodBanksResults.scrollIntoView({ behavior: 'smooth' });
                        }, 300);
                    }
                }
            });
        });
    }

    // Location services for nearby search
    const locateButton = document.getElementById('locate-me');
    if (locateButton) {
        locateButton.addEventListener('click', function() {
            if (navigator.geolocation) {
                locateButton.textContent = 'Locating...';
                locateButton.disabled = true;
                
                navigator.geolocation.getCurrentPosition(
                    function(position) {
                        const lat = position.coords.latitude;
                        const lng = position.coords.longitude;
                        
                        document.getElementById('latitude').value = lat;
                        document.getElementById('longitude').value = lng;
                        
                        // Fetch location name
                        fetchLocationName(lat, lng);
                        
                        locateButton.textContent = 'Location Found!';
                        setTimeout(() => {
                            locateButton.textContent = 'Use My Location';
                            locateButton.disabled = false;
                        }, 3000);
                    },
                    function(error) {
                        console.error('Error obtaining location', error);
                        locateButton.textContent = 'Location Failed';
                        setTimeout(() => {
                            locateButton.textContent = 'Use My Location';
                            locateButton.disabled = false;
                        }, 3000);
                    }
                );
            } else {
                alert('Geolocation is not supported by your browser');
            }
        });
    }
    
    // Notification system simulation
    simulateNotifications();
});

// Blood compatibility checker function
function checkBloodCompatibility(donorType, recipientType) {
    const compatibilityMap = {
        'O-': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
        'O+': ['O+', 'A+', 'B+', 'AB+'],
        'A-': ['A-', 'A+', 'AB-', 'AB+'],
        'A+': ['A+', 'AB+'],
        'B-': ['B-', 'B+', 'AB-', 'AB+'],
        'B+': ['B+', 'AB+'],
        'AB-': ['AB-', 'AB+'],
        'AB+': ['AB+']
    };
    
    return compatibilityMap[donorType] && compatibilityMap[donorType].includes(recipientType);
}

// Form validation function
function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            showErrorMessage(field, 'This field is required');
        } else {
            hideErrorMessage(field);
            
            // Email validation
            if (field.type === 'email' && !validateEmail(field.value)) {
                isValid = false;
                showErrorMessage(field, 'Please enter a valid email address');
            }
            
            // Phone validation
            if (field.name === 'phone' && !validatePhone(field.value)) {
                isValid = false;
                showErrorMessage(field, 'Please enter a valid phone number');
            }
        }
    });
    
    return isValid;
}

function showErrorMessage(field, message) {
    // Remove any existing error message
    hideErrorMessage(field);
    
    // Create and insert error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'text-red-500 text-sm mt-1 error-message';
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
    
    // Add error class to field
    field.classList.add('border-red-500');
}

function hideErrorMessage(field) {
    const errorMessage = field.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
    field.classList.remove('border-red-500');
}

function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function validatePhone(phone) {
    const regex = /^\+?[0-9]{10,15}$/;
    return regex.test(phone);
}

// Location service functions
function fetchLocationName(lat, lng) {
    // This would typically use a geocoding service like Google Maps API
    // For this demo, we'll simulate it
    console.log("Would fetch location name for", lat, lng);
    
    // Simulate a location fetch
    setTimeout(() => {
        document.getElementById('location').value = 'Dhulikhel, Kavre';
    }, 1000);
}

// Notification system simulation
function simulateNotifications() {
    const notificationBell = document.getElementById('notification-bell');
    if (notificationBell) {
        let notificationCount = 0;
        
        // Update notification count badge
        function updateNotificationBadge() {
            const badge = notificationBell.querySelector('.notification-badge');
            
            if (notificationCount > 0) {
                if (badge) {
                    badge.textContent = notificationCount;
                } else {
                    const newBadge = document.createElement('span');
                    newBadge.className = 'notification-badge absolute -top-1 -right-1 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center';
                    newBadge.textContent = notificationCount;
                    notificationBell.appendChild(newBadge);
                    
                    // Add animation
                    notificationBell.classList.add('animate-bounce');
                    setTimeout(() => notificationBell.classList.remove('animate-bounce'), 1000);
                }
            } else if (badge) {
                badge.remove();
            }
        }
        
        // Simulate receiving notifications
        setTimeout(() => {
            notificationCount += 1;
            updateNotificationBadge();
        }, 5000);
        
        // Click handler for the notification bell
        notificationBell.addEventListener('click', function() {
            const notificationPanel = document.getElementById('notification-panel');
            if (notificationPanel) {
                notificationPanel.classList.toggle('hidden');
                
                // Reset notification count when viewing
                if (!notificationPanel.classList.contains('hidden')) {
                    notificationCount = 0;
                    updateNotificationBadge();
                }
            }
        });
    }
}
