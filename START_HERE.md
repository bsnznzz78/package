# 🚀 Welcome to the PowerPoint Processing Application

## What's New?

This repository now includes a **complete PowerPoint Processing Web Application** that automatically enhances PowerPoint presentations with consistent branding and formatting!

## 📁 Repository Contents

### 1. PowerPoint Processing Application (NEW) - `/app` directory
A full-stack web application for processing PowerPoint presentations.

### 2. RBC Counselling Website - Root directory
The existing static website (HTML/CSS/JS).

---

## ⚡ Quick Start (PowerPoint App)

### Step 1: Install Dependencies

```bash
# Install Python dependencies
pip install -r requirements.txt

# Install Node.js dependencies
cd app/frontend
npm install
cd ../..
```

### Step 2: Start the Application

**Terminal 1 (Backend):**
```bash
cd app
./run_backend.sh
```

**Terminal 2 (Frontend):**
```bash
cd app
./run_frontend.sh
```

### Step 3: Use the Application

1. Open your browser to: **http://localhost:3000**
2. Upload a PowerPoint file (.pptx)
3. Click "Process Presentation"
4. Download your enhanced presentation!

---

## 📖 Complete Documentation

### For New Users
🌟 **[app/GETTING_STARTED.md](app/GETTING_STARTED.md)** - Comprehensive setup guide with screenshots and troubleshooting

### For Developers
📚 **[app/README.md](app/README.md)** - Full technical documentation
📋 **[app/FEATURES.md](app/FEATURES.md)** - Detailed feature specifications
🚢 **[app/DEPLOYMENT.md](app/DEPLOYMENT.md)** - Production deployment guide
✅ **[app/CHECKLIST.md](app/CHECKLIST.md)** - Implementation checklist

### Quick Reference
📘 **[PPT_APP_README.md](PPT_APP_README.md)** - Quick reference guide
📊 **[PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md)** - Project architecture overview

---

## 🎯 What Does It Do?

The PowerPoint Processing Application:

✨ **Automatically enhances presentations** with:
- Consistent font styling (Frutiger LT)
- Professional color scheme
- Proper text sizing and alignment
- Clean formatting

💼 **Perfect for**:
- Corporate presentations
- Educational materials
- Training decks
- Marketing presentations

⚡ **Fast & Easy**:
- Upload → Process → Download
- 30-90 seconds typical processing time
- Handles up to 200 slides

---

## 🏗️ Architecture Overview

```
┌─────────────────────────┐
│   React Frontend        │
│   (localhost:3000)      │
└───────────┬─────────────┘
            │
         HTTP/JSON
            │
┌───────────▼─────────────┐
│   Flask Backend API     │
│   (localhost:5000)      │
│                         │
│   ┌─────────────────┐   │
│   │ PPT Processor   │   │
│   │                 │   │
│   │ • Parse         │   │
│   │ • Extract       │   │
│   │ • Brand         │   │
│   │ • Generate      │   │
│   └─────────────────┘   │
└─────────────────────────┘
```

---

## 🛠️ Tech Stack

**Backend:**
- Flask (Python web framework)
- python-pptx (PowerPoint processing)
- Werkzeug (file handling)

**Frontend:**
- React 18 (UI framework)
- Vite (build tool)
- Axios (API client)

---

## ✅ Verify Your Setup

Run the verification script:

```bash
cd app
./verify_setup.sh
```

This checks:
- ✓ Python installation
- ✓ Node.js installation
- ✓ Directory structure
- ✓ Required files

---

## 🎓 Learn by Doing

### Create a Sample Presentation

```bash
cd app
python create_sample_ppt.py
```

This creates `sample_presentation.pptx` with test slides.

### Process It

1. Start the application (see Quick Start above)
2. Upload `sample_presentation.pptx`
3. Click "Process Presentation"
4. Download and open the enhanced version

### Compare the Results

Open both files in PowerPoint side-by-side to see:
- Standardized fonts
- Consistent colors
- Professional spacing
- Clean alignment

---

## 🎨 Customize Branding

