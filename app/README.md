# PowerPoint Processing Application

A complete web application that processes instructional PowerPoint presentations and generates enhanced, branded output presentations.

## Features

### Core Functionalities

1. **Input Processing**
   - Accept raw PowerPoint (.pptx) file uploads
   - Validate file format and size (max 50MB)
   - Parse and load presentations

2. **Data Extraction**
   - Extract text content from all slides
   - Extract branding details (fonts, colors, themes)
   - Identify and extract embedded graphics and images
   - Parse charts and data visualizations
   - Extract video links and multimedia references
   - Capture slide layouts and structure

3. **Processing & Enhancement Engine**
   - Apply standardized branding guidelines
   - Font: Frutiger LT (with fallbacks)
   - Consistent color schemes
   - Reformat text with proper sizing, weights, and colors
   - Standardize visual elements
   - Maintain slide layout structures

4. **Output Generation**
   - Generate final enhanced PowerPoint presentation
   - Preserve all content and media
   - Apply all branding and formatting improvements

5. **User Interface**
   - Simple, intuitive upload interface
   - Progress indicator during processing
   - Download option for processed presentation

## Technical Stack

### Backend
- **Framework**: Flask (Python)
- **PPT Processing**: python-pptx library
- **File Handling**: Werkzeug
- **API**: RESTful endpoints with CORS support

### Frontend
- **Framework**: React with Vite
- **UI Components**: Custom React components
- **Styling**: Modern CSS with responsive design
- **API Client**: Axios

## Project Structure

```
/app
  /backend
    /api
      - routes.py          # API endpoints
      - __init__.py
    /processors
      - ppt_parser.py      # PowerPoint file parser
      - data_extractor.py  # Data extraction logic
      - branding_engine.py # Branding application
      - output_generator.py # Output generation
      - __init__.py
    /utils
      - file_handler.py    # File management
      - __init__.py
    /uploads               # Uploaded files (temporary)
    /outputs               # Processed files
    - app.py              # Flask application
    - __init__.py
  /frontend
    /src
      /components
        - FileUpload.jsx   # File upload component
        - ProgressBar.jsx  # Progress indicator
        - ResultDisplay.jsx # Results display
      /services
        - api.js           # API service layer
      - App.jsx           # Main application
      - App.css           # Application styles
      - main.jsx          # React entry point
    - index.html          # HTML template
    - package.json        # Node dependencies
    - vite.config.js      # Vite configuration
  /config
    - branding_config.json # Branding settings
  /tests
    - test_ppt_parser.py
    - test_branding_engine.py
  - README.md
```

## Installation

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. Install Python dependencies:
```bash
cd /path/to/project
pip install -r requirements.txt
```

2. Set up environment (optional):
```bash
export FLASK_APP=app.backend.app:create_app
export FLASK_ENV=development
```

### Frontend Setup

1. Install Node dependencies:
```bash
cd app/frontend
npm install
```

## Running the Application

### Development Mode

1. Start the backend server:
```bash
# From project root
cd app/backend
python -m app
# Or
python app.py
```

Backend will run on: `http://localhost:5000`

2. Start the frontend development server:
```bash
# From app/frontend directory
npm run dev
```

Frontend will run on: `http://localhost:3000`

### Production Mode

1. Build the frontend:
```bash
cd app/frontend
npm run build
```

2. Run the backend with Gunicorn:
```bash
cd app/backend
gunicorn -w 4 -b 0.0.0.0:5000 'app:create_app()'
```

## API Endpoints

### Health Check
- **GET** `/api/health`
- Check API status

### Upload File
- **POST** `/api/upload`
- Upload a PowerPoint file
- Form data: `file` (multipart/form-data)

### Process Presentation
- **POST** `/api/process`
- Process an uploaded file
- Body: `{ "file_id": "string", "branding_config": {} }`

### Extract Data
- **POST** `/api/extract`
- Extract data from a presentation
- Body: `{ "file_id": "string" }`

### Download File
- **GET** `/api/download/<file_id>`
- Download processed presentation

### List Files
- **GET** `/api/files`
- List uploaded and processed files

### Cleanup
- **POST** `/api/cleanup`
- Remove old files (>24 hours)

## Configuration

### Branding Configuration

Edit `/app/config/branding_config.json` to customize:

- **Fonts**: Primary font, fallbacks, and sizes
- **Colors**: RGB values for primary, secondary, accent colors
- **Spacing**: Margins and line spacing
- **Alignment**: Text alignment for different elements
- **Logo**: Logo placement settings

Example:
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

## Usage

1. **Upload**: Click or drag-and-drop a .pptx file
2. **Process**: Click "Process Presentation"
3. **Wait**: Monitor progress bar
4. **Download**: Download enhanced presentation when complete

## Error Handling

The application handles:
- Invalid file formats
- File size limits (50MB max)
- Malformed presentations
- Missing fonts (fallback applied)
- Processing errors

## Performance

- Typical processing time: 30-90 seconds
- Handles presentations up to 200 slides
- Maximum file size: 50MB
- Automatic cleanup of old files (24 hours)

## Testing

Run backend tests:
```bash
cd app/tests
python -m unittest test_ppt_parser.py
python -m unittest test_branding_engine.py
```

## Security

- File validation before processing
- Secure filename handling
- Size limits enforced
- CORS configured for API access
- Temporary file cleanup

## Troubleshooting

### Backend Issues
- Ensure all Python dependencies are installed
- Check Python version (3.8+)
- Verify upload/output directories exist

### Frontend Issues
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check Node version (16+)
- Verify backend is running on port 5000

### Processing Issues
- Ensure presentation is not password-protected
- Check for unsupported PowerPoint features
- Verify file is not corrupted

## Future Enhancements

- [ ] Preview capability before processing
- [ ] Manual editing interface
- [ ] Cloud storage integration (AWS S3, Google Drive)
- [ ] Batch processing
- [ ] Custom branding templates
- [ ] User authentication
- [ ] Processing history
- [ ] Advanced analytics

## License

© 2024 PowerPoint Processing Application. All rights reserved.

## Support

For issues or questions, please contact the development team.
