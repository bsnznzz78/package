from flask import Blueprint, request, jsonify, send_file
from werkzeug.utils import secure_filename
import os
import logging

from ..processors import PPTParser, DataExtractor, OutputGenerator
from ..utils import FileHandler

logger = logging.getLogger(__name__)

api = Blueprint('api', __name__)

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), '..', 'uploads')
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), '..', 'outputs')

file_handler = FileHandler(UPLOAD_DIR, OUTPUT_DIR)


@api.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'service': 'PowerPoint Processing API'
    }), 200


@api.route('/upload', methods=['POST'])
def upload_file():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        file_path = file_handler.save_uploaded_file(file)
        
        if not file_path:
            return jsonify({'error': 'Invalid file or file too large'}), 400
        
        try:
            parser = PPTParser(file_path)
            parser.load_presentation()
            validation = parser.validate_presentation_structure()
            info = parser.get_presentation_info()
            
            file_id = os.path.basename(file_path)
            
            return jsonify({
                'success': True,
                'file_id': file_id,
                'filename': secure_filename(file.filename),
                'info': info,
                'validation': validation
            }), 200
        
        except Exception as e:
            file_handler.delete_file(file_path)
            logger.error(f"Error processing uploaded file: {str(e)}")
            return jsonify({'error': f'Invalid PowerPoint file: {str(e)}'}), 400
    
    except Exception as e:
        logger.error(f"Upload error: {str(e)}")
        return jsonify({'error': 'Upload failed'}), 500


@api.route('/process', methods=['POST'])
def process_presentation():
    try:
        data = request.get_json()
        
        if not data or 'file_id' not in data:
            return jsonify({'error': 'file_id is required'}), 400
        
        file_id = data['file_id']
        file_path = os.path.join(UPLOAD_DIR, file_id)
        
        if not os.path.exists(file_path):
            return jsonify({'error': 'File not found'}), 404
        
        branding_config = data.get('branding_config', None)
        
        generator = OutputGenerator(file_path, OUTPUT_DIR)
        output_path = generator.generate_enhanced_presentation(branding_config)
        
        if not generator.validate_output(output_path):
            return jsonify({'error': 'Output validation failed'}), 500
        
        output_file_id = os.path.basename(output_path)
        
        return jsonify({
            'success': True,
            'output_file_id': output_file_id,
            'message': 'Presentation processed successfully'
        }), 200
    
    except Exception as e:
        logger.error(f"Processing error: {str(e)}")
        return jsonify({'error': f'Processing failed: {str(e)}'}), 500


@api.route('/extract', methods=['POST'])
def extract_data():
    try:
        data = request.get_json()
        
        if not data or 'file_id' not in data:
            return jsonify({'error': 'file_id is required'}), 400
        
        file_id = data['file_id']
        file_path = os.path.join(UPLOAD_DIR, file_id)
        
        if not os.path.exists(file_path):
            return jsonify({'error': 'File not found'}), 404
        
        extractor = DataExtractor(file_path)
        extracted_data = extractor.extract_all_data()
        
        return jsonify({
            'success': True,
            'data': extracted_data
        }), 200
    
    except Exception as e:
        logger.error(f"Extraction error: {str(e)}")
        return jsonify({'error': f'Extraction failed: {str(e)}'}), 500


@api.route('/download/<file_id>', methods=['GET'])
def download_file(file_id):
    try:
        file_path = os.path.join(OUTPUT_DIR, file_id)
        
        if not os.path.exists(file_path):
            return jsonify({'error': 'File not found'}), 404
        
        return send_file(
            file_path,
            as_attachment=True,
            download_name=file_id,
            mimetype='application/vnd.openxmlformats-officedocument.presentationml.presentation'
        )
    
    except Exception as e:
        logger.error(f"Download error: {str(e)}")
        return jsonify({'error': 'Download failed'}), 500


@api.route('/files', methods=['GET'])
def list_files():
    try:
        uploads = []
        outputs = []
        
        if os.path.exists(UPLOAD_DIR):
            uploads = [f for f in os.listdir(UPLOAD_DIR) if f.endswith('.pptx')]
        
        if os.path.exists(OUTPUT_DIR):
            outputs = [f for f in os.listdir(OUTPUT_DIR) if f.endswith('.pptx')]
        
        return jsonify({
            'success': True,
            'uploads': uploads,
            'outputs': outputs
        }), 200
    
    except Exception as e:
        logger.error(f"List files error: {str(e)}")
        return jsonify({'error': 'Failed to list files'}), 500


@api.route('/cleanup', methods=['POST'])
def cleanup_files():
    try:
        file_handler.cleanup_old_files(UPLOAD_DIR, max_age_hours=24)
        file_handler.cleanup_old_files(OUTPUT_DIR, max_age_hours=24)
        
        return jsonify({
            'success': True,
            'message': 'Cleanup completed'
        }), 200
    
    except Exception as e:
        logger.error(f"Cleanup error: {str(e)}")
        return jsonify({'error': 'Cleanup failed'}), 500
