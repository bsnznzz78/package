# RBC Counselling Consultancy Website

A comprehensive, responsive website for RBC Counselling Consultancy - a trusted partner for medical and engineering college admissions in India.

## Overview

RBC Counselling Consultancy provides expert guidance for NEET, JEE, and state-level counselling processes. This website serves as the primary digital platform for students and parents to learn about services, explore colleges, and book consultations.

## Features

### Homepage
- **Hero Section**: Compelling headline with clear call-to-action buttons
- **Trust Indicators**: Key metrics (5000+ students placed, 98% success rate)
- **Why Choose Us**: 6 benefit cards highlighting unique value propositions
- **Services Overview**: Quick overview of 5 main services
- **Testimonials Carousel**: Auto-rotating student success stories
- **Urgency Banner**: Countdown timer for limited-time offers

### About Us Page
- **Company Story**: Mission, vision, and founding story
- **Success Metrics**: Animated counters showing impact
- **Expert Team**: Profiles of 6 counsellors with specializations
- **Accreditations**: Government recognitions and partnerships
- **Core Values**: Company principles and ethics

### Services Page
- **5 Detailed Services**:
  - NEET Counselling (UG/PG, AIQ, State Quota)
  - JEE Counselling (JoSAA, CSAB, State-level)
  - State Quota Counselling (Karnataka, Maharashtra, UP)
  - Management Quota Admissions
  - Document Verification & Support
- **Tiered Packages**: Basic (₹9,999), Complete (₹24,999), Premium (₹49,999)
- **Process Flow**: 9-step visual journey from consultation to admission
- **FAQ Section**: Common service-related questions

### Colleges Page
- **State-wise Listings**: Karnataka, Maharashtra, Uttar Pradesh
- **Featured College Profiles**: Detailed information for top institutions
- **Interactive Filters**: By state, type, ownership, and search
- **Comparison Tool**: Side-by-side comparison of up to 3 colleges
- **Virtual Tours**: Video tour integrations
- **College Details Modal**: Comprehensive information popups

### Contact Page
- **Multiple Contact Channels**: Phone, WhatsApp, Email, In-person
- **Appointment Scheduling**: Smart form with date/time validation
- **General Contact Form**: Multi-purpose inquiry form
- **Office Locations**: 3 offices (Bangalore, Mumbai, Lucknow)
- **Interactive Map**: Office location visualization
- **Expanded FAQ**: Categorized by General, Services, Payment, Process

## Technical Stack

### Frontend
- **HTML5**: Semantic markup for accessibility
- **CSS3**: Modern styling with custom properties, Grid, and Flexbox
- **Vanilla JavaScript**: No framework dependencies for lightweight performance
- **Mobile-First Design**: Fully responsive across all devices

### Backend
- **Runtime:** Node.js with Express.js
- **Database:** SQLite3 with better-sqlite3
- **Authentication:** JWT (JSON Web Tokens)
- **Security:** bcrypt, Helmet, CORS, Rate Limiting
- **Email:** Nodemailer
- **SMS:** Twilio (optional)

## File Structure

```
/
├── index.html              # Homepage
├── about.html             # About Us page
├── services.html          # Services page
├── colleges.html          # Colleges directory
├── contact.html           # Contact page
├── css/
│   ├── styles.css        # Main stylesheet
│   └── responsive.css    # Mobile responsive styles
├── js/
│   ├── main.js           # Core JavaScript functionality
│   ├── colleges.js       # Colleges page specific features
│   └── contact.js        # Contact forms and validation
├── backend/              # Backend API server
│   ├── src/             # Backend source code
│   ├── database/        # SQLite database
│   ├── package.json     # Node.js dependencies
│   ├── README.md        # Backend documentation
│   └── API_DOCUMENTATION.md  # API docs
├── .gitignore            # Git ignore rules
└── README.md             # This file
```

## Key Features Implementation

### Interactive Elements
- **Countdown Timer**: Real-time countdown for urgency banner
- **Testimonials Carousel**: Auto-rotating with manual controls
- **FAQ Accordion**: Expandable/collapsible question panels
- **Mobile Navigation**: Hamburger menu with smooth transitions
- **Form Validation**: Real-time validation with helpful error messages
- **Animated Counters**: Numbers count up when scrolled into view
- **College Comparison**: Dynamic table generation
- **Modal Windows**: College details overlay

### Responsive Design
- **Breakpoints**:
  - Desktop: 1024px+
  - Tablet: 768px - 1024px
  - Mobile: Below 768px
  - Small Mobile: Below 480px
- **Mobile Menu**: Full-screen overlay navigation
- **Flexible Grids**: Adapts from 4 columns to 1 column
- **Touch-Friendly**: Larger tap targets on mobile
- **Optimized Images**: Emoji placeholders for fast loading

### Form Features
- **Smart Date Picker**: Disables Sundays, sets min/max dates
- **Phone Validation**: Auto-formats to 10-digit Indian numbers
- **Time Slot Management**: Disables past slots for same-day bookings
- **Success Modals**: Attractive confirmation messages
- **Field Hints**: Contextual help text

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Optimizations

- No external dependencies or frameworks
- Minimal HTTP requests
- CSS custom properties for theming
- Efficient JavaScript with event delegation
- Debounced search and filter functions
- Smooth scroll behavior
- Optimized animations

## Accessibility Features

- Semantic HTML5 elements
- ARIA labels for interactive elements
- Keyboard navigation support
- Focus indicators
- Sufficient color contrast
- Descriptive link text
- Form field labels

## Future Enhancements

Potential additions for future versions:
- Student portal with personalized dashboards
- Centralized database for comprehensive college information
- Blog section for counselling tips and success stories
- Live chat support and chatbot guidance
- Payment gateway integration for premium services
- Advanced analytics and reporting for admin teams

## Getting Started

### Frontend Only

1. Clone or download the repository
2. Open `index.html` in a web browser
3. No build process required - pure HTML/CSS/JS

For local development:
```bash
# Simple HTTP server (Python)
python -m http.server 8000

# Or use any local server of your choice
# Then visit: http://localhost:8000
```

### With Backend (Full Stack)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd rbc-counselling
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   npm run migrate
   npm run dev
   ```
   Backend runs on `http://localhost:5000`

3. **Setup Frontend**
   ```bash
   # In a new terminal, from project root
   python -m http.server 8000
   ```
   Frontend runs on `http://localhost:8000`

4. **Create First Admin User**
   ```bash
   curl -X POST http://localhost:5000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "full_name": "Admin User",
       "phone": "+919876543210",
       "email": "admin@example.com",
       "password": "SecurePass123!",
       "role": "super_admin"
     }'
   ```

For detailed backend setup and API documentation, see:
- [Backend README](backend/README.md)
- [API Documentation](backend/API_DOCUMENTATION.md)

## Customization

### Colors
Update CSS custom properties in `css/styles.css`:
```css
:root {
    --primary-color: #0066cc;
    --accent-color: #ff6b35;
    --secondary-color: #00a86b;
    /* ... */
}
```

### Content
Edit HTML files directly to update:
- Text content
- Images (replace emoji placeholders)
- Contact information
- Service packages and pricing
- College listings

## Maintenance

- Regularly update college information and cutoffs
- Refresh testimonials with recent success stories
- Update countdown timer end dates
- Review and respond to form submissions
- Keep FAQ section current with common queries

## License

© 2024 RBC Counselling Consultancy. All rights reserved.

## Contact

For questions about this website:
- Email: info@rbccounselling.com
- Phone: +91 98765 43210
- Website: [www.rbccounselling.com](#)

---

**Built with ❤️ for student success**
