import os
import shutil
from werkzeug.utils import secure_filename
from typing import Optional
import logging

logger = logging.getLogger(__name__)


class FileHandler:
    ALLOWED_EXTENSIONS = {'pptx'}
    MAX_FILE_SIZE = 50 * 1024 * 1024
    
    def __init__(self, upload_dir: str, output_dir: str):
        self.upload_dir = upload_dir
        self.output_dir = output_dir
        self._ensure_directories()
    
    def _ensure_directories(self):
        os.makedirs(self.upload_dir, exist_ok=True)
        os.makedirs(self.output_dir, exist_ok=True)
        logger.info(f"Directories ensured: {self.upload_dir}, {self.output_dir}")
    
    def allowed_file(self, filename: str) -> bool:
        return '.' in filename and \
               filename.rsplit('.', 1)[1].lower() in self.ALLOWED_EXTENSIONS
    
    def save_uploaded_file(self, file) -> Optional[str]:
        try:
            if not file or file.filename == '':
                logger.error("No file provided")
                return None
            
            if not self.allowed_file(file.filename):
                logger.error(f"Invalid file extension: {file.filename}")
                return None
            
            filename = secure_filename(file.filename)
            
            import uuid
            unique_filename = f"{uuid.uuid4().hex}_{filename}"
            
            file_path = os.path.join(self.upload_dir, unique_filename)
            file.save(file_path)
            
            file_size = os.path.getsize(file_path)
            if file_size > self.MAX_FILE_SIZE:
                os.remove(file_path)
                logger.error(f"File too large: {file_size} bytes")
                return None
            
            logger.info(f"File saved: {file_path}")
            return file_path
        
        except Exception as e:
            logger.error(f"Error saving file: {str(e)}")
            return None
    
    def get_file_info(self, file_path: str) -> dict:
        if not os.path.exists(file_path):
            return {}
        
        return {
            'filename': os.path.basename(file_path),
            'size': os.path.getsize(file_path),
            'path': file_path,
            'extension': os.path.splitext(file_path)[1]
        }
    
    def cleanup_old_files(self, directory: str, max_age_hours: int = 24):
        try:
            import time
            current_time = time.time()
            
            for filename in os.listdir(directory):
                file_path = os.path.join(directory, filename)
                
                if os.path.isfile(file_path):
                    file_age = current_time - os.path.getmtime(file_path)
                    
                    if file_age > (max_age_hours * 3600):
                        os.remove(file_path)
                        logger.info(f"Removed old file: {file_path}")
        
        except Exception as e:
            logger.error(f"Error cleaning up files: {str(e)}")
    
    def delete_file(self, file_path: str) -> bool:
        try:
            if os.path.exists(file_path):
                os.remove(file_path)
                logger.info(f"Deleted file: {file_path}")
                return True
            return False
        except Exception as e:
            logger.error(f"Error deleting file: {str(e)}")
            return False
    
    def copy_file(self, source: str, destination: str) -> bool:
        try:
            shutil.copy2(source, destination)
            logger.info(f"Copied file from {source} to {destination}")
            return True
        except Exception as e:
            logger.error(f"Error copying file: {str(e)}")
            return False
