# Nano Photo Docker配置文件
FROM node:18-alpine AS builder

# 设置工作目录
WORKDIR /app

# 复制package文件
COPY package*.json ./

# 安装依赖
RUN npm ci --only=production && npm cache clean --force

# 复制源代码
COPY . .

# 构建应用
RUN npm run build

# 生产环境镜像
FROM node:18-alpine AS production

# 安装dumb-init用于信号处理
RUN apk add --no-cache dumb-init

# 创建非root用户
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nanophoto -u 1001

# 设置工作目录
WORKDIR /app

# 复制package文件
COPY package*.json ./

# 只安装生产依赖
RUN npm ci --only=production && npm cache clean --force

# 从builder阶段复制构建结果
COPY --from=builder --chown=nanophoto:nodejs /app/dist ./dist
COPY --from=builder --chown=nanophoto:nodejs /app/server.js ./
COPY --from=builder --chown=nanophoto:nodejs /app/api.js ./

# 复制静态文件
COPY --chown=nanophoto:nodejs index-production.html ./index.html
COPY --chown=nanophoto:nodejs styles.css ./
COPY --chown=nanophoto:nodejs script-production.js ./script.js

# 设置用户
USER nanophoto

# 暴露端口
EXPOSE 3000

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) }).on('error', () => process.exit(1))"

# 启动应用
CMD ["dumb-init", "node", "server.js"]