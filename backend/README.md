# RBC Counselling Consultancy - Backend API

Complete backend system with authentication and admin dashboard for the RBC Counselling Consultancy website.

## Features

### Authentication
- ✅ Admin registration with full name, phone, email, and password
- ✅ Admin login with email or phone number
- ✅ JWT-based authentication with remember me functionality
- ✅ Secure password hashing with bcrypt
- ✅ Password reset via email
- ✅ Protected admin routes with role-based access control
- ✅ Roles: Super Admin, Admin, Viewer

### Database Schema
- ✅ Admins table with encrypted phone numbers
- ✅ Contact form submissions
- ✅ Appointment bookings
- ✅ Newsletter subscriptions
- ✅ College inquiry forms
- ✅ Password reset tokens
- ✅ OTP verification codes
- ✅ Audit logs

### Admin Dashboard APIs
- ✅ View all submissions with filters
- ✅ Search by name, phone, date range, state, status
- ✅ Update submission status
- ✅ Add notes to submissions
- ✅ Archive or delete submissions
- ✅ Dashboard statistics
- ✅ Export data to CSV or Excel

### Form Submission APIs
- ✅ Contact form API
- ✅ Appointment booking API
- ✅ College inquiry API
- ✅ Newsletter subscription API
- ✅ Email confirmations to users
- ✅ Email/SMS notifications to admins

### Security
- ✅ JWT authentication
- ✅ Password strength validation
- ✅ Phone number encryption in database
- ✅ Input sanitization (XSS protection)
- ✅ SQL injection prevention (parameterized queries)
- ✅ Rate limiting on all endpoints
- ✅ Helmet.js security headers
- ✅ CORS configuration
- ✅ Environment variable management

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** SQLite3 with better-sqlite3
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcryptjs
- **Validation:** Joi
- **Email:** Nodemailer
- **SMS:** Twilio (optional)
- **Export:** ExcelJS, json2csv
- **Security:** Helmet, XSS, express-rate-limit

## Installation

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager

### Setup Steps

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your settings:
   ```env
   PORT=5000
   JWT_SECRET=your-secure-secret-key
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   # ... other settings
   ```

4. **Initialize database:**
   ```bash
   npm run migrate
   ```

5. **Start the server:**
   
   Development mode (with auto-reload):
   ```bash
   npm run dev
   ```
   
   Production mode:
   ```bash
   npm start
   ```

The server will start on `http://localhost:5000`

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register Admin
```http
POST /api/auth/register
Content-Type: application/json

{
  "full_name": "John Doe",
  "phone": "+919876543210",
  "email": "admin@example.com",
  "password": "SecurePass123!",
  "role": "admin"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "identifier": "admin@example.com",  // or phone number
  "password": "SecurePass123!",
  "remember_me": true
}
```

#### Get Current Admin
```http
GET /api/auth/me
Authorization: Bearer {token}
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer {token}
```

#### Request Password Reset
```http
POST /api/auth/password/request-reset
Content-Type: application/json

{
  "identifier": "admin@example.com"
}
```

#### Reset Password
```http
POST /api/auth/password/reset
Content-Type: application/json

{
  "token": "reset-token-from-email",
  "new_password": "NewSecurePass123!"
}
```

### Form Submission Endpoints

#### Contact Form
```http
POST /api/forms/contact
Content-Type: application/json

{
  "name": "Student Name",
  "phone": "+919876543210",
  "email": "student@example.com",
  "message": "I need counselling for NEET UG",
  "state": "Karnataka"
}
```

#### Appointment Booking
```http
POST /api/forms/appointment
Content-Type: application/json

{
  "name": "Student Name",
  "phone": "+919876543210",
  "email": "student@example.com",
  "preferred_date": "2024-12-25",
  "preferred_time": "10:00",
  "college_preference": "Medical colleges in Karnataka",
  "state": "Karnataka"
}
```

#### College Inquiry
```http
POST /api/forms/college-inquiry
Content-Type: application/json

{
  "name": "Student Name",
  "phone": "+919876543210",
  "email": "student@example.com",
  "course": "MBBS",
  "college_name": "Bangalore Medical College",
  "state": "Karnataka",
  "message": "What are the cutoff marks?"
}
```

#### Newsletter Subscription
```http
POST /api/forms/newsletter
Content-Type: application/json

{
  "email": "student@example.com",
  "name": "Student Name",
  "phone": "+919876543210"
}
```

### Admin Dashboard Endpoints

All admin endpoints require authentication:
```
Authorization: Bearer {token}
```

#### Dashboard Statistics
```http
GET /api/admin/dashboard/stats
```

Response:
```json
{
  "success": true,
  "data": {
    "contacts": {
      "total": 150,
      "new": 25,
      "pending": 30,
      "completed": 95
    },
    "appointments": {
      "total": 80,
      "pending": 15,
      "confirmed": 40,
      "completed": 25
    },
    "college_inquiries": {
      "total": 120,
      "new": 20,
      "pending": 25,
      "completed": 75
    },
    "newsletter_subscribers": 450
  }
}
```

#### Get Contact Submissions
```http
GET /api/admin/contact-submissions?status=new&state=Karnataka&from_date=2024-01-01
```

