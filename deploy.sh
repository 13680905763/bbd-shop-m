#!/bin/bash

# === 配置区 ===
REMOTE_USER="root"
# 线上
REMOTE_HOST="47.91.72.123"
# 测试
# REMOTE_HOST="8.211.61.244"
REMOTE_DIR="/usr/frontend/bbdbuy-mb"
PROJECT_NAME="bbdbuy-mb"
ARCHIVE_NAME="bbdbuy-mb.zip"
REMOTE_ARCHIVE_PATH="/usr/frontend/$ARCHIVE_NAME"

echo "==> Step 1: Building project locally..."
rm -rf .next
pnpm install
pnpm build

if [ $? -ne 0 ]; then
  echo "❌ Build failed"
  exit 1
fi

echo "==> Step 2: Packaging build artifacts..."
rm -f $ARCHIVE_NAME
"/c/Program Files/7-Zip/7z.exe" a -tzip $ARCHIVE_NAME .next public package.json pnpm-lock.yaml next.config.js ecosystem.config.cjs

echo "==> Step 3: Uploading archive to server..."
scp $ARCHIVE_NAME "${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_ARCHIVE_PATH}"
if [ $? -ne 0 ]; then
  echo " Upload failed"
  exit 1
fi

echo "==> Step 4: Deploy remotely..."
ssh ${REMOTE_USER}@${REMOTE_HOST} bash <<EOF
  set -e
  mkdir -p ${REMOTE_DIR}
  rm -rf ${REMOTE_DIR}/*

  7z x -y ${REMOTE_ARCHIVE_PATH} -o${REMOTE_DIR}
  rm ${REMOTE_ARCHIVE_PATH}

  cd ${REMOTE_DIR}

  if ! command -v pnpm >/dev/null 2>&1; then
    npm install -g pnpm
  fi

  pnpm install --prod

  pm2 start ecosystem.config.cjs
  pm2 save
EOF

echo "----------- Deployment completed successfully -------------"
