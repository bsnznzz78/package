# Project Overview

This repository contains two main components:

## 1. RBC Counselling Consultancy Website (Root Level)

A static website for college admissions counselling services.

**Location:** Root directory (`/`)
**Tech Stack:** HTML5, CSS3, Vanilla JavaScript
**Files:**
- `index.html`, `about.html`, `services.html`, `colleges.html`, `contact.html`
- `/css/` and `/js/` directories
- `README.md` (original website documentation)

**Purpose:** Marketing website for counselling consultancy services

---

## 2. PowerPoint Processing Application (NEW)

A full-stack web application that processes and enhances PowerPoint presentations with automated branding and formatting.

**Location:** `/app` directory
**Tech Stack:** 
- **Backend:** Flask + python-pptx
- **Frontend:** React + Vite

### Quick Start

```bash
# 1. Install dependencies
pip install -r requirements.txt
cd app/frontend && npm install && cd ../..

# 2. Start backend (Terminal 1)
cd app/backend
python app.py

# 3. Start frontend (Terminal 2)
cd app/frontend
npm run dev

# 4. Access application
# Frontend: http://localhost:3000
# Backend:  http://localhost:5000
```

### Key Features

1. **Upload PowerPoint files** (.pptx, up to 50MB)
2. **Automatic processing** with branding rules
3. **Enhanced output** with consistent formatting
4. **Download results** in PowerPoint format

### Documentation

| Document | Description |
|----------|-------------|
| **[GETTING_STARTED.md](app/GETTING_STARTED.md)** | Step-by-step setup guide ⭐ START HERE |
| **[README.md](app/README.md)** | Complete technical documentation |
| **[FEATURES.md](app/FEATURES.md)** | Detailed feature specifications |
| **[DEPLOYMENT.md](app/DEPLOYMENT.md)** | Production deployment guide |
| **[PPT_APP_README.md](PPT_APP_README.md)** | Quick reference guide |

### Directory Structure

```
/app
├── backend/                 # Flask API server
│   ├── api/                # REST endpoints
│   ├── processors/         # Core processing logic
│   │   ├── ppt_parser.py
│   │   ├── data_extractor.py
│   │   ├── branding_engine.py
│   │   └── output_generator.py
│   ├── utils/              # File handling utilities
│   ├── uploads/            # Temporary uploads
│   ├── outputs/            # Processed files
│   └── app.py             # Main Flask app
│
├── frontend/               # React application
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── services/      # API integration
│   │   ├── App.jsx        # Main app
│   │   └── main.jsx       # Entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── config/                # Configuration files
│   └── branding_config.json
│
├── tests/                 # Unit tests
│   ├── test_ppt_parser.py
│   └── test_branding_engine.py
│
├── run_backend.sh         # Backend startup script
├── run_frontend.sh        # Frontend startup script
├── verify_setup.sh        # Setup verification
└── create_sample_ppt.py   # Sample file generator
```

### Architecture

```
┌─────────────────────────────────────────────────┐
│                   Frontend                      │
│          React SPA (localhost:3000)             │
│  ┌────────────┐  ┌────────────┐  ┌──────────┐ │
│  │ FileUpload │  │ ProgressBar│  │  Result  │ │
│  └────────────┘  └────────────┘  └──────────┘ │
│                      │                          │
│                   Axios API                     │
└───────────────────────┼─────────────────────────┘
                        │
                   HTTP/JSON
                        │
┌───────────────────────▼─────────────────────────┐
│                  Backend API                    │
│          Flask REST API (localhost:5000)        │
│  ┌────────────────────────────────────────┐    │
│  │            API Routes                   │    │
│  │  /upload  /process  /download  /health │    │
│  └──────────────────┬──────────────────────┘    │
│                     │                            │
│  ┌──────────────────▼──────────────────────┐   │
│  │         Processing Pipeline             │   │
│  │                                          │   │
│  │  PPTParser → DataExtractor              │   │
│  │       ↓                                  │   │
│  │  BrandingEngine → OutputGenerator       │   │
│  └──────────────────────────────────────────┘   │
│                                                  │
│  ┌──────────────────────────────────────────┐   │
│  │          File Management                 │   │
│  │  uploads/  →  outputs/                   │   │
│  └──────────────────────────────────────────┘   │
└──────────────────────────────────────────────────┘
```

### Processing Flow

