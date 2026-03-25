#!/bin/sh
set -eu

echo "Dang dong bo schema SQLite..."
npx prisma db push --skip-generate

echo "Khoi dong API NestJS..."
node dist/src/main.js
