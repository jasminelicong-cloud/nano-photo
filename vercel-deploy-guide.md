# 🚀 Vercel 网页部署指南

由于npm权限问题，我们使用Vercel网页界面进行部署，这种方式更简单直接！

## 📁 准备部署文件

您的部署文件已经准备好在 `deploy/` 目录中：
- ✅ index.html (主页面)
- ✅ styles.css (样式文件)
- ✅ script.js (应用逻辑)
- ✅ api.js (API集成)
- ✅ .env (环境配置)

## 🌐 Vercel 网页部署步骤

### 方法1：拖拽部署（最简单）

1. **访问 Vercel 部署页面**
   ```
   https://vercel.com/new
   ```

2. **拖拽部署文件夹**
   - 将整个 `deploy/` 文件夹拖拽到 Vercel 页面
   - 或者选择 "Browse" 按钮选择文件夹

3. **配置项目**
   - 项目名称：`nano-photo`
   - 框架预设：`Other`
   - 根目录：`./`

4. **环境变量配置**
   在 Vercel 项目设置中添加环境变量：
   ```
   NANO_API_URL=https://api.nano-banana.com/v1
   NANO_API_KEY=your-api-key-here
   NODE_ENV=production
   ```

5. **点击 Deploy**
   - Vercel 会自动构建和部署
   - 几分钟内完成部署

### 方法2：GitHub 集成部署

1. **创建 GitHub 仓库**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Nano Photo AI写真生成器"
   git branch -M main
   git remote add origin https://github.com/your-username/nano-photo.git
   git push -u origin main
   ```

2. **连接 Vercel**
   - 访问 https://vercel.com/dashboard
   - 点击 "New Project"
   - 选择 GitHub 仓库
   - 导入 `nano-photo` 项目

3. **配置构建设置**
   - Framework Preset: `Other`
   - Build Command: `echo "Static site, no build needed"`
   - Output Directory: `deploy`
   - Install Command: `echo "No install needed"`

## 🔧 部署配置文件

为了确保 Vercel 部署顺利，我已经为您创建了配置文件：

### vercel.json
```json
{
  "version": 2,
  "name": "nano-photo",
  "builds": [
    {
      "src": "deploy/**",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/deploy/$1"
    }
  ]
}
```

## 🎯 部署后检查

部署完成后，您将获得：
- 🌐 **生产URL**：`https://nano-photo-xxx.vercel.app`
- 🔒 **自动HTTPS**：SSL证书自动配置
- 🚀 **全球CDN**：全球加速访问
- 📊 **分析面板**：访问统计和性能监控

## 🔄 自动部署

一旦设置完成，每次推送代码到 GitHub 主分支，Vercel 会自动：
1. 检测代码变更
2. 自动构建项目
3. 部署到生产环境
4. 发送部署通知

## 🎉 部署成功后

### 1. 测试功能
- [ ] 页面正常加载
- [ ] 图片上传功能
- [ ] AI写真生成
- [ ] 卡片翻转动画
- [ ] 下载功能

### 2. 配置域名（可选）
- 在 Vercel 项目设置中添加自定义域名
- 配置 DNS 记录指向 Vercel

### 3. 监控和优化
- 查看 Vercel Analytics
- 监控 API 调用情况
- 收集用户反馈

---

## 🆘 如果遇到问题

### 常见问题解决：

**Q: 部署后页面空白？**
A: 检查浏览器控制台，确认文件路径正确

**Q: API 调用失败？**
A: 检查环境变量配置，确认 API 密钥正确

**Q: 图片上传不工作？**
A: 检查文件大小限制和格式支持

---

**现在就去 https://vercel.com/new 开始部署吧！🚀**