# Nano Photo 部署指南

本文档详细说明了如何部署Nano Photo AI写真生成应用到各种平台。

## 🚀 快速开始

### 1. 环境准备

```bash
# 克隆项目
git clone https://github.com/your-username/nano-photo.git
cd nano-photo

# 安装依赖
npm install

# 复制环境配置文件
cp .env.example .env
```

### 2. 配置环境变量

编辑 `.env` 文件，填入必要的配置：

```bash
# Nano banana API配置
NANO_API_URL=https://api.nano-banana.com/v1
NANO_API_KEY=your-api-key-here

# 其他配置...
```

### 3. 本地测试

```bash
# 开发模式
npm run dev

# 生产模式测试
npm start
```

## 🌐 部署选项

### Option 1: Vercel部署（推荐）

Vercel是最简单的部署方式，特别适合前端应用。

```bash
# 安装Vercel CLI
npm install -g vercel

# 部署到Vercel
vercel

# 生产环境部署
vercel --prod
```

**优势：**
- 零配置部署
- 自动HTTPS
- 全球CDN
- 自动扩展
- 免费额度充足

**配置文件：** `vercel.json`

### Option 2: Netlify部署

适合静态网站和Serverless函数。

```bash
# 安装Netlify CLI
npm install -g netlify-cli

# 构建项目
npm run build

# 部署
netlify deploy

# 生产环境部署
netlify deploy --prod
```

**优势：**
- 简单易用
- 表单处理
- 身份验证
- 分支预览

**配置文件：** `netlify.toml`

### Option 3: Docker部署

适合需要完全控制的生产环境。

```bash
# 构建Docker镜像
docker build -t nano-photo .

# 运行容器
docker run -d \
  --name nano-photo \
  -p 3000:3000 \
  --env-file .env \
  nano-photo
```

**优势：**
- 环境一致性
- 易于扩展
- 容器编排支持

**配置文件：** `Dockerfile`

### Option 4: AWS部署

使用AWS的完整云服务。

#### 4.1 S3 + CloudFront（静态部署）

```bash
# 构建项目
npm run build

# 同步到S3
aws s3 sync dist/ s3://your-bucket-name --delete

# 清除CloudFront缓存
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

#### 4.2 ECS部署（容器化）

```bash
# 推送到ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 123456789012.dkr.ecr.us-east-1.amazonaws.com

docker tag nano-photo:latest 123456789012.dkr.ecr.us-east-1.amazonaws.com/nano-photo:latest

docker push 123456789012.dkr.ecr.us-east-1.amazonaws.com/nano-photo:latest
```

### Option 5: 自动化部署

使用提供的部署脚本：

```bash
# 给脚本执行权限
chmod +x deploy.sh

# 部署到staging环境
./deploy.sh staging

# 部署到生产环境
./deploy.sh production v1.0.0

# 回滚
./deploy.sh rollback
```

## 🔧 API集成配置

### 1. Nano banana API配置

在 `.env` 文件中配置：

```bash
NANO_API_URL=https://api.nano-banana.com/v1
NANO_API_KEY=your-api-key-here
```

### 2. API密钥获取

1. 访问 [Nano banana官网](https://nano-banana.com)
2. 注册账户并获取API密钥
3. 配置API限制和权限

### 3. API调用示例

```javascript
// 在api.js中的实际API调用
const response = await fetch(`${this.apiConfig.baseURL}/generate`, {
    method: 'POST',
    body: formData,
    headers: {
        'Authorization': `Bearer ${this.apiConfig.apiKey}`
    }
});
```

## 📊 监控和分析

### 1. Google Analytics配置

在 `index-production.html` 中配置：

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### 2. 错误监控

推荐使用Sentry进行错误监控：

```bash
npm install @sentry/browser

# 在.env中配置
SENTRY_DSN=https://xxxxxxxxxx@sentry.io/xxxxxxxxxx
```

### 3. 性能监控

使用Web Vitals监控性能：

```javascript
import {getCLS, getFID, getFCP, getLCP, getTTFB} from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

## 🔒 安全配置

### 1. HTTPS配置

所有部署平台都应启用HTTPS：

- Vercel/Netlify：自动配置
- AWS CloudFront：配置SSL证书
- 自托管：使用Let's Encrypt

### 2. 环境变量安全

- 永远不要在代码中硬编码API密钥
- 使用环境变量管理敏感信息
- 定期轮换API密钥

### 3. 速率限制

在 `server.js` 中已配置基本的速率限制：

```javascript
const rateLimiter = new RateLimiterMemory({
    keyGenerator: (req) => req.ip,
    points: 10, // 每分钟10次请求
    duration: 60,
});
```

## 🚨 故障排除

### 常见问题

1. **API调用失败**
   - 检查API密钥是否正确
   - 确认API配额是否充足
   - 检查网络连接

2. **图片上传失败**
   - 检查文件大小限制（5MB）
   - 确认文件格式支持
   - 检查服务器存储空间

3. **部署失败**
   - 检查环境变量配置
   - 确认依赖安装完整
   - 查看部署日志

### 日志查看

```bash
# Docker容器日志
docker logs nano-photo

# Vercel日志
vercel logs

# Netlify日志
netlify logs
```

## 📈 性能优化

### 1. 图片优化

- 使用WebP格式
- 实现懒加载
- 配置CDN缓存

### 2. 代码分割

```javascript
// 动态导入
const api = await import('./api.js');
```

### 3. 缓存策略

```javascript
// Service Worker缓存
self.addEventListener('fetch', (event) => {
    if (event.request.destination === 'image') {
        event.respondWith(
            caches.match(event.request).then((response) => {
                return response || fetch(event.request);
            })
        );
    }
});
```

## 🔄 CI/CD配置

### GitHub Actions示例

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## 📞 支持

如果在部署过程中遇到问题：

1. 查看本文档的故障排除部分
2. 检查项目的GitHub Issues
3. 联系技术支持团队

---

**祝您部署顺利！🎉**