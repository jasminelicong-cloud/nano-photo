// Nano Photo API 集成模块
class NanoPhotoAPI {
    constructor() {
        // Nano banana API 配置
        this.apiConfig = {
            baseURL: 'https://api.nano-banana.com/v1', // 替换为实际API地址
            apiKey: window.NANO_CONFIG?.API_KEY || 'sk-3RNycSK4jptF86qmwtFAzYNiNAKEt0i1xNZZEufKs6OmU0Mm',
            timeout: 30000, // 30秒超时
            maxRetries: 3
        };
    }

    // 生成AI写真
    async generatePhoto(imageData, stylePrompt, styleId) {
        try {
            const formData = new FormData();
            
            // 将base64图片转换为blob
            const imageBlob = this.base64ToBlob(imageData);
            formData.append('image', imageBlob, 'upload.jpg');
            formData.append('prompt', stylePrompt);
            formData.append('model', 'nano-banana');
            formData.append('style_id', styleId);
            
            // 设置生成参数
            formData.append('width', '512');
            formData.append('height', '640');
            formData.append('steps', '30');
            formData.append('guidance_scale', '7.5');
            formData.append('seed', Math.floor(Math.random() * 1000000));

            const response = await this.makeRequest('/generate', {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${this.apiConfig.apiKey}`,
                    // 不设置Content-Type，让浏览器自动设置multipart/form-data
                }
            });

            if (response.success) {
                return {
                    success: true,
                    imageUrl: response.data.image_url,
                    generationId: response.data.id,
                    style: styleId
                };
            } else {
                throw new Error(response.error || '生成失败');
            }

        } catch (error) {
            console.error('API调用失败:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // 检查生成状态（如果API是异步的）
    async checkGenerationStatus(generationId) {
        try {
            const response = await this.makeRequest(`/status/${generationId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.apiConfig.apiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            return {
                success: true,
                status: response.status, // 'pending', 'processing', 'completed', 'failed'
                imageUrl: response.image_url,
                progress: response.progress || 0
            };

        } catch (error) {
            console.error('状态检查失败:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // 通用请求方法
    async makeRequest(endpoint, options = {}) {
        const url = `${this.apiConfig.baseURL}${endpoint}`;
        
        const requestOptions = {
            timeout: this.apiConfig.timeout,
            ...options
        };

        let lastError;
        
        // 重试机制
        for (let attempt = 1; attempt <= this.apiConfig.maxRetries; attempt++) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), requestOptions.timeout);

                const response = await fetch(url, {
                    ...requestOptions,
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                const data = await response.json();
                return data;

            } catch (error) {
                lastError = error;
                console.warn(`API请求失败 (尝试 ${attempt}/${this.apiConfig.maxRetries}):`, error.message);
                
                if (attempt < this.apiConfig.maxRetries) {
                    // 指数退避重试
                    await this.delay(Math.pow(2, attempt) * 1000);
                }
            }
        }

        throw lastError;
    }

    // Base64转Blob
    base64ToBlob(base64Data) {
        const byteCharacters = atob(base64Data.split(',')[1]);
        const byteNumbers = new Array(byteCharacters.length);
        
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        
        const byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray], { type: 'image/jpeg' });
    }

    // 延迟函数
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 获取用户配额信息
    async getUserQuota() {
        try {
            const response = await this.makeRequest('/user/quota', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.apiConfig.apiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            return {
                success: true,
                remaining: response.remaining,
                total: response.total,
                resetDate: response.reset_date
            };

        } catch (error) {
            console.error('获取配额失败:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // 上传图片到云存储（如果需要）
    async uploadImage(imageBlob) {
        try {
            const formData = new FormData();
            formData.append('image', imageBlob);

            const response = await this.makeRequest('/upload', {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${this.apiConfig.apiKey}`
                }
            });

            return {
                success: true,
                imageUrl: response.url,
                imageId: response.id
            };

        } catch (error) {
            console.error('图片上传失败:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
}

// 导出API类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NanoPhotoAPI;
} else {
    window.NanoPhotoAPI = NanoPhotoAPI;
}