Query parameters:
- `status`: new, unread, pending, contacted, completed
- `state`: State name
- `name`: Search by name (partial match)
- `phone`: Search by phone number
- `from_date`: Start date (YYYY-MM-DD)
- `to_date`: End date (YYYY-MM-DD)

#### Get Single Submission
```http
GET /api/admin/contact-submissions/:id
```

#### Update Submission Status
```http
PATCH /api/admin/contact-submissions/:id/status
Content-Type: application/json

{
  "status": "contacted"
}
```

#### Add Note to Submission
```http
POST /api/admin/contact-submissions/:id/notes
Content-Type: application/json

{
  "note": "Called student. Interested in Karnataka colleges."
}
```

#### Archive Submission
```http
POST /api/admin/contact-submissions/:id/archive
```

#### Delete Submission (Super Admin only)
```http
DELETE /api/admin/contact-submissions/:id
```

#### Export Data
```http
GET /api/admin/export?type=contacts&format=csv
```

Parameters:
- `type`: contacts, appointments, inquiries
- `format`: csv, xlsx

### Appointment Endpoints

Similar structure to contact submissions:
- `GET /api/admin/appointment-bookings`
- `GET /api/admin/appointment-bookings/:id`
- `PATCH /api/admin/appointment-bookings/:id/status`
- `POST /api/admin/appointment-bookings/:id/notes`
- `POST /api/admin/appointment-bookings/:id/archive`
- `DELETE /api/admin/appointment-bookings/:id`

Status values: `pending`, `contacted`, `confirmed`, `completed`, `cancelled`

### College Inquiry Endpoints

- `GET /api/admin/college-inquiries`
- `GET /api/admin/college-inquiries/:id`
- `PATCH /api/admin/college-inquiries/:id/status`
- `POST /api/admin/college-inquiries/:id/notes`
- `POST /api/admin/college-inquiries/:id/archive`
- `DELETE /api/admin/college-inquiries/:id`

Status values: `new`, `pending`, `contacted`, `completed`, `closed`

## Email Configuration

### Gmail Setup

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account Settings
   - Security → 2-Step Verification → App passwords
   - Generate new app password
3. Add to `.env`:
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-16-char-app-password
   ```

## SMS Configuration (Optional)

### Twilio Setup

1. Sign up at [twilio.com](https://www.twilio.com)
2. Get your Account SID and Auth Token
3. Get a Twilio phone number
4. Add to `.env`:
   ```env
   SMS_ENABLED=true
   TWILIO_ACCOUNT_SID=your-account-sid
   TWILIO_AUTH_TOKEN=your-auth-token
   TWILIO_PHONE_NUMBER=+1234567890
   ADMIN_NOTIFICATION_PHONE=+919876543210
   ```

## Security Best Practices

### Production Deployment

1. **Generate strong secrets:**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```

2. **Enable HTTPS:**
   - Set `COOKIE_SECURE=true` in `.env`
   - Use SSL certificate (Let's Encrypt)

3. **Database backups:**
   ```bash
   cp database/rbc_counselling.db database/backup_$(date +%Y%m%d).db
   ```

4. **Environment variables:**
   - Never commit `.env` file
   - Use environment-specific configs
   - Rotate secrets regularly

5. **Rate limiting:**
   - Already configured for all endpoints
   - Adjust limits in `.env` as needed

## Phone Number Encryption

Phone numbers are encrypted at rest using AES-256-GCM encryption. To generate a new encryption key:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Add to `.env`:
```env
PHONE_ENCRYPTION_KEY=your-base64-encoded-32-byte-key
```

## Database Management

### View Database
```bash
sqlite3 database/rbc_counselling.db
.tables
SELECT * FROM admins;
.exit
```

### Reset Database
```bash
rm database/rbc_counselling.db
npm run migrate
```

### Backup Database
```bash
cp database/rbc_counselling.db backups/db_$(date +%Y%m%d_%H%M%S).db
```

## Troubleshooting

### Port Already in Use
```bash
lsof -ti:5000 | xargs kill -9
# or change PORT in .env
```

### Database Locked
```bash
# Close all connections and restart server
```

### Email Not Sending
- Check Gmail app password is correct
- Verify 2FA is enabled
- Check firewall/network settings

### JWT Token Invalid
- Check JWT_SECRET matches
- Token may have expired
- Clear browser cookies

## Development

### Project Structure
```
backend/
├── src/
│   ├── config/           # Configuration management
│   ├── controllers/      # Route controllers
│   ├── database/         # Database connection & migrations
│   ├── middleware/       # Express middleware
│   ├── repositories/     # Data access layer
│   ├── routes/           # API routes
│   ├── services/         # Email, SMS services
│   ├── scripts/          # Utility scripts
│   ├── utils/            # Helper functions
│   └── index.js          # Application entry point
├── database/             # SQLite database files
├── .env.example          # Environment template
├── package.json          # Dependencies
└── README.md             # This file
```

### Adding New Endpoints

1. Create controller in `src/controllers/`
2. Add route in `src/routes/`
3. Update this README

### Running Tests
```bash
npm test
```

## Support

For issues or questions:
- Email: info@rbccounselling.com
- Phone: +91 98765 43210

---

**Built with ❤️ for student success**
