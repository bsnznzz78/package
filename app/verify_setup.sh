#!/bin/bash

echo "==================================="
echo "PowerPoint Processor Setup Verification"
echo "==================================="
echo ""

# Check Python
echo "1. Checking Python..."
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version)
    echo "   ✓ $PYTHON_VERSION found"
else
    echo "   ✗ Python 3 not found"
    exit 1
fi

# Check Node.js
echo "2. Checking Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "   ✓ Node.js $NODE_VERSION found"
else
    echo "   ✗ Node.js not found"
fi

# Check npm
echo "3. Checking npm..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo "   ✓ npm $NPM_VERSION found"
else
    echo "   ✗ npm not found"
fi

# Check pip
echo "4. Checking pip..."
if command -v pip3 &> /dev/null || command -v pip &> /dev/null; then
    echo "   ✓ pip found"
else
    echo "   ✗ pip not found"
fi

# Check directory structure
echo "5. Checking directory structure..."
REQUIRED_DIRS=(
    "backend/api"
    "backend/processors"
    "backend/utils"
    "frontend/src"
    "frontend/src/components"
    "config"
    "tests"
)

for dir in "${REQUIRED_DIRS[@]}"; do
    if [ -d "$dir" ]; then
        echo "   ✓ $dir exists"
    else
        echo "   ✗ $dir missing"
    fi
done

# Check key files
echo "6. Checking key files..."
REQUIRED_FILES=(
    "../requirements.txt"
    "backend/app.py"
    "frontend/package.json"
    "frontend/index.html"
    "README.md"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "   ✓ $file exists"
    else
        echo "   ✗ $file missing"
    fi
done

echo ""
echo "==================================="
echo "Next Steps:"
echo "==================================="
echo "1. Install Python dependencies:"
echo "   pip install -r ../requirements.txt"
echo ""
echo "2. Install Node.js dependencies:"
echo "   cd frontend && npm install"
echo ""
echo "3. Start backend server:"
echo "   cd backend && python app.py"
echo ""
echo "4. Start frontend server (in new terminal):"
echo "   cd frontend && npm run dev"
echo ""
echo "5. Access application:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:5000"
echo "==================================="
