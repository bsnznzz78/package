#!/bin/bash

cd "$(dirname "$0")/backend"

echo "Starting PowerPoint Processing Backend..."
echo "Backend will run on http://localhost:5000"
echo ""

export FLASK_APP=app:create_app
export FLASK_ENV=development

python app.py
