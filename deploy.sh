#!/bin/bash
# deploy.sh - Script rápido de deployment

echo "🚀 Sanctum - Deploy Script"
echo "=========================="
echo ""

# Check git
if ! git status > /dev/null 2>&1; then
    echo "❌ Git no inicializado"
    exit 1
fi

BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$BRANCH" != "main" ]; then
    echo "⚠️ Estás en rama $BRANCH, pero deberías estar en main"
    git branch -M main
fi

echo "📋 Status actual:"
git status --short | head -10

echo ""
echo "✅ Proyecto está listo para:"
echo ""
echo "1️⃣  Subir a GitHub:"
echo "   git remote add origin https://github.com/TU-USERNAME/sanctum-app.git"
echo "   git push -u origin main"
echo ""
echo "2️⃣  Desplegar en Vercel (frontend):"
echo "   https://vercel.com → Sign Up with GitHub → Import"
echo ""
echo "3️⃣  Desplegar en Render (backend):"
echo "   https://render.com → New Web Service"
echo ""
echo "📖 Para instrucciones detalladas:"
echo "   - Lee PASOS_INMEDIATOS.md"
echo "   - O COMANDOS_COPY_PASTE.md"
echo ""
