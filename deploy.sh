#!/bin/bash
set -e

echo "── Pulling latest code ──────────────────"
git pull origin main

echo "── Installing backend dependencies ──────"
cd portfolio-backend
npm install --omit=dev

echo "── Installing frontend dependencies ─────"
cd ../portfolio-frontend
npm install

echo "── Building frontend ────────────────────"
npm run build

echo "── Restarting server ────────────────────"
cd ../portfolio-backend
if command -v pm2 &>/dev/null; then
  pm2 restart portfolio || pm2 start src/app.js --name portfolio
else
  echo "pm2 not found — run: npm start"
fi

echo ""
echo "✅ Deployment complete"
