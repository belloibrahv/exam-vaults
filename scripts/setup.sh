#!/bin/bash

# Techvaults GCDL Exam System - Quick Setup Script
# This script automates the setup process

set -e

echo "🚀 Techvaults GCDL Exam System - Setup"
echo "======================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install PostgreSQL 14+ first."
    echo "   Download from: https://www.postgresql.org/download/"
    exit 1
fi

echo "✅ PostgreSQL is installed"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install
echo "✅ Dependencies installed"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚙️  Setting up environment variables..."
    cp .env.example .env
    
    # Generate a random secret
    SECRET=$(openssl rand -base64 32)
    
    # Update .env file (macOS compatible)
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s/generate-a-random-secret-key-here/$SECRET/" .env
    else
        sed -i "s/generate-a-random-secret-key-here/$SECRET/" .env
    fi
    
    echo "✅ Environment file created (.env)"
    echo ""
    echo "⚠️  IMPORTANT: Please update the DATABASE_URL in .env with your PostgreSQL credentials"
    echo "   Current value: postgresql://postgres:password@localhost:5432/techvaults_exam?schema=public"
    echo ""
    read -p "Press Enter after updating .env file..."
fi

# Set up database
echo "🗄️  Setting up database..."
npm run db:push
echo "✅ Database schema created"
echo ""

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npm run db:generate
echo "✅ Prisma client generated"
echo ""

# Seed database
echo "🌱 Seeding database with sample data..."
npm run db:seed
echo "✅ Database seeded"
echo ""

echo "🎉 Setup complete!"
echo ""
echo "📋 Demo Credentials:"
echo "   Admin:   admin@techvaults.com / admin123"
echo "   Student: student@techvaults.com / student123"
echo ""
echo "🚀 To start the development server, run:"
echo "   npm run dev"
echo ""
echo "   Then open http://localhost:3000 in your browser"
echo ""
