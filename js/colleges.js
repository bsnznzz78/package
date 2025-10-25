// Colleges Page Specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initCollegeFiltering();
    initCollegeComparison();
    initCollegeDetails();
});

// ===========================
// College Filtering
// ===========================
function initCollegeFiltering() {
    const stateFilter = document.getElementById('state-filter');
    const typeFilter = document.getElementById('type-filter');
    const ownershipFilter = document.getElementById('ownership-filter');
    const searchFilter = document.getElementById('search-filter');
    
    if (!stateFilter) return;
    
    const allColleges = document.querySelectorAll('.college-featured-card, .college-list-item');
    const stateSections = document.querySelectorAll('.state-section');
    
    function filterColleges() {
        const stateValue = stateFilter.value;
        const typeValue = typeFilter.value;
        const ownershipValue = ownershipFilter.value;
        const searchValue = searchFilter.value.toLowerCase();
        
        // Filter featured colleges
        document.querySelectorAll('.college-featured-card').forEach(college => {
            const collegeState = college.getAttribute('data-state');
            const collegeType = college.getAttribute('data-type');
            const collegeName = college.querySelector('h3').textContent.toLowerCase();
            
            const stateMatch = stateValue === 'all' || collegeState === stateValue;
            const typeMatch = typeValue === 'all' || collegeType === typeValue;
            const searchMatch = searchValue === '' || collegeName.includes(searchValue);
            
            if (stateMatch && typeMatch && searchMatch) {
                college.style.display = 'block';
            } else {
                college.style.display = 'none';
            }
        });
        
        // Filter state sections
        stateSections.forEach(section => {
            const sectionState = section.getAttribute('data-state');
            
            if (stateValue === 'all' || sectionState === stateValue) {
                section.style.display = 'block';
                
                // Filter items within section
                const items = section.querySelectorAll('.college-list-item');
                items.forEach(item => {
                    const itemType = item.getAttribute('data-type');
                    const itemOwnership = item.getAttribute('data-ownership');
                    const itemName = item.querySelector('h4').textContent.toLowerCase();
                    
                    const typeMatch = typeValue === 'all' || itemType === typeValue;
                    const ownershipMatch = ownershipValue === 'all' || itemOwnership === ownershipValue;
                    const searchMatch = searchValue === '' || itemName.includes(searchValue);
                    
                    if (typeMatch && ownershipMatch && searchMatch) {
                        item.style.display = 'flex';
                    } else {
                        item.style.display = 'none';
                    }
                });
            } else {
                section.style.display = 'none';
            }
        });
    }
    
    stateFilter.addEventListener('change', filterColleges);
    typeFilter.addEventListener('change', filterColleges);
    ownershipFilter.addEventListener('change', filterColleges);
    searchFilter.addEventListener('input', debounce(filterColleges, 300));
}

