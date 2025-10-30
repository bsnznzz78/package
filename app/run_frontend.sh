#!/bin/bash

cd "$(dirname "$0")/frontend"

echo "Starting PowerPoint Processing Frontend..."
echo "Frontend will run on http://localhost:3000"
echo ""

if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

npm run dev
