# RBC Counselling Consultancy - Deployment Guide

This guide provides step-by-step instructions for deploying the RBC Counselling Consultancy website with its backend API.

## Prerequisites

### Required
- **Node.js** 16.x or higher
- **npm** 7.x or higher
- **Git** for version control

### Optional
- **PM2** for process management (production)
- **Nginx** for reverse proxy (production)
- **SSL Certificate** from Let's Encrypt (production)

## Quick Start (Development)

### 1. Clone Repository
```bash
git clone <your-repo-url>
cd rbc-counselling
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

Edit `.env` and set at minimum:
```env
JWT_SECRET=your-very-secure-random-secret-key-here
PHONE_ENCRYPTION_KEY=your-32-byte-base64-key
```

Generate secure keys:
```bash
# JWT Secret (any length)
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Phone Encryption Key (must be 32 bytes)
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Initialize database:
```bash
npm run migrate
```

Start backend:
```bash
npm run dev
```

Backend runs on `http://localhost:5000`

### 3. Setup Frontend

Open a new terminal:
```bash
cd ..
python3 -m http.server 8000
```

Or using Node.js:
```bash
npx http-server -p 8000
```

Frontend runs on `http://localhost:8000`

### 4. Create First Admin

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Super Admin",
    "phone": "+919876543210",
    "email": "admin@rbccounselling.com",
    "password": "SecurePass123!",
    "role": "super_admin"
  }'
```

Save the returned token. You can now access the admin dashboard!

---

## Production Deployment

### Option 1: VPS Deployment (DigitalOcean, Linode, AWS EC2)

#### Step 1: Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx

# Install certbot for SSL
sudo apt install -y certbot python3-certbot-nginx
```

#### Step 2: Clone and Setup Application

```bash
# Create application directory
sudo mkdir -p /var/www/rbc-counselling
cd /var/www/rbc-counselling

# Clone repository
sudo git clone <your-repo-url> .

# Setup backend
cd backend
sudo npm install --production
sudo npm run migrate

# Configure environment
sudo cp .env.example .env
sudo nano .env
```

Edit `.env` with production values:
```env
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://yourdomain.com
JWT_SECRET=<generated-secret>
PHONE_ENCRYPTION_KEY=<generated-key>
COOKIE_SECURE=true
EMAIL_USER=<your-gmail>
EMAIL_PASSWORD=<app-password>
ADMIN_NOTIFICATION_EMAIL=<admin-email>
```

#### Step 3: Start Backend with PM2

```bash
cd /var/www/rbc-counselling/backend
pm2 start src/index.js --name rbc-backend
pm2 save
pm2 startup
```

#### Step 4: Configure Nginx

Create Nginx config:
```bash
sudo nano /etc/nginx/sites-available/rbc-counselling
```

