# RBC Counselling Backend - API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

Most admin endpoints require authentication. Include the JWT token in the Authorization header:

```http
Authorization: Bearer {your-jwt-token}
```

Or the token will be automatically read from cookies if using browser.

---

## 1. Authentication Endpoints

### 1.1 Register Admin

Register a new admin user.

**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "full_name": "John Doe",
  "phone": "+919876543210",
  "email": "admin@example.com",
  "password": "SecurePass123!",
  "role": "admin"
}
```

**Validation Rules:**
- `full_name`: 2-100 characters (required)
- `phone`: Valid Indian phone number +91XXXXXXXXXX (required, unique)
- `email`: Valid email format (required, unique)
- `password`: Min 8 chars, must contain uppercase, lowercase, number, special char (required)
- `role`: "super_admin", "admin", or "viewer" (optional, defaults to "admin")

**Success Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": 1,
    "full_name": "John Doe",
    "email": "admin@example.com",
    "phone_last4": "3210",
    "role": "admin"
  }
}
```

**Error Responses:**
- `400 Bad Request`: Validation error
- `409 Conflict`: Email or phone already registered

---

### 1.2 Login

Login with email or phone number.

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "identifier": "admin@example.com",
  "password": "SecurePass123!",
  "remember_me": true
}
```

**Parameters:**
- `identifier`: Email or phone number (required)
- `password`: User password (required)
- `remember_me`: If true, token expires in 30 days instead of 1 day (optional)

**Success Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": 1,
    "full_name": "John Doe",
    "email": "admin@example.com",
    "phone_last4": "3210",
    "role": "admin"
  }
}
```

**Error Responses:**
- `400 Bad Request`: Invalid input
- `401 Unauthorized`: Invalid credentials

**Rate Limiting:** 10 requests per 15 minutes

---

### 1.3 Get Current Admin

Get details of currently logged-in admin.

**Endpoint:** `GET /api/auth/me`

**Authentication:** Required