Edit `app/config/branding_config.json` to customize:

```json
{
  "fonts": {
    "primary": "Your Font Name",
    "title_size": 44,
    "body_size": 18
  },
  "colors": {
    "primary": [0, 102, 204],
    "accent": [255, 107, 53]
  }
}
```

---

## 🧪 Test the API

### Health Check
```bash
curl http://localhost:5000/api/health
```

### Upload File
```bash
curl -X POST -F "file=@presentation.pptx" \
  http://localhost:5000/api/upload
```

### Process File
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"file_id": "your-file-id"}' \
  http://localhost:5000/api/process
```

---

## 🐛 Troubleshooting

### Backend Won't Start
```bash
# Check Python version (need 3.8+)
python3 --version

# Reinstall dependencies
pip install -r requirements.txt
```

### Frontend Won't Start
```bash
# Check Node version (need 16+)
node --version

# Reinstall dependencies
cd app/frontend
rm -rf node_modules package-lock.json
npm install
```

### Can't Upload Files
- Check file is .pptx format
- Ensure file is under 50MB
- Verify backend is running on port 5000

---

## 📊 Project Statistics

- **32+ files created**
- **9 Python modules**
- **6 React components**
- **7 API endpoints**
- **4 run scripts**
- **6 documentation files**

---

## 🚀 Deployment

For production deployment:

1. Build frontend: `cd app/frontend && npm run build`
2. Run with Gunicorn: `gunicorn -w 4 -b 0.0.0.0:5000 'app.backend.app:create_app()'`
3. Serve frontend with Nginx or similar
4. See [app/DEPLOYMENT.md](app/DEPLOYMENT.md) for detailed instructions

---

## 🔒 Security Features

- ✅ File type validation
- ✅ Size limit enforcement (50MB)
- ✅ Secure filename handling
- ✅ CORS configuration
- ✅ Automatic file cleanup (24 hours)

---

## 📈 Performance

- **Processing Time**: 30-90 seconds (typical)
- **Max File Size**: 50MB
- **Max Slides**: 200 (recommended)
- **Concurrent Users**: 4 workers (configurable)

---

## 🎯 Next Steps

1. **Read the Getting Started Guide**: [app/GETTING_STARTED.md](app/GETTING_STARTED.md)
2. **Install dependencies** (see Quick Start above)
3. **Run the application**
4. **Create sample presentation** with `create_sample_ppt.py`
5. **Process your first file**
6. **Explore the code** and documentation
7. **Customize branding** to match your needs

---

## 📞 Need Help?

1. **Setup Issues**: See [app/GETTING_STARTED.md](app/GETTING_STARTED.md) troubleshooting section
2. **Feature Questions**: See [app/FEATURES.md](app/FEATURES.md)
3. **Deployment Help**: See [app/DEPLOYMENT.md](app/DEPLOYMENT.md)
4. **Architecture Questions**: See [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md)

---

## 🎉 Ready to Start?

```bash
# 1. Install
pip install -r requirements.txt
cd app/frontend && npm install && cd ../..

# 2. Verify
cd app && ./verify_setup.sh

# 3. Run Backend (Terminal 1)
cd app && ./run_backend.sh

# 4. Run Frontend (Terminal 2)
cd app && ./run_frontend.sh

# 5. Open Browser
# http://localhost:3000

# 6. Have fun! 🚀
```

---

## 📝 Documentation Map

```
START_HERE.md (this file)
│
├── Quick Start
├── Troubleshooting
└── Next Steps
    │
    ├── app/GETTING_STARTED.md
    │   └── Step-by-step setup
    │
    ├── app/README.md
    │   └── Technical documentation
    │
    ├── app/FEATURES.md
    │   └── Feature specifications
    │
    ├── app/DEPLOYMENT.md
    │   └── Production deployment
    │
    ├── PROJECT_OVERVIEW.md
    │   └── Architecture overview
    │
    └── PPT_APP_README.md
        └── Quick reference
```

---

**Happy Processing! 🎨✨**

**Version**: 1.0.0
**Last Updated**: 2024