Add configuration:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Frontend
    root /var/www/rbc-counselling;
    index index.html;

    # Frontend static files
    location / {
        try_files $uri $uri/ =404;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

Enable site and restart Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/rbc-counselling /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### Step 5: Setup SSL with Let's Encrypt

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Follow prompts and select redirect HTTP to HTTPS.

#### Step 6: Setup Automatic Updates

```bash
# Create update script
sudo nano /var/www/rbc-counselling/update.sh
```

Add content:
```bash
#!/bin/bash
cd /var/www/rbc-counselling
git pull
cd backend
npm install --production
pm2 restart rbc-backend
```

Make executable:
```bash
sudo chmod +x /var/www/rbc-counselling/update.sh
```

To update:
```bash
cd /var/www/rbc-counselling
sudo ./update.sh
```

---

### Option 2: Heroku Deployment

#### Prepare Application

Create `Procfile` in project root:
```
web: cd backend && npm start
```

Create `package.json` in project root:
```json
{
  "name": "rbc-counselling",
  "version": "1.0.0",
  "scripts": {
    "start": "cd backend && npm start",
    "install": "cd backend && npm install"
  }
}
```

#### Deploy to Heroku

```bash
# Login to Heroku
heroku login

# Create app
heroku create rbc-counselling

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=<your-secret>
heroku config:set PHONE_ENCRYPTION_KEY=<your-key>
heroku config:set EMAIL_USER=<your-email>
heroku config:set EMAIL_PASSWORD=<app-password>

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

---

### Option 3: Vercel (Frontend) + Railway (Backend)

#### Deploy Frontend to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy frontend
cd /path/to/project
vercel
```

#### Deploy Backend to Railway

1. Go to [railway.app](https://railway.app)
2. Create new project from GitHub
3. Select backend directory
4. Add environment variables
5. Deploy!

---

## Email Configuration

### Gmail Setup

1. Enable 2-Factor Authentication
2. Generate App Password:
   - Google Account → Security → 2-Step Verification → App passwords
   - Select "Mail" and your device
   - Copy generated 16-character password

3. Update `.env`:
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
```

### Other Email Providers

**Outlook/Hotmail:**
```env
EMAIL_HOST=smtp.office365.com
EMAIL_PORT=587
```

**SendGrid:**
```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASSWORD=<your-sendgrid-api-key>
```

---

## SMS Configuration (Optional)

### Twilio Setup

1. Sign up at [twilio.com](https://www.twilio.com)
2. Get Account SID and Auth Token from console
3. Buy a phone number
4. Update `.env`:

```env
SMS_ENABLED=true
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=+1234567890
ADMIN_NOTIFICATION_PHONE=+919876543210
```

---

## Database Backup

### Automatic Backups

Create backup script:
```bash
#!/bin/bash
BACKUP_DIR=/var/backups/rbc-counselling
DB_PATH=/var/www/rbc-counselling/backend/database/rbc_counselling.db
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR
cp $DB_PATH $BACKUP_DIR/rbc_counselling_$DATE.db

# Keep only last 30 days
find $BACKUP_DIR -name "*.db" -mtime +30 -delete
```

Add to crontab:
```bash
sudo crontab -e
```

Add line:
```
0 2 * * * /var/www/rbc-counselling/backup.sh
```

### Manual Backup

```bash
cp backend/database/rbc_counselling.db backend/database/backup_$(date +%Y%m%d).db
```

---

## Monitoring

### PM2 Monitoring

```bash
# View logs
pm2 logs rbc-backend

# Monitor
pm2 monit

# Check status
pm2 status
```

### Nginx Logs

```bash
# Access logs
sudo tail -f /var/log/nginx/access.log

# Error logs
sudo tail -f /var/log/nginx/error.log
```

---

## Security Checklist

- [ ] Strong JWT_SECRET (32+ characters)
- [ ] Unique PHONE_ENCRYPTION_KEY
- [ ] HTTPS enabled (SSL certificate)
- [ ] COOKIE_SECURE=true in production
- [ ] Firewall configured (only ports 80, 443, 22)
- [ ] Regular database backups
- [ ] Email app passwords (not real passwords)
- [ ] Rate limiting enabled
- [ ] Regular security updates
- [ ] Environment variables not in git
- [ ] Strong admin passwords
- [ ] Admin phone numbers verified

---

## Troubleshooting

### Backend Won't Start

```bash
# Check logs
pm2 logs rbc-backend

# Common issues:
# - Port 5000 already in use: Change PORT in .env
# - Database locked: Restart backend
# - Missing .env: Copy from .env.example
```

### Database Issues

```bash
# Reset database (WARNING: Deletes all data)
cd backend
rm database/rbc_counselling.db
npm run migrate
```

### Email Not Sending

- Verify Gmail app password (not regular password)
- Check 2FA is enabled
- Test with curl:
```bash
curl http://localhost:5000/api/forms/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","phone":"+919876543210","email":"test@example.com","message":"Testing email"}'
```

### SSL Certificate Renewal

```bash
# Test renewal
sudo certbot renew --dry-run

# Actual renewal (automatic via cron)
sudo certbot renew
```

---

## Performance Optimization

### Enable Gzip in Nginx

Add to nginx config:
```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
gzip_min_length 1000;
```

### Database Optimization

```bash
# Vacuum database periodically
sqlite3 backend/database/rbc_counselling.db "VACUUM;"
```

### PM2 Cluster Mode

```bash
pm2 start src/index.js -i max --name rbc-backend
```

---

## Scaling

For high traffic:
1. Use PostgreSQL instead of SQLite
2. Add Redis for caching
3. Use CDN for static files
4. Load balancer with multiple backend instances
5. Separate database server

---

## Support

For deployment issues:
- Email: dev@rbccounselling.com
- GitHub Issues: [repository]/issues

---

**Deployment checklist complete! ✅**
