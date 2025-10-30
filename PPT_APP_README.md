# PowerPoint Processing Application

## Overview

This repository now contains a **PowerPoint Processing Web Application** that processes instructional PowerPoint presentations and generates enhanced, branded output presentations.

The application is located in the `/app` directory and consists of a Flask backend and React frontend.

## Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- pip and npm

### Installation

1. **Install Backend Dependencies:**
```bash
pip install -r requirements.txt
```

2. **Install Frontend Dependencies:**
```bash
cd app/frontend
npm install
```

### Running the Application

#### Option 1: Using Run Scripts (Recommended)

**Terminal 1 - Start Backend:**
```bash
cd app
./run_backend.sh
```

**Terminal 2 - Start Frontend:**
```bash
cd app
./run_frontend.sh
```

#### Option 2: Manual Start

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

### Access the Application

- **Frontend UI**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Documentation**: http://localhost:5000 (root endpoint)

## Features

### 1. File Upload
- Drag-and-drop interface
- Support for .pptx files up to 50MB
- Client-side validation

### 2. Processing Engine
- **Text Extraction**: Extract all text from slides
- **Branding Application**: Apply consistent fonts, colors, and styling
- **Layout Preservation**: Maintain original slide structures
- **Visual Enhancement**: Standardize icons, charts, and graphics

### 3. Output Generation
- Generate enhanced PowerPoint presentation
- Preserve all content and media
- Download processed file

### 4. User Interface
- Modern, responsive design
- Real-time progress indicators
- Error handling and validation
- Mobile-friendly

## Architecture

### Backend (Flask)
```
/app/backend
├── api/                  # REST API endpoints
├── processors/           # Core processing logic
│   ├── ppt_parser.py    # Parse PowerPoint files
│   ├── data_extractor.py # Extract content and metadata
│   ├── branding_engine.py # Apply branding rules
│   └── output_generator.py # Generate enhanced output
├── utils/               # Utility functions
└── app.py              # Flask application entry point
```

### Frontend (React + Vite)
```
/app/frontend
├── src/
│   ├── components/      # React components
│   ├── services/        # API integration
│   ├── App.jsx         # Main application
│   └── main.jsx        # Entry point
├── index.html
└── package.json
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/upload` | Upload PowerPoint file |
| POST | `/api/process` | Process uploaded file |
| POST | `/api/extract` | Extract data from file |
| GET | `/api/download/<file_id>` | Download processed file |
| GET | `/api/files` | List all files |
| POST | `/api/cleanup` | Clean up old files |

## Configuration

### Branding Settings

Edit `/app/config/branding_config.json` to customize:

```json
{
  "fonts": {
    "primary": "Frutiger LT",
    "title_size": 44,
    "body_size": 18
  },
  "colors": {
    "primary": [0, 102, 204],
    "accent": [255, 107, 53]
  }
}
```

### Environment Variables

Create a `.env` file in the backend directory:

```env
FLASK_APP=app:create_app
FLASK_ENV=development
MAX_FILE_SIZE=52428800
UPLOAD_FOLDER=./uploads
OUTPUT_FOLDER=./outputs
```

## Usage Guide

1. **Upload File**
   - Click the upload area or drag-and-drop a .pptx file
   - Wait for validation to complete

2. **Process**
   - Click "Process Presentation"
   - Monitor the progress bar
   - Processing typically takes 30-90 seconds

3. **Download**
   - Click "Download Enhanced Presentation"
   - Open the file in PowerPoint to view changes

## Processing Details

### What Gets Enhanced:
- ✅ Font standardization (Frutiger LT with fallbacks)
- ✅ Color scheme consistency
- ✅ Text sizing and weights
- ✅ Alignment and spacing
- ✅ Background colors

### What Gets Preserved:
- ✅ Original content and text
- ✅ Slide order and structure
- ✅ Images and graphics
- ✅ Charts and tables
- ✅ Notes and comments

## Testing

Run unit tests:
```bash
cd app/tests
python -m unittest test_ppt_parser.py
python -m unittest test_branding_engine.py
```

## Troubleshooting

### Backend Won't Start
```bash
# Check Python version
python --version  # Should be 3.8+

# Reinstall dependencies
pip install -r requirements.txt

# Check port availability
lsof -i :5000
```

### Frontend Won't Start
```bash
# Check Node version
node --version  # Should be 16+

# Clear and reinstall
cd app/frontend
rm -rf node_modules package-lock.json
npm install
```

### Processing Fails
- Ensure file is valid .pptx format
- Check file is not password-protected
- Verify file size is under 50MB
- Check backend logs for errors

## Performance

- **Average Processing Time**: 30-90 seconds
- **Maximum File Size**: 50MB
- **Maximum Slides**: 200 (recommended)
- **Concurrent Users**: 4 (with default Gunicorn config)

## Security

- File type validation
- Size limit enforcement
- Secure filename handling
- CORS configuration
- Automatic file cleanup (24-hour retention)

## Development

### Adding New Branding Rules

1. Edit `app/backend/processors/branding_engine.py`
2. Update `BRAND_CONFIG` dictionary
3. Modify `apply_branding_to_shape()` method

### Adding New API Endpoints

1. Add route in `app/backend/api/routes.py`
2. Update frontend service in `app/frontend/src/services/api.js`
3. Use in React components

### Modifying UI

1. Edit components in `app/frontend/src/components/`
2. Update styles in `app/frontend/src/App.css`
3. Hot reload will reflect changes automatically

## Deployment

### Production Build

**Frontend:**
```bash
cd app/frontend
npm run build
```

**Backend with Gunicorn:**
```bash
cd app/backend
gunicorn -w 4 -b 0.0.0.0:5000 'app:create_app()'
```

### Docker (Optional)

Create `Dockerfile` in `/app`:
```dockerfile
FROM python:3.9
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY app/backend ./backend
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "backend.app:create_app()"]
```

## Future Enhancements

- [ ] Batch processing multiple files
- [ ] User authentication and accounts
- [ ] Processing history and analytics
- [ ] Custom branding templates per user
- [ ] Preview before processing
- [ ] Cloud storage integration (S3, Google Drive)
- [ ] Real-time collaboration
- [ ] Advanced editing interface

## Tech Stack

**Backend:**
- Flask 3.0
- python-pptx 0.6.23
- Werkzeug 3.0
- Flask-CORS 4.0

**Frontend:**
- React 18.2
- Vite 5.0
- Axios 1.6
- Modern CSS

## License

© 2024 PowerPoint Processing Application. All rights reserved.

## Support

For issues, questions, or contributions:
- Review the `/app/README.md` for detailed documentation
- Check troubleshooting section above
- Review code comments and docstrings

---

**Built with ❤️ for enhanced presentations**
