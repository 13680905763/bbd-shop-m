FROM node:20-alpine

WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package.json package-lock.json ./

# 安装生产依赖
RUN npm ci --production

# 复制本地构建好的文件
COPY .next .next
COPY public public

# 暴露端口
EXPOSE 3000c

CMD ["npm", "start"]
