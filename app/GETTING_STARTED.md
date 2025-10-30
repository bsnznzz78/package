# Getting Started with PowerPoint Processor

Welcome! This guide will help you get the PowerPoint Processing Application up and running quickly.

## Prerequisites Check

Before you begin, ensure you have:
- ✅ Python 3.8 or higher
- ✅ Node.js 16 or higher
- ✅ npm (comes with Node.js)
- ✅ pip (comes with Python)

### Verify Your Environment

Run the verification script:
```bash
cd app
./verify_setup.sh
```

This will check all prerequisites and show you the directory structure.

## Installation

### Step 1: Install Backend Dependencies

```bash
# From the project root
pip install -r requirements.txt
```

This installs:
- Flask (web framework)
- python-pptx (PowerPoint processing)
- Flask-CORS (API CORS support)
- Pillow (image processing)
- Gunicorn (production server)

**Expected output:**
```
Successfully installed Flask-3.0.0 python-pptx-0.6.23 ...
```

### Step 2: Install Frontend Dependencies

```bash
cd app/frontend
npm install
```

This installs:
- React (UI framework)
- Vite (build tool)
- Axios (HTTP client)

**Expected output:**
```
added 200 packages, and audited 201 packages in 15s
```

## Running the Application

You have two options to run the application:

### Option A: Using the Run Scripts (Recommended)

**Terminal 1 - Backend:**
```bash
cd app
./run_backend.sh
```

You should see:
```
Starting PowerPoint Processing Backend...
Backend will run on http://localhost:5000

* Running on http://0.0.0.0:5000
```

**Terminal 2 - Frontend:**
```bash
cd app
./run_frontend.sh
```

You should see:
```
Starting PowerPoint Processing Frontend...
Frontend will run on http://localhost:3000

VITE v5.0.0  ready in 1234 ms
➜  Local:   http://localhost:3000/
```

### Option B: Manual Start

**Backend:**
```bash
cd app/backend
python app.py
```

**Frontend:**
```bash
cd app/frontend
npm run dev
```

## Access the Application

Once both servers are running:

1. **Open your browser** and navigate to: `http://localhost:3000`
2. You should see the PowerPoint Processor interface
3. The backend API is available at: `http://localhost:5000`

## First Time Usage

### Step 1: Create a Test Presentation

We've included a script to create a sample PowerPoint:

```bash
cd app
python create_sample_ppt.py
```

This creates `sample_presentation.pptx` with test slides.

### Step 2: Upload and Process

1. **Upload**: 
   - Click the upload area or drag-and-drop `sample_presentation.pptx`
   - Wait for validation (should take 1-2 seconds)

2. **Process**:
   - Click "Process Presentation" button
   - Watch the progress bar (typically 15-30 seconds for sample)

3. **Download**:
   - Click "Download Enhanced Presentation"
   - Open the file in PowerPoint to see the changes

### What Changes Were Made?

The enhanced presentation will have:
- ✅ Standardized fonts (Frutiger LT or Calibri)
- ✅ Consistent color scheme (blue primary, orange accent)
- ✅ Proper text sizing (titles 44pt, body 18pt)
- ✅ Aligned text (titles centered, body left-aligned)
- ✅ Clean backgrounds

## Testing the API Directly

### Health Check

```bash
curl http://localhost:5000/api/health
```

Response:
```json
{
  "status": "healthy",
  "service": "PowerPoint Processing API"
}
```

### Upload File

```bash
curl -X POST \
  -F "file=@sample_presentation.pptx" \
  http://localhost:5000/api/upload
```

Response:
```json
{
  "success": true,
  "file_id": "abc123_sample_presentation.pptx",
  "info": {
    "slide_count": 3
  }
}
```

### Process File

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"file_id": "abc123_sample_presentation.pptx"}' \
  http://localhost:5000/api/process
```

### Download File

```bash
curl -O http://localhost:5000/api/download/enhanced_presentation_20240101_120000.pptx
```

## Common Issues and Solutions

### Issue: "Module not found" error

**Solution:**
```bash
# Make sure you're in the project root
pip install -r requirements.txt
```

### Issue: "Port 5000 already in use"

**Solution:**
```bash
# Find and kill the process
lsof -i :5000
kill -9 <PID>

