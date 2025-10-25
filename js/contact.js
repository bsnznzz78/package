// Contact Page Specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initContactForms();
});

// ===========================
// Contact Forms with Enhanced Validation
// ===========================
function initContactForms() {
    // Phone number validation
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function() {
            // Remove non-numeric characters
            this.value = this.value.replace(/\D/g, '');
            
            // Limit to 10 digits
            if (this.value.length > 10) {
                this.value = this.value.slice(0, 10);
            }
            
            // Validate
            if (this.value.length === 10) {
                this.setCustomValidity('');
            } else if (this.value.length > 0) {
                this.setCustomValidity('Phone number must be 10 digits');
            }
        });
    });
    
    // Email validation enhancement
    const emailInputs = document.querySelectorAll('input[type="email"]');
    emailInputs.forEach(input => {
        input.addEventListener('blur', function() {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (this.value && !emailRegex.test(this.value)) {
                this.setCustomValidity('Please enter a valid email address');
            } else {
                this.setCustomValidity('');
            }
        });
    });
    
    // Date validation for appointments
    const dateInput = document.getElementById('appt-date');
    if (dateInput) {
        // Set min date to today
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
        
        // Set max date to 60 days from now
        const maxDate = new Date();
        maxDate.setDate(maxDate.getDate() + 60);
        dateInput.setAttribute('max', maxDate.toISOString().split('T')[0]);
        
        // Disable Sundays
        dateInput.addEventListener('input', function() {
            const selectedDate = new Date(this.value);
            if (selectedDate.getDay() === 0) { // Sunday
                alert('We are closed on Sundays. Please select another date.');
                this.value = '';
            }
        });
    }
    
    // Time slot validation
    const timeInput = document.getElementById('appt-time');
    const dateInputForTime = document.getElementById('appt-date');
    
    if (timeInput && dateInputForTime) {
        dateInputForTime.addEventListener('change', updateAvailableTimeSlots);
        
        function updateAvailableTimeSlots() {
            const selectedDate = new Date(dateInputForTime.value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            // If today is selected, disable past time slots
            if (selectedDate.getTime() === today.getTime()) {
                const currentHour = new Date().getHours();
                const options = timeInput.querySelectorAll('option');
                
                options.forEach(option => {
                    if (option.value) {
                        const optionHour = parseInt(option.value.split(':')[0]);
                        if (optionHour <= currentHour + 2) { // Require 2 hours advance booking
                            option.disabled = true;
                        } else {
                            option.disabled = false;
                        }
                    }
                });
            } else {
                // Enable all time slots for future dates
                const options = timeInput.querySelectorAll('option');
                options.forEach(option => {
                    option.disabled = false;
                });
            }
        }
    }
    
    // Form submission with loading state
    const appointmentForm = document.getElementById('appointment-form');
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            // Show loading state
            submitBtn.disabled = true;
            submitBtn.textContent = 'Booking...';
            
            // Simulate API call
            setTimeout(() => {
                const formData = new FormData(this);
                const data = Object.fromEntries(formData);
                
                console.log('Appointment Data:', data);
                
                // Show success message
                showSuccessMessage(
                    'Appointment Booked Successfully!',
                    `Thank you, ${data.name}! Your appointment request has been received. We will confirm your appointment for ${data.date} at ${data.time} via phone call to ${data.phone} within 2 hours.`
                );
                
                // Reset form
                this.reset();
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }, 1500);
        });
    }
    
    // General contact form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            // Show loading state
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            
            // Simulate API call
            setTimeout(() => {
                const formData = new FormData(this);
                const data = Object.fromEntries(formData);
                
                console.log('Contact Form Data:', data);
                
                // Show success message
                showSuccessMessage(
                    'Message Sent Successfully!',
                    `Thank you for contacting us, ${data.name}! We have received your message and will respond to your inquiry at ${data.email} within 24 hours.`
                );
                
                // Reset form
                this.reset();
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }, 1500);
        });
    }
}

// ===========================
// Success Message Display
// ===========================
function showSuccessMessage(title, message) {
    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        animation: fadeIn 0.3s ease;
    `;
    
    // Create success message box
    const messageBox = document.createElement('div');
    messageBox.style.cssText = `
        background: white;
        padding: 40px;
        border-radius: 12px;
        max-width: 500px;
        text-align: center;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        animation: slideUp 0.3s ease;
    `;
    
    messageBox.innerHTML = `
        <div style="font-size: 4rem; margin-bottom: 20px;">✓</div>
        <h2 style="color: #00a86b; margin-bottom: 15px; font-size: 1.8rem;">${title}</h2>
        <p style="color: #555; line-height: 1.7; margin-bottom: 25px;">${message}</p>
        <button onclick="this.closest('[style*=\"position: fixed\"]').remove()" 
                style="background: #0066cc; color: white; padding: 12px 30px; border: none; 
                       border-radius: 8px; font-size: 1rem; font-weight: 600; cursor: pointer;">
            Close
        </button>
    `;
    
    overlay.appendChild(messageBox);
    document.body.appendChild(overlay);
    
    // Add animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes slideUp {
            from { transform: translateY(50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    // Close on overlay click
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            overlay.remove();
        }
    });
    
    // Auto close after 10 seconds
    setTimeout(() => {
        if (document.body.contains(overlay)) {
            overlay.remove();
        }
    }, 10000);
}

// ===========================
// Real-time Form Field Hints
// ===========================
(function() {
    // Add helpful hints to form fields
    const rankInput = document.getElementById('appt-rank');
    if (rankInput) {
        rankInput.addEventListener('focus', function() {
            showFieldHint(this, 'Enter your AIR (All India Rank) or state rank if results are declared');
        });
    }
    
    const examSelect = document.getElementById('appt-exam');
    if (examSelect) {
        examSelect.addEventListener('change', function() {
            const rankInput = document.getElementById('appt-rank');
            if (rankInput) {
                if (this.value === 'neet-ug' || this.value === 'neet-pg') {
                    rankInput.placeholder = 'NEET AIR (if declared)';
                } else if (this.value === 'jee-main' || this.value === 'jee-advanced') {
                    rankInput.placeholder = 'JEE Rank (if declared)';
                } else {
                    rankInput.placeholder = 'Your rank (if declared)';
                }
            }
        });
    }
    
    function showFieldHint(input, hint) {
        // Remove existing hints
        const existingHint = input.parentElement.querySelector('.field-hint');
        if (existingHint) {
            existingHint.remove();
        }
        
        // Create hint element
        const hintElement = document.createElement('div');
        hintElement.className = 'field-hint';
        hintElement.textContent = hint;
        hintElement.style.cssText = `
            font-size: 0.85rem;
            color: #777;
            margin-top: 5px;
            font-style: italic;
        `;
        
        input.parentElement.appendChild(hintElement);
        
        // Remove hint on blur
        input.addEventListener('blur', function() {
            setTimeout(() => {
                hintElement.remove();
            }, 200);
        }, { once: true });
    }
})();