```
1. Upload File
   ↓
2. Validate Format & Size
   ↓
3. Parse PowerPoint Structure
   ↓
4. Extract Content & Metadata
   ↓
5. Apply Branding Rules
   │
   ├─ Font Standardization
   ├─ Color Scheme
   ├─ Text Sizing
   ├─ Alignment & Spacing
   └─ Background Formatting
   ↓
6. Generate Enhanced Presentation
   ↓
7. Validate Output
   ↓
8. Deliver Download Link
```

### Branding Configuration

Default branding settings in `app/config/branding_config.json`:

- **Font:** Frutiger LT (with Calibri/Arial fallbacks)
- **Title Size:** 44pt
- **Body Size:** 18pt
- **Primary Color:** Blue (#0066cc)
- **Accent Color:** Orange (#ff6b35)
- **Alignment:** Titles centered, body left-aligned

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/upload` | Upload PowerPoint file |
| POST | `/api/process` | Process uploaded file |
| GET | `/api/download/<id>` | Download enhanced file |
| POST | `/api/extract` | Extract data from file |
| GET | `/api/files` | List all files |
| POST | `/api/cleanup` | Clean up old files |

### Development Workflow

1. **Make changes** to backend (Python) or frontend (React)
2. **Test locally** at http://localhost:3000
3. **Run tests** in `app/tests/`
4. **Review changes** in processed PowerPoint files
5. **Commit** to your branch

### Testing

```bash
# Run backend unit tests
cd app/tests
python -m unittest test_ppt_parser.py
python -m unittest test_branding_engine.py

# Test API endpoints
curl http://localhost:5000/api/health

# Create and process sample file
cd app
python create_sample_ppt.py
# Then upload sample_presentation.pptx via UI
```

### Requirements

**Backend (Python):**
- Flask 3.0.0
- python-pptx 0.6.23
- Flask-CORS 4.0.0
- Pillow 10.1.0
- Werkzeug 3.0.1
- Gunicorn 21.2.0

**Frontend (Node):**
- React 18.2.0
- Vite 5.0.0
- Axios 1.6.0

### Performance

- **Processing Time:** 30-90 seconds (typical)
- **Max File Size:** 50MB
- **Max Slides:** 200 (recommended)
- **Concurrent Users:** 4 workers (default)

### Security

- ✅ File type validation
- ✅ Size limit enforcement
- ✅ Secure filename handling (UUID)
- ✅ CORS configuration
- ✅ Automatic file cleanup (24h)
- ✅ No credential storage

### Future Enhancements

- [ ] Preview before processing
- [ ] Batch processing
- [ ] User authentication
- [ ] Custom branding templates
- [ ] Cloud storage integration
- [ ] Processing history
- [ ] Manual editing interface

---

## Getting Started

### For the PowerPoint Application:

**⭐ Start Here:** Read [app/GETTING_STARTED.md](app/GETTING_STARTED.md)

Then follow these steps:

1. **Verify setup:**
   ```bash
   cd app
   ./verify_setup.sh
   ```

2. **Install dependencies:**
   ```bash
   pip install -r ../requirements.txt
   cd frontend && npm install && cd ..
   ```

3. **Start servers:**
   ```bash
   # Terminal 1
   ./run_backend.sh
   
   # Terminal 2
   ./run_frontend.sh
   ```

4. **Access app:**
   Open http://localhost:3000 in your browser

5. **Process your first file:**
   - Create sample: `python create_sample_ppt.py`
   - Upload via web interface
   - Download enhanced result

### For the Static Website:

Simply open `index.html` in a web browser, or use a local server:

```bash
python -m http.server 8000
# Visit http://localhost:8000
```

---

## Project Status

### PowerPoint Processing Application
- ✅ **Complete** - Fully functional
- ✅ Backend API implemented
- ✅ Frontend UI implemented
- ✅ Core processing engine working
- ✅ File upload/download working
- ✅ Branding engine functional
- ✅ Documentation complete
- ✅ Tests included

### Static Website
- ✅ **Complete** - Production ready
- ✅ All pages implemented
- ✅ Fully responsive
- ✅ Interactive features working

---

## Support & Documentation

- **Quick Start:** [app/GETTING_STARTED.md](app/GETTING_STARTED.md)
- **Full Documentation:** [app/README.md](app/README.md)
- **Features:** [app/FEATURES.md](app/FEATURES.md)
- **Deployment:** [app/DEPLOYMENT.md](app/DEPLOYMENT.md)
- **Website Docs:** [README.md](README.md)

---

## License

© 2024. All rights reserved.

---

**Questions?** Review the documentation in the `/app` directory for detailed information about the PowerPoint Processing Application.
