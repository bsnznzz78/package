# PowerPoint Processing Application - Deployment Guide

## Deployment Options

### Option 1: Local Development

#### Prerequisites
- Python 3.8+
- Node.js 16+
- pip and npm

#### Setup

1. **Clone Repository**
```bash
git clone <repository-url>
cd <repository-name>/app
```

2. **Install Backend Dependencies**
```bash
pip install -r ../requirements.txt
```

3. **Install Frontend Dependencies**
```bash
cd frontend
npm install
cd ..
```

4. **Run Development Servers**

Terminal 1 (Backend):
```bash
./run_backend.sh
# Or manually:
cd backend
python app.py
```

Terminal 2 (Frontend):
```bash
./run_frontend.sh
# Or manually:
cd frontend
npm run dev
```

5. **Access Application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

---

### Option 2: Production with Gunicorn

#### 1. Prepare Backend

```bash
cd app/backend

# Create virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r ../../requirements.txt

# Test with Gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:create_app
```

#### 2. Build Frontend

```bash
cd app/frontend

# Install dependencies
npm install

# Build for production
npm run build

# Output will be in dist/ directory
```

#### 3. Serve Frontend

Option A: Serve with Nginx (recommended)

```nginx
# /etc/nginx/sites-available/ppt-processor
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /path/to/app/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Increase upload size limit
    client_max_body_size 50M;
}
```

Option B: Serve with Python HTTP server

```bash
cd app/frontend/dist
python -m http.server 3000
```

#### 4. Process Management with Systemd

Create service file:

```ini
# /etc/systemd/system/ppt-processor-backend.service
[Unit]
Description=PowerPoint Processor Backend
After=network.target

[Service]
Type=notify
User=www-data
Group=www-data
WorkingDirectory=/path/to/app/backend
Environment="PATH=/path/to/venv/bin"
ExecStart=/path/to/venv/bin/gunicorn -w 4 -b 127.0.0.1:5000 app:create_app
ExecReload=/bin/kill -s HUP $MAINPID
KillMode=mixed
TimeoutStopSec=5
PrivateTmp=true

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl enable ppt-processor-backend
sudo systemctl start ppt-processor-backend
sudo systemctl status ppt-processor-backend
```

---

### Option 3: Docker Deployment

#### 1. Create Dockerfile for Backend

```dockerfile
# app/backend/Dockerfile
FROM python:3.9-slim

WORKDIR /app

# Install dependencies
COPY ../../requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Create directories
RUN mkdir -p uploads outputs

# Expose port
EXPOSE 5000

# Run with Gunicorn
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app:create_app()"]
```

#### 2. Create Dockerfile for Frontend

```dockerfile
# app/frontend/Dockerfile
FROM node:16-alpine as build

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Build
COPY . .
RUN npm run build

# Serve with nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### 3. Create docker-compose.yml

```yaml
# app/docker-compose.yml
version: '3.8'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "5000:5000"
    volumes:
      - ./backend/uploads:/app/uploads
      - ./backend/outputs:/app/outputs
    environment:
      - FLASK_ENV=production
    restart: unless-stopped

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped
```

#### 4. Deploy with Docker

```bash
cd app

# Build and start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

---

### Option 4: Cloud Platform Deployment

#### AWS Elastic Beanstalk

1. **Prepare application**
```bash
cd app/backend

# Create requirements.txt at root
# Create .ebextensions directory for configuration
mkdir .ebextensions
```

2. **Create .ebextensions/01_flask.config**
```yaml
option_settings:
  aws:elasticbeanstalk:container:python:
    WSGIPath: app:create_app()
  aws:elasticbeanstalk:environment:proxy:staticfiles:
    /static: static
```

3. **Deploy**
```bash
eb init -p python-3.9 ppt-processor
eb create ppt-processor-env
eb deploy
```

#### Heroku

1. **Create Procfile**
```
web: gunicorn -w 4 app.backend.app:create_app()
```

2. **Deploy**
```bash
heroku create ppt-processor-app
git push heroku main
heroku open
```

#### Google Cloud Platform (App Engine)

1. **Create app.yaml**
```yaml
runtime: python39
entrypoint: gunicorn -b :$PORT app.backend.app:create_app()

instance_class: F2

automatic_scaling:
  max_instances: 10
  min_instances: 1
```

2. **Deploy**
```bash
gcloud app deploy
gcloud app browse
```

---

## Environment Configuration

### Backend Environment Variables

Create `.env` file in `app/backend/`:

