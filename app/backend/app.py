from flask import Flask, jsonify
from flask_cors import CORS
import logging
import os

from .api import api

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)


def create_app(config=None):
    app = Flask(__name__)
    
    app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024
    app.config['UPLOAD_FOLDER'] = os.path.join(os.path.dirname(__file__), 'uploads')
    app.config['OUTPUT_FOLDER'] = os.path.join(os.path.dirname(__file__), 'outputs')
    
    if config:
        app.config.update(config)
    
    CORS(app, resources={
        r"/api/*": {
            "origins": "*",
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })
    
    app.register_blueprint(api, url_prefix='/api')
    
    @app.route('/')
    def index():
        return jsonify({
            'service': 'PowerPoint Processing API',
            'version': '1.0.0',
            'status': 'running',
            'endpoints': {
                'health': '/api/health',
                'upload': '/api/upload',
                'process': '/api/process',
                'extract': '/api/extract',
                'download': '/api/download/<file_id>',
                'files': '/api/files',
                'cleanup': '/api/cleanup'
            }
        })
    
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Endpoint not found'}), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        logger.error(f"Internal server error: {str(error)}")
        return jsonify({'error': 'Internal server error'}), 500
    
    @app.errorhandler(413)
    def file_too_large(error):
        return jsonify({'error': 'File too large. Maximum size is 50MB'}), 413
    
    logger.info("Flask application initialized")
    
    return app


if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5000, debug=True)
