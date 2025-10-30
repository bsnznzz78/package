import unittest
import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent / 'backend'))

from processors.ppt_parser import PPTParser


class TestPPTParser(unittest.TestCase):
    def test_allowed_extensions(self):
        self.assertIn('.pptx', PPTParser.ALLOWED_EXTENSIONS)
    
    def test_invalid_file_path(self):
        with self.assertRaises(FileNotFoundError):
            parser = PPTParser('/non/existent/file.pptx')
    
    def test_invalid_extension(self):
        test_file = '/tmp/test.txt'
        with open(test_file, 'w') as f:
            f.write('test')
        
        try:
            with self.assertRaises(ValueError):
                parser = PPTParser(test_file)
        finally:
            if os.path.exists(test_file):
                os.remove(test_file)


if __name__ == '__main__':
    unittest.main()
