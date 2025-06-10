# 1. 使用轻量级 Node.js 20 Alpine 版本镜像
FROM node:20-alpine

# 2. 创建并设置工作目录
WORKDIR /app

# 3. 拷贝依赖文件并安装生产依赖
COPY package*.json  ./
RUN npm install

# 4. 拷贝其余源码
COPY . .

# 5. 如果你还没 build，就添加构建命令（如果已经构建好可以跳过这行）
RUN npm run build

# 6. 暴露 Next.js 默认端口
EXPOSE 3000

# 7. 使用 Node 启动服务
CMD ["npm", "start"]