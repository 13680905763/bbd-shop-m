#!/bin/bash
# === 配置区 ===
REMOTE_USER="root"
REMOTE_HOST="47.91.72.123" # 线上
# REMOTE_HOST="8.211.61.244"  # 测试

# 部署配置
PORT=${1:-3001}  # 从命令行参数获取端口，默认为3000
PROJECT_NAME="bbdbuy-mb"
if [ "$PORT" != "3001" ]; then
    PROJECT_NAME="bbdbuy-mb-${PORT}"  # 新端口使用不同的项目名
fi

REMOTE_DIR="/usr/frontend/${PROJECT_NAME}"
ARCHIVE_NAME="${PROJECT_NAME}.zip"
REMOTE_ARCHIVE_PATH="/usr/frontend/$ARCHIVE_NAME"

echo "==> 部署到端口: $PORT"
echo "==> 项目目录: $REMOTE_DIR"


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
  
  # 创建项目目录
  mkdir -p ${REMOTE_DIR}
  rm -rf ${REMOTE_DIR}/*
  
  # 解压文件
  7z x -y ${REMOTE_ARCHIVE_PATH} -o${REMOTE_DIR}
  rm ${REMOTE_ARCHIVE_PATH}
  
  cd ${REMOTE_DIR}
  
  # 安装 pnpm（如果需要）
  if ! command -v pnpm >/dev/null 2>&1; then
    npm install -g pnpm
  fi
  
  # 安装生产依赖
  pnpm install --prod
  
  # 创建或更新 PM2 配置文件，指定端口
  cat > ecosystem.config.cjs << 'EOC'
module.exports = {
  apps: [{
    name: "${PROJECT_NAME}",
    script: "node_modules/next/dist/bin/next",
    args: "start",
    env: {
      PORT: ${PORT},
      NODE_ENV: "production"
    },
    instances: 1,
    exec_mode: "fork"
  }]
}
EOC
  
  # 启动应用
  pm2 start ecosystem.config.cjs
  pm2 save
EOF

echo "----------- 部署完成！应用运行在端口 ${PORT} -------------"