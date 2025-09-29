# 🎨 Nano Photo - AI写真生成器

> 使用Nano banana AI模型生成17种不同风格的专业写真照片

[![Deploy to GitHub Pages](https://img.shields.io/badge/Deploy-GitHub%20Pages-brightgreen)](https://pages.github.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Live Demo](https://img.shields.io/badge/Live-Demo-blue)](https://your-username.github.io/nano-photo)

## ✨ 功能特色

### 🎯 核心功能
- **17种写真风格**：从专业商务到艺术创意
- **智能推荐系统**：基于用户偏好的风格权重学习
- **卡片翻转效果**：趣味性的交互体验
- **一键下载**：高质量图片保存
- **响应式设计**：完美适配移动设备

### 🎨 写真风格库
1. **商务类**：专业头像、商业写真
2. **艺术类**：黑白艺术、现代摄影
3. **时尚类**：杂志封面、日式时尚
4. **复古类**：1950s-2010s拍立得风格
5. **创意类**：漫画风格、电影剧照

### 🚀 技术特点
- **前端**：原生JavaScript + CSS3动画
- **API集成**：Nano banana AI模型
- **部署**：GitHub Pages静态托管
- **安全**：客户端加密，无服务器存储

## 🌐 在线体验

**Live Demo**: [https://your-username.github.io/nano-photo](https://your-username.github.io/nano-photo)

## 📱 使用方法

1. **上传照片**：点击或拖拽上传人像照片
2. **AI生成**：系统随机选择风格生成写真
3. **查看结果**：点击卡片翻转查看生成效果
4. **用户反馈**：点赞/点踩影响后续推荐
5. **保存下载**：一键下载高质量写真

## 🛠️ 本地开发

### 环境要求
- Node.js 16+
- 现代浏览器（Chrome, Firefox, Safari, Edge）

### 快速开始
```bash
# 克隆项目
git clone https://github.com/your-username/nano-photo.git
cd nano-photo

# 本地运行
cd deploy
python3 -m http.server 8080

# 访问 http://localhost:8080
```

### API配置
```bash
# 复制环境配置
cp .env.example .env

# 编辑配置文件
NANO_API_URL=https://api.nano-banana.com/v1
NANO_API_KEY=your-api-key-here
```

## 🚀 部署指南

### GitHub Pages部署
```bash
# 1. 推送代码到GitHub
git add .
git commit -m "Initial commit: Nano Photo AI写真生成器"
git push origin main

# 2. 部署到GitHub Pages
git subtree push --prefix deploy origin gh-pages

# 3. 在GitHub仓库设置中启用Pages
```

### 其他部署选项
- **Vercel**: 零配置部署，自动HTTPS
- **Netlify**: 拖拽部署，表单处理
- **AWS S3**: 企业级托管，可扩展

## 📊 项目结构

```
nano-photo/
├── deploy/                 # 部署文件夹
│   ├── index.html         # 主页面
│   ├── styles.css         # 样式文件
│   ├── script.js          # 应用逻辑
│   ├── api.js             # API集成
│   └── .env               # 环境配置
├── docs/                  # 文档
├── scripts/               # 构建脚本
└── README.md             # 项目说明
```

## 🎯 写真风格详解

### 专业商务类
- **Professional Headshot**: 美式企业高管风格
- **Commercial Portrait**: 商业写真，时尚优雅

### 艺术摄影类
- **Black & White Art**: 经典黑白艺术肖像
- **Artistic Portrait**: 现代艺术风格摄影
- **Kodak Portra Style**: 柯达胶片质感

### 时尚杂志类
- **Magazine Cover**: 时尚杂志封面风格
- **Japanese Fashion**: 日式时尚杂志风格
- **Vogue Cover**: 国际时尚杂志风格

### 复古怀旧类
- **1950s-2010s Polaroid**: 各年代拍立得风格
- **Vintage Hollywood**: 好莱坞黄金时代

### 创意风格类
- **Comic Style**: 漫画风格融合
- **Cinematic Film**: 电影剧照风格

## 🔧 自定义配置

### 添加新风格
```javascript
// 在script.js中添加新风格
{
    id: 18,
    name: "新风格名称",
    prompt: "详细的风格描述提示词"
}
```

### 修改权重算法
```javascript
// 调整用户偏好权重
this.updateStylePreference(styleId, 1.2); // 点赞增加20%
this.updateStylePreference(styleId, 0.8); // 点踩减少20%
```

## 📈 性能优化

- **图片压缩**: WebP格式，懒加载
- **代码分割**: 动态导入，按需加载
- **缓存策略**: Service Worker缓存
- **CDN加速**: 全球内容分发网络

## 🔒 隐私安全

- **客户端处理**: 图片不上传到第三方服务器
- **API安全**: Bearer token认证
- **数据保护**: 本地存储用户偏好
- **HTTPS强制**: 所有通信加密传输

## 🤝 贡献指南

欢迎提交Issue和Pull Request！

1. Fork项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢

- [Nano banana AI](https://nano-banana.com) - AI模型支持
- [GitHub Pages](https://pages.github.com) - 免费托管服务
- 所有贡献者和用户的支持

## 📞 联系我们

- **项目主页**: [https://github.com/your-username/nano-photo](https://github.com/your-username/nano-photo)
- **问题反馈**: [Issues](https://github.com/your-username/nano-photo/issues)
- **功能建议**: [Discussions](https://github.com/your-username/nano-photo/discussions)

---

**用AI创造美丽，让每个人都能拥有专业写真！** ✨