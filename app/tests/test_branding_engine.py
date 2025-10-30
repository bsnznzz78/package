import unittest
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent / 'backend'))

from processors.branding_engine import BrandingEngine


class TestBrandingEngine(unittest.TestCase):
    def setUp(self):
        self.engine = BrandingEngine()
    
    def test_initialization(self):
        self.assertIsNotNone(self.engine.config)
        self.assertIn('fonts', self.engine.config)
        self.assertIn('colors', self.engine.config)
    
    def test_get_brand_font(self):
        font = self.engine.get_brand_font()
        self.assertEqual(font, 'Frutiger LT')
    
    def test_determine_shape_type(self):
        class MockShape:
            def __init__(self):
                self.has_text_frame = True
                self.text = "Test Title"
                self.top = 100000
                self.width = 5000000
        
        shape = MockShape()
        shape_type = self.engine.determine_shape_type(shape, 0)
        self.assertIn(shape_type, ['title', 'heading', 'body', 'none'])


if __name__ == '__main__':
    unittest.main()