```env
# Flask Configuration
FLASK_APP=app:create_app
FLASK_ENV=production
SECRET_KEY=your-secret-key-here

# File Upload
MAX_FILE_SIZE=52428800
UPLOAD_FOLDER=./uploads
OUTPUT_FOLDER=./outputs

# Processing
MAX_SLIDES=200
PROCESSING_TIMEOUT=300

# Cleanup
FILE_RETENTION_HOURS=24
CLEANUP_INTERVAL_HOURS=6

# CORS
CORS_ORIGINS=http://localhost:3000,https://yourdomain.com

# Logging
LOG_LEVEL=INFO
LOG_FILE=./logs/app.log
```

### Frontend Environment Variables

Create `.env` in `app/frontend/`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_MAX_FILE_SIZE=52428800
```

For production:
```env
VITE_API_URL=https://api.yourdomain.com/api
VITE_MAX_FILE_SIZE=52428800
```

---

## Security Configuration

### 1. HTTPS Setup with Let's Encrypt

```bash
# Install certbot
sudo apt-get install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d yourdomain.com

# Auto-renewal
sudo certbot renew --dry-run
```

### 2. Firewall Configuration

```bash
# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Backend (only from localhost)
# Already restricted by binding to 127.0.0.1
```

### 3. Rate Limiting (Nginx)

Add to nginx configuration:
```nginx
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

location /api/ {
    limit_req zone=api burst=20;
    # ... rest of config
}
```

---

## Monitoring & Maintenance

### 1. Application Logs

**Backend logs:**
```bash
# With systemd
sudo journalctl -u ppt-processor-backend -f

# Direct logs
tail -f app/backend/logs/app.log
```

**Nginx logs:**
```bash
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### 2. Health Checks

```bash
# Backend health
curl http://localhost:5000/api/health

# Full stack health
curl http://yourdomain.com/api/health
```

### 3. File Cleanup

Schedule automatic cleanup:
```bash
# Create cron job
crontab -e

# Add line (cleanup every 6 hours)
0 */6 * * * curl -X POST http://localhost:5000/api/cleanup
```

### 4. Backup Strategy

```bash
#!/bin/bash
# backup.sh - Backup outputs directory

BACKUP_DIR="/backups/ppt-processor"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR
tar -czf $BACKUP_DIR/outputs_$DATE.tar.gz app/backend/outputs/

# Keep only last 7 days of backups
find $BACKUP_DIR -name "outputs_*.tar.gz" -mtime +7 -delete
```

---

## Performance Tuning

### 1. Gunicorn Workers

Calculate optimal workers:
```python
# workers = (2 × CPU cores) + 1
import multiprocessing
workers = (2 * multiprocessing.cpu_count()) + 1
```

```bash
gunicorn -w $workers -b 0.0.0.0:5000 app:create_app()
```

### 2. Nginx Optimization

```nginx
# Increase worker connections
events {
    worker_connections 4096;
}

# Enable gzip compression
gzip on;
gzip_types text/plain text/css application/json application/javascript;

# Cache static files
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 3. Python Optimization

```bash
# Use faster JSON library
pip install ujson

# Use faster WSGI server
pip install gunicorn[gevent]
gunicorn -w 4 -k gevent app:create_app()
```

---

## Troubleshooting

### Common Issues

**1. Backend won't start**
```bash
# Check Python version
python --version

# Check port availability
lsof -i :5000

# Check permissions
ls -la app/backend/uploads
ls -la app/backend/outputs
```

**2. Upload fails**
```bash
# Check upload size limits
# Nginx: client_max_body_size
# Flask: MAX_CONTENT_LENGTH

# Check disk space
df -h
```

**3. Processing timeout**
```bash
# Increase timeouts
# Nginx: proxy_read_timeout
# Gunicorn: --timeout

# Check system resources
top
free -h
```

---

## Rollback Procedure

### 1. Code Rollback

```bash
# Git rollback
git log --oneline
git checkout <previous-commit-hash>

# Rebuild and restart
docker-compose down
docker-compose up -d --build
```

### 2. Database Rollback

(If database added in future)
```bash
# Restore from backup
psql database < backup.sql
```

---

## Checklist Before Going Live

- [ ] All dependencies installed
- [ ] Environment variables configured
- [ ] HTTPS certificate installed
- [ ] Firewall rules configured
- [ ] Rate limiting enabled
- [ ] Logging configured
- [ ] Monitoring set up
- [ ] Backup strategy implemented
- [ ] Health checks working
- [ ] Error handling tested
- [ ] Load testing completed
- [ ] Security audit done
- [ ] Documentation updated
- [ ] Team trained

---

## Support & Resources

- **Documentation**: `/app/README.md`
- **Features**: `/app/FEATURES.md`
- **API Reference**: `http://localhost:5000/` (root endpoint)
- **Logs**: `app/backend/logs/`
- **Issues**: GitHub Issues (if applicable)

---

**Last Updated**: 2024
**Version**: 1.0.0
