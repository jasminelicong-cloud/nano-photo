const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { RateLimiterMemory } = require('rate-limiter-flexible');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// 安全中间件
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https:", "blob:"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://www.googletagmanager.com"],
            connectSrc: ["'self'", "https://api.nano-banana.com", "https://www.google-analytics.com"]
        }
    }
}));

// CORS配置
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://nanophoto.app', 'https://www.nanophoto.app']
        : ['http://localhost:3000', 'http://localhost:8000'],
    credentials: true
}));

// 压缩中间件
app.use(compression());

// 解析JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 速率限制
const rateLimiter = new RateLimiterMemory({
    keyGenerator: (req) => req.ip,
    points: 10, // 每个IP每分钟最多10次请求
    duration: 60, // 60秒
});

const rateLimiterMiddleware = async (req, res, next) => {
    try {
        await rateLimiter.consume(req.ip);
        next();
    } catch (rejRes) {
        res.status(429).json({
            success: false,
            error: 'Too many requests, please try again later.'
        });
    }
};

// 文件上传配置
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB限制
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('只支持图片文件'), false);
        }
    }
});

// 静态文件服务
app.use(express.static('.', {
    maxAge: process.env.NODE_ENV === 'production' ? '1d' : '0',
    etag: true,
    lastModified: true
}));

// API路由
app.post('/api/generate', rateLimiterMiddleware, upload.single('image'), async (req, res) => {
    try {
        const { prompt, style_id } = req.body;
        const imageFile = req.file;

        if (!imageFile) {
            return res.status(400).json({
                success: false,
                error: '请上传图片文件'
            });
        }

        if (!prompt) {
            return res.status(400).json({
                success: false,
                error: '请提供风格提示词'
            });
        }

        // 这里集成真实的Nano banana API
        const result = await callNanoBananaAPI({
            image: imageFile.buffer,
            prompt: prompt,
            styleId: style_id
        });

        if (result.success) {
            res.json({
                success: true,
                data: {
                    image_url: result.imageUrl,
                    id: result.generationId,
                    style_id: style_id
                }
            });
        } else {
            res.status(500).json({
                success: false,
                error: result.error || '生成失败'
            });
        }

    } catch (error) {
        console.error('API错误:', error);
        res.status(500).json({
            success: false,
            error: '服务器内部错误'
        });
    }
});

// 检查生成状态
app.get('/api/status/:id', rateLimiterMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        
        // 调用Nano banana API检查状态
        const status = await checkNanoBananaStatus(id);
        
        res.json(status);

    } catch (error) {
        console.error('状态检查错误:', error);
        res.status(500).json({
            success: false,
            error: '状态检查失败'
        });
    }
});

// 用户配额查询
app.get('/api/user/quota', rateLimiterMiddleware, async (req, res) => {
    try {
        // 这里应该根据用户身份验证获取配额
        // 现在返回模拟数据
        res.json({
            success: true,
            remaining: 50,
            total: 100,
            reset_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        });

    } catch (error) {
        console.error('配额查询错误:', error);
        res.status(500).json({
            success: false,
            error: '配额查询失败'
        });
    }
});

// 健康检查
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || '1.0.0'
    });
});

// 错误处理中间件
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                error: '文件大小超过限制（最大5MB）'
            });
        }
    }
    
    console.error('未处理的错误:', error);
    res.status(500).json({
        success: false,
        error: '服务器内部错误'
    });
});

// 404处理
app.use((req, res) => {
    if (req.path.startsWith('/api/')) {
        res.status(404).json({
            success: false,
            error: 'API端点不存在'
        });
    } else {
        // 对于非API请求，返回主页（SPA路由）
        res.sendFile(path.join(__dirname, 'index-production.html'));
    }
});

// Nano banana API集成函数
async function callNanoBananaAPI({ image, prompt, styleId }) {
    try {
        // 这里实现真实的Nano banana API调用
        const FormData = require('form-data');
        const fetch = require('node-fetch');
        
        const formData = new FormData();
        formData.append('image', image, 'upload.jpg');
        formData.append('prompt', prompt);
        formData.append('model', 'nano-banana');
        formData.append('style_id', styleId);
        
        const response = await fetch(`${process.env.NANO_API_URL}/generate`, {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': `Bearer ${process.env.NANO_API_KEY}`,
                ...formData.getHeaders()
            }
        });

        const result = await response.json();
        
        if (response.ok) {
            return {
                success: true,
                imageUrl: result.image_url,
                generationId: result.id
            };
        } else {
            return {
                success: false,
                error: result.error || '生成失败'
            };
        }

    } catch (error) {
        console.error('Nano banana API调用失败:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

async function checkNanoBananaStatus(generationId) {
    try {
        const fetch = require('node-fetch');
        
        const response = await fetch(`${process.env.NANO_API_URL}/status/${generationId}`, {
            headers: {
                'Authorization': `Bearer ${process.env.NANO_API_KEY}`
            }
        });

        const result = await response.json();
        
        return {
            success: true,
            status: result.status,
            image_url: result.image_url,
            progress: result.progress
        };

    } catch (error) {
        console.error('状态检查失败:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

// 启动服务器
app.listen(PORT, () => {
    console.log(`🚀 Nano Photo服务器运行在端口 ${PORT}`);
    console.log(`🌍 环境: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📱 访问: http://localhost:${PORT}`);
});