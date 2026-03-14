#!/bin/bash

# CryoGuard – Quick Start Script
# Run: chmod +x start.sh && ./start.sh

set -e

echo ""
echo "❄️  CryoGuard AI Leak Prediction System"
echo "========================================="
echo ""

# Step 1: Train model
echo "📦 Step 1: Training AI model..."
cd model
pip install scikit-learn numpy joblib -q
python train_model.py
cd ..
echo "✅ Model trained!"
echo ""

# Step 2: Start backend in background
echo "🚀 Step 2: Starting FastAPI backend..."
cd backend
pip install fastapi uvicorn pydantic -q
uvicorn main:app --port 8000 &
BACKEND_PID=$!
cd ..
echo "✅ Backend running at http://localhost:8000 (PID: $BACKEND_PID)"
echo ""

# Step 3: Install and start frontend
echo "🎨 Step 3: Starting Next.js frontend..."
cd frontend
npm install --silent
echo ""
echo "✅ All systems ready!"
echo ""
echo "🌐 Open: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Cleanup on exit
trap "kill $BACKEND_PID 2>/dev/null; echo 'Services stopped.'" EXIT

npm run dev
