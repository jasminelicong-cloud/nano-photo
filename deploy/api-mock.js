// Nano Photo 模拟API - 用于演示和测试
class MockNanoPhotoAPI {
    constructor() {
        this.apiConfig = {
            baseURL: 'mock://nano-banana-api',
            apiKey: 'mock-api-key',
            timeout: 2000,
            maxRetries: 1
        };
        
        // 模拟生成的示例图片URLs
        this.sampleImages = [
            'https://images.unsplash.com/photo-1494790108755-2616c9c0e8e5?w=400&h=500&fit=crop&crop=face',
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face',
            'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=500&fit=crop&crop=face',
            'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=500&fit=crop&crop=face',
            'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=500&fit=crop&crop=face'
        ];
    }

    // 模拟延迟
    async delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 模拟API健康检查
    async healthCheck() {
        await this.delay(500);
        return {
            success: true,
            status: 'healthy',
            message: 'Mock API is running',
            timestamp: new Date().toISOString()
        };
    }

    // 模拟生成AI写真
    async generatePhoto(imageData, stylePrompt, styleId) {
        try {
            console.log('🎨 开始模拟AI写真生成...');
            console.log('📸 原图数据长度:', imageData.length);
            console.log('🎭 风格ID:', styleId);
            console.log('📝 风格提示:', stylePrompt.substring(0, 100) + '...');

            // 模拟处理时间
            await this.delay(1500 + Math.random() * 1000);

            // 随机选择一个示例图片
            const randomImage = this.sampleImages[Math.floor(Math.random() * this.sampleImages.length)];
            
            // 模拟成功响应
            const result = {
                success: true,
                imageUrl: randomImage,
                styleId: styleId,
                processingTime: Math.floor(1500 + Math.random() * 1000),
                metadata: {
                    model: 'nano-banana-mock',
                    style: stylePrompt.split('：')[0] || '未知风格',
                    resolution: '400x500',
                    format: 'jpeg'
                }
            };

            console.log('✅ 模拟生成完成:', result);
            return result;

        } catch (error) {
            console.error('❌ 模拟生成失败:', error);
            return {
                success: false,
                error: error.message,
                code: 'MOCK_GENERATION_ERROR'
            };
        }
    }

    // 将base64转换为blob（模拟用）
    base64ToBlob(base64Data) {
        try {
            const base64String = base64Data.split(',')[1];
            const byteCharacters = atob(base64String);
            const byteNumbers = new Array(byteCharacters.length);
            
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            
            const byteArray = new Uint8Array(byteNumbers);
            return new Blob([byteArray], { type: 'image/jpeg' });
        } catch (error) {
            console.error('Base64转换错误:', error);
            throw new Error('图片格式转换失败');
        }
    }

    // 模拟文件上传验证
    validateImage(imageData) {
        if (!imageData || !imageData.startsWith('data:image/')) {
            throw new Error('无效的图片格式');
        }

        // 估算文件大小（base64编码后的大小约为原文件的4/3）
        const estimatedSize = (imageData.length * 3) / 4;
        const maxSize = 5 * 1024 * 1024; // 5MB

        if (estimatedSize > maxSize) {
            throw new Error('图片文件过大，请选择小于5MB的图片');
        }

        return true;
    }

    // 获取API状态
    getStatus() {
        return {
            mode: 'mock',
            apiUrl: this.apiConfig.baseURL,
            available: true,
            sampleImagesCount: this.sampleImages.length
        };
    }
}

// 导出模拟API类
window.MockNanoPhotoAPI = MockNanoPhotoAPI;