# Or use a different port
cd app/backend
python app.py  # Edit app.py to change port if needed
```

### Issue: "Port 3000 already in use"

**Solution:**
```bash
# Vite will automatically suggest port 3001
# Or kill the process
lsof -i :3000
kill -9 <PID>
```

### Issue: Frontend can't connect to backend

**Solution:**
1. Verify backend is running on port 5000
2. Check console for CORS errors
3. Ensure `.env` file has correct API URL

### Issue: Upload fails with "File too large"

**Solution:**
- Maximum file size is 50MB
- Compress your PowerPoint file
- Remove large embedded media

### Issue: Processing takes too long

**Causes:**
- Large file (>100 slides)
- Complex graphics or charts
- Limited system resources

**Solution:**
- Wait patiently (up to 2 minutes is normal)
- Try with a smaller presentation first
- Check system resources (CPU, RAM)

## Understanding the Interface

### Upload Screen
- **Drag & Drop Zone**: Blue-highlighted area for file drop
- **File Info**: Shows name and size after selection
- **Clear Button**: Red X to remove selected file

### Processing Screen
- **Progress Bar**: Shows upload/processing progress
- **Status Messages**: Indicates current operation

### Results Screen
- **Success Icon**: Green checkmark
- **Presentation Details**: Slide count and status
- **Download Button**: Blue button to download enhanced file
- **Process Another**: Gray button to start over

## Next Steps

### Customize Branding

Edit `app/config/branding_config.json` to change:

```json
{
  "fonts": {
    "primary": "Your Font Name",
    "title_size": 44
  },
  "colors": {
    "primary": [0, 102, 204]
  }
}
```

### Add Your Logo

1. Place logo file in `app/config/logo.png`
2. Update `branding_config.json`:
```json
{
  "logo": {
    "enabled": true,
    "path": "../config/logo.png"
  }
}
```

### Process Your Own Presentations

1. Prepare your PowerPoint (.pptx format)
2. Ensure file is under 50MB
3. Remove password protection if any
4. Upload and process

## Learning More

- **Full Documentation**: See `README.md`
- **Features List**: See `FEATURES.md`
- **Deployment Guide**: See `DEPLOYMENT.md`
- **API Reference**: Visit `http://localhost:5000` when backend is running

## Development Tips

### Hot Reload

Both frontend and backend support hot reload:
- **Frontend**: Changes to .jsx/.css files reload automatically
- **Backend**: Restart server to see Python changes

### Debugging

**Backend logs:**
```bash
# Logs appear in terminal where backend is running
# Or check:
tail -f app/backend/logs/app.log
```

**Frontend logs:**
```bash
# Open browser console (F12)
# Check Console and Network tabs
```

### Testing Your Changes

```bash
# Run backend tests
cd app/tests
python -m unittest test_ppt_parser.py
python -m unittest test_branding_engine.py

# Test API endpoints
curl http://localhost:5000/api/health
```

## Getting Help

If you encounter issues:

1. **Check the logs** in terminal output
2. **Verify setup** with `./verify_setup.sh`
3. **Review documentation** in `/app/README.md`
4. **Check requirements** are installed
5. **Restart services** (stop and start again)

## Quick Command Reference

```bash
# Setup
pip install -r requirements.txt
cd app/frontend && npm install

# Run (separate terminals)
cd app/backend && python app.py
cd app/frontend && npm run dev

# Test
cd app/tests && python -m unittest test_*.py
curl http://localhost:5000/api/health

# Clean up
# Stop servers: Ctrl+C in each terminal
# Remove uploaded files: rm app/backend/uploads/*
# Remove output files: rm app/backend/outputs/*
```

## Success Checklist

- [ ] Python and Node.js installed
- [ ] Dependencies installed (pip and npm)
- [ ] Backend server running on port 5000
- [ ] Frontend server running on port 3000
- [ ] Can access http://localhost:3000
- [ ] Sample presentation created
- [ ] Successfully uploaded and processed a file
- [ ] Downloaded enhanced presentation
- [ ] Opened result in PowerPoint

## Congratulations! 🎉

You've successfully set up and used the PowerPoint Processing Application!

Try processing your own presentations and explore the customization options.

---

**Need more help?** Review the comprehensive documentation in `/app/README.md` or check the features list in `/app/FEATURES.md`.