**Success Response (200):**
```json
{
  "success": true,
  "admin": {
    "id": 1,
    "full_name": "John Doe",
    "email": "admin@example.com",
    "phone": "+919876543210",
    "phone_last4": "3210",
    "role": "admin",
    "created_at": "2024-01-01T00:00:00.000Z",
    "last_login_at": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### 1.4 Logout

Logout current admin (clears cookie).

**Endpoint:** `POST /api/auth/logout`

**Authentication:** Required

**Success Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### 1.5 Request Password Reset

Request a password reset token via email.

**Endpoint:** `POST /api/auth/password/request-reset`

**Request Body:**
```json
{
  "identifier": "admin@example.com"
}
```

**Parameters:**
- `identifier`: Email or phone number (required)

**Success Response (200):**
```json
{
  "success": true,
  "message": "Password reset instructions sent to your email"
}
```

**Note:** For security, always returns success even if user doesn't exist.

---

### 1.6 Reset Password

Reset password using token from email.

**Endpoint:** `POST /api/auth/password/reset`

**Request Body:**
```json
{
  "token": "a1b2c3d4e5f6...",
  "new_password": "NewSecurePass123!"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

**Error Responses:**
- `400 Bad Request`: Invalid or expired token

---

## 2. Form Submission Endpoints

### 2.1 Contact Form

Submit a general contact form.

**Endpoint:** `POST /api/forms/contact`

**Request Body:**
```json
{
  "name": "Rajesh Kumar",
  "phone": "+919876543210",
  "email": "rajesh@example.com",
  "message": "I need counselling for NEET UG admission in Karnataka",
  "state": "Karnataka"
}
```

**Validation:**
- `name`: 2-100 characters (required)
- `phone`: Valid Indian phone +91XXXXXXXXXX (required)
- `email`: Valid email (required)
- `message`: 10-2000 characters (required)
- `state`: Max 100 characters (optional)

**Success Response (201):**
```json
{
  "success": true,
  "message": "Contact form submitted successfully"
}
```

**Rate Limiting:** 5 submissions per 15 minutes per IP

---

### 2.2 Appointment Booking

Book an appointment with counsellor.

**Endpoint:** `POST /api/forms/appointment`

**Request Body:**
```json
{
  "name": "Priya Sharma",
  "phone": "+919876543210",
  "email": "priya@example.com",
  "preferred_date": "2024-12-25",
  "preferred_time": "10:00",
  "college_preference": "Medical colleges in Bangalore",
  "state": "Karnataka"
}
```

**Validation:**
- `name`: 2-100 characters (required)
- `phone`: Valid Indian phone (required)
- `email`: Valid email (required)
- `preferred_date`: YYYY-MM-DD format (required)
- `preferred_time`: HH:MM format (required)
- `college_preference`: Max 200 characters (optional)
- `state`: Max 100 characters (optional)

**Success Response (201):**
```json
{
  "success": true,
  "message": "Appointment booked successfully"
}
```

---

### 2.3 College Inquiry

Submit inquiry about specific college.

**Endpoint:** `POST /api/forms/college-inquiry`

**Request Body:**
```json
{
  "name": "Amit Patel",
  "phone": "+919876543210",
  "email": "amit@example.com",
  "course": "MBBS",
  "college_name": "Bangalore Medical College",
  "state": "Karnataka",
  "message": "What are the cutoff marks for general category?"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "College inquiry submitted successfully"
}
```

---

### 2.4 Newsletter Subscription

Subscribe to newsletter.

**Endpoint:** `POST /api/forms/newsletter`

**Request Body:**
```json
{
  "email": "student@example.com",
  "name": "Student Name",
  "phone": "+919876543210"
}
```

**Validation:**
- `email`: Valid email (required)
- `name`: Max 100 characters (optional)
- `phone`: Valid Indian phone (optional)

**Success Response (201):**
```json
{
  "success": true,
  "message": "Subscribed to newsletter successfully"
}
```

---

## 3. Admin Dashboard Endpoints

**All endpoints require authentication.**

### 3.1 Dashboard Statistics

Get overview statistics for dashboard.

**Endpoint:** `GET /api/admin/dashboard/stats`

**Authentication:** Required

**Success Response (200):**
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

---

### 3.2 Contact Submissions

#### List Contact Submissions

**Endpoint:** `GET /api/admin/contact-submissions`

**Query Parameters:**
- `status`: Filter by status (new, unread, pending, contacted, completed)
- `state`: Filter by state
- `name`: Search by name (partial match)
- `phone`: Search by exact phone number
- `from_date`: Start date YYYY-MM-DD
- `to_date`: End date YYYY-MM-DD

**Example:**
```
GET /api/admin/contact-submissions?status=new&state=Karnataka&from_date=2024-01-01
```

**Success Response (200):**
```json
{
  "success": true,
  "count": 25,
  "data": [
    {
      "id": 1,
      "name": "Rajesh Kumar",
      "phone": "+919876543210",
      "phone_last4": "3210",
      "email": "rajesh@example.com",
      "message": "Need counselling...",
      "state": "Karnataka",
      "status": "new",
      "notes": [],
      "is_read": 0,
      "created_at": "2024-01-15T10:30:00.000Z",
      "updated_at": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

#### Get Single Contact Submission

**Endpoint:** `GET /api/admin/contact-submissions/:id`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Rajesh Kumar",
    "phone": "+919876543210",
    "phone_last4": "3210",
    "email": "rajesh@example.com",
    "message": "Need counselling...",
    "state": "Karnataka",
    "status": "new",
    "notes": [
      {
        "text": "Called student, interested in medical colleges",
        "admin_name": "John Doe",
        "created_at": "2024-01-15T14:00:00.000Z"
      }
    ],
    "is_read": 1,
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T14:00:00.000Z"
  }
}
```

---

#### Update Contact Submission Status

**Endpoint:** `PATCH /api/admin/contact-submissions/:id/status`

**Request Body:**
```json
{
  "status": "contacted"
}
```

**Valid Status Values:**
- `new`
- `unread`
- `pending`
- `contacted`
- `completed`

**Success Response (200):**
```json
{
  "success": true,
  "message": "Submission status updated"
}
```

---

#### Add Note to Contact Submission

**Endpoint:** `POST /api/admin/contact-submissions/:id/notes`

**Request Body:**
```json
{
  "note": "Student is interested in Bangalore Medical College. Follow up on Monday."
}
```

**Validation:**
- `note`: 1-1000 characters (required)

**Success Response (201):**
```json
{
  "success": true,
  "message": "Note added successfully"
}
```

---

#### Archive Contact Submission

**Endpoint:** `POST /api/admin/contact-submissions/:id/archive`

**Success Response (200):**
```json
{
  "success": true,
  "message": "Submission archived"
}
```

**Note:** Archived submissions don't appear in list queries.

---

#### Delete Contact Submission

**Endpoint:** `DELETE /api/admin/contact-submissions/:id`

**Authorization:** Super Admin only

**Success Response (200):**
```json
{
  "success": true,
  "message": "Submission deleted"
}
```

---

### 3.3 Appointment Bookings

All endpoints same as contact submissions but with different base path:

- `GET /api/admin/appointment-bookings`
- `GET /api/admin/appointment-bookings/:id`
- `PATCH /api/admin/appointment-bookings/:id/status`
- `POST /api/admin/appointment-bookings/:id/notes`
- `POST /api/admin/appointment-bookings/:id/archive`
- `DELETE /api/admin/appointment-bookings/:id`

**Status Values:**
- `pending`
- `contacted`
- `confirmed`
- `completed`
- `cancelled`

---

### 3.4 College Inquiries

- `GET /api/admin/college-inquiries`
- `GET /api/admin/college-inquiries/:id`
- `PATCH /api/admin/college-inquiries/:id/status`
- `POST /api/admin/college-inquiries/:id/notes`
- `POST /api/admin/college-inquiries/:id/archive`
- `DELETE /api/admin/college-inquiries/:id`

**Status Values:**
- `new`
- `pending`
- `contacted`
- `completed`
- `closed`

---

### 3.5 Export Data

Export submissions to CSV or Excel.

**Endpoint:** `GET /api/admin/export`

**Query Parameters:**
- `type`: Type of data (required)
  - `contacts`
  - `appointments`
  - `inquiries`
- `format`: Export format (required)
  - `csv`
  - `xlsx`

**Example:**
```
GET /api/admin/export?type=contacts&format=xlsx
```

**Success Response:**
Returns file download with appropriate Content-Type and Content-Disposition headers.

---

## Error Responses

All endpoints may return these error responses:

### 400 Bad Request
```json
{
  "status": "fail",
  "message": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "status": "fail",
  "message": "Not authorized to access this route"
}
```

### 403 Forbidden
```json
{
  "status": "fail",
  "message": "You do not have permission to perform this action"
}
```

### 404 Not Found
```json
{
  "status": "fail",
  "message": "Resource not found"
}
```

### 429 Too Many Requests
```json
{
  "status": "fail",
  "message": "Too many requests. Please try again later."
}
```

### 500 Internal Server Error
```json
{
  "status": "error",
  "message": "Something went wrong"
}
```

---

## Rate Limiting

| Endpoint Category | Limit |
|-------------------|-------|
| General API | 100 requests per 15 minutes |
| Login | 10 requests per 15 minutes |
| Form Submissions | 5 requests per 15 minutes |

---

## Phone Number Format

All phone numbers must be in Indian format:
- Format: `+91XXXXXXXXXX`
- Example: `+919876543210`
- The API will validate and normalize phone numbers

---

## Pagination

Currently, all list endpoints return all matching records. In future versions, pagination will be added:

```
?page=1&limit=20
```

---

## Webhooks (Future)

Webhook support for form submissions will be added in future versions.

---

## Postman Collection

Import this collection for testing: [Download Postman Collection](#)

---

## Support

For API support:
- Email: dev@rbccounselling.com
- Documentation: [GitHub Wiki](#)