// ===========================
// College Comparison Tool
// ===========================
function initCollegeComparison() {
    const compareBtn = document.getElementById('compare-btn');
    const comparisonResults = document.getElementById('comparison-results');
    
    if (!compareBtn) return;
    
    // College database
    const collegeData = {
        'bmc': {
            name: 'Bangalore Medical College',
            location: 'Bangalore, Karnataka',
            type: 'Government Medical College',
            seats: 150,
            rating: '4.8/5',
            fee: '₹5,000 per year',
            cutoff: 'General: 550, OBC: 510, SC/ST: 470',
            placements: 'Excellent hospital placements'
        },
        'gmc': {
            name: 'Grant Medical College',
            location: 'Mumbai, Maharashtra',
            type: 'Government Medical College',
            seats: 250,
            rating: '4.7/5',
            fee: '₹8,000 per year',
            cutoff: 'General: 560, OBC: 520, SC/ST: 480',
            placements: 'Top-tier hospital placements'
        },
        'kgmu': {
            name: 'King George\'s Medical University',
            location: 'Lucknow, Uttar Pradesh',
            type: 'Government Medical University',
            seats: 200,
            rating: '4.7/5',
            fee: '₹6,000 per year',
            cutoff: 'General: 555, OBC: 515, SC/ST: 475',
            placements: 'Excellent medical placements'
        },
        'bmsce': {
            name: 'BMS College of Engineering',
            location: 'Bangalore, Karnataka',
            type: 'Autonomous Engineering College',
            seats: 1080,
            rating: '4.6/5',
            fee: '₹2,00,000 per year',
            cutoff: 'CSE: 2000, ECE: 4000, Mech: 8000',
            placements: '95% with avg package ₹8 LPA'
        },
        'coep': {
            name: 'COEP Pune',
            location: 'Pune, Maharashtra',
            type: 'Government Engineering College',
            seats: 1000,
            rating: '4.6/5',
            fee: '₹1,50,000 per year',
            cutoff: 'CSE: 3000, ECE: 5000, Mech: 9000',
            placements: '93% with avg package ₹7.5 LPA'
        },
        'iitk': {
            name: 'IIT Kanpur',
            location: 'Kanpur, Uttar Pradesh',
            type: 'Central Government IIT',
            seats: 500,
            rating: '4.8/5',
            fee: '₹2,50,000 per year',
            cutoff: 'CSE: 500, ECE: 1200, Mech: 2500',
            placements: '100% with avg package ₹20 LPA'
        }
    };
    
    compareBtn.addEventListener('click', function() {
        const college1 = document.getElementById('compare-college-1').value;
        const college2 = document.getElementById('compare-college-2').value;
        const college3 = document.getElementById('compare-college-3').value;
        
        if (!college1 && !college2 && !college3) {
            alert('Please select at least one college to compare');
            return;
        }
        
        // Update table headers
        document.getElementById('college1-name').textContent = college1 ? collegeData[college1].name : '-';
        document.getElementById('college2-name').textContent = college2 ? collegeData[college2].name : '-';
        document.getElementById('college3-name').textContent = college3 ? collegeData[college3].name : '-';
        
        // Update table data
        const fields = ['location', 'type', 'seats', 'rating', 'fee', 'cutoff', 'placements'];
        fields.forEach(field => {
            document.getElementById(`college1-${field}`).textContent = 
                college1 ? collegeData[college1][field] : '-';
            document.getElementById(`college2-${field}`).textContent = 
                college2 ? collegeData[college2][field] : '-';
            document.getElementById(`college3-${field}`).textContent = 
                college3 ? collegeData[college3][field] : '-';
        });
        
        // Show results
        comparisonResults.style.display = 'block';
        
        // Scroll to results
        comparisonResults.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
}

// ===========================
// College Details Modal
// ===========================
function initCollegeDetails() {
    const modal = document.getElementById('college-modal');
    const modalBody = document.getElementById('modal-body');
    const closeBtn = document.querySelector('.modal-close');
    const viewDetailsButtons = document.querySelectorAll('.view-details');
    
    if (!modal) return;
    
    // Extended college details
    const collegeDetails = {
        'bmc': {
            name: 'Bangalore Medical College and Research Institute',
            location: 'Bangalore, Karnataka',
            established: '1955',
            type: 'Government',
            seats: 150,
            courses: 'MBBS, MD, MS',
            rating: '4.8/5',
            fee: '₹5,000 per year',
            description: 'Bangalore Medical College is one of the premier medical institutions in India, established in 1955. It is affiliated with Rajiv Gandhi University of Health Sciences and attached to Victoria Hospital and Vani Vilas Hospital.',
            facilities: [
                'State-of-the-art laboratories',
                'Well-equipped library with 20,000+ books',
                'Attached teaching hospitals with 1800+ beds',
                'Research centers',
                'Hostels for boys and girls',
                'Sports facilities'
            ],
            placements: 'Excellent placement record with students placed in top hospitals across India and abroad. Many alumni pursue higher studies in premier institutions.',
            cutoff: 'General Category: 550 marks, OBC: 510 marks, SC/ST: 470 marks (Previous year)',
            website: 'www.bmcri.edu.in'
        },
        'gmc': {
            name: 'Grant Government Medical College',
            location: 'Mumbai, Maharashtra',
            established: '1845',
            type: 'Government',
            seats: 250,
            courses: 'MBBS, MD, MS, DNB',
            rating: '4.7/5',
            fee: '₹8,000 per year',
            description: 'Grant Medical College is one of the oldest medical colleges in Asia, established in 1845. It is affiliated with Maharashtra University of Health Sciences and attached to Sir JJ Hospital.',
            facilities: [
                'Advanced research facilities',
                'Central library with extensive collection',
                'Attached 1400-bed teaching hospital',
                'Modern operation theaters',
                'Student hostels',
                'Sports complex'
            ],
            placements: 'Outstanding placement opportunities in government and private hospitals. Strong alumni network in medical field.',
            cutoff: 'General Category: 560 marks, OBC: 520 marks, SC/ST: 480 marks (Previous year)',
            website: 'www.ggmc.edu.in'
        },
        'bmsce': {
            name: 'BMS College of Engineering',
            location: 'Bangalore, Karnataka',
            established: '1946',
            type: 'Autonomous',
            seats: 1080,
            courses: 'B.Tech, M.Tech, MBA, MCA',
            rating: '4.6/5',
            fee: '₹2,00,000 per year',
            description: 'BMS College of Engineering is one of the oldest and most prestigious engineering colleges in Karnataka. It has autonomous status and is affiliated with VTU.',
            facilities: [
                'Modern laboratories',
                'Central library with digital resources',
                'Innovation and incubation center',
                'Placement cell',
                'Hostels',
                'Sports facilities'
            ],
            placements: '95% placement rate with average package of ₹8 LPA. Top recruiters include Microsoft, Amazon, Infosys, Wipro, TCS.',
            cutoff: 'CSE: 2000 rank, ECE: 4000 rank, Mechanical: 8000 rank (KCET)',
            website: 'www.bmsce.ac.in'
        }
    };
    
    viewDetailsButtons.forEach(button => {
        button.addEventListener('click', function() {
            const collegeId = this.getAttribute('data-college');
            const details = collegeDetails[collegeId];
            
            if (details) {
                modalBody.innerHTML = `
                    <h2>${details.name}</h2>
                    <div class="college-detail-content">
                        <div class="detail-section">
                            <h3>Overview</h3>
                            <p><strong>Location:</strong> ${details.location}</p>
                            <p><strong>Established:</strong> ${details.established}</p>
                            <p><strong>Type:</strong> ${details.type}</p>
                            <p><strong>Total Seats:</strong> ${details.seats}</p>
                            <p><strong>Courses:</strong> ${details.courses}</p>
                            <p><strong>Rating:</strong> ${details.rating}</p>
                            <p><strong>Annual Fee:</strong> ${details.fee}</p>
                        </div>
                        <div class="detail-section">
                            <h3>About</h3>
                            <p>${details.description}</p>
                        </div>
                        <div class="detail-section">
                            <h3>Facilities</h3>
                            <ul>
                                ${details.facilities.map(f => `<li>${f}</li>`).join('')}
                            </ul>
                        </div>
                        <div class="detail-section">
                            <h3>Placements</h3>
                            <p>${details.placements}</p>
                        </div>
                        <div class="detail-section">
                            <h3>Cutoff (Previous Year)</h3>
                            <p>${details.cutoff}</p>
                        </div>
                        <div class="detail-section">
                            <p><strong>Website:</strong> <a href="http://${details.website}" target="_blank">${details.website}</a></p>
                        </div>
                    </div>
                `;
                
                modal.classList.add('active');
            }
        });
    });
    
    closeBtn.addEventListener('click', function() {
        modal.classList.remove('active');
    });
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
}

// Debounce utility
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
