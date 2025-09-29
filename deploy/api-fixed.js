// Nano Photo API 修复版本
class NanoPhotoAPI {
    constructor() {
        this.apiConfig = {
            baseURL: 'https://api.tu-zi.com/v1',
            apiKey: window.NANO_CONFIG?.API_KEY || 'sk-3RNycSK4jptF86qmwtFAzYNiNAKEt0i1xNZZEufKs6OmU0Mm',
            timeout: 60000, // 60秒超时
            maxRetries: 2
        };
        
        console.log('🔧 API配置:', {
            baseURL: this.apiConfig.baseURL,
            apiKey: this.apiConfig.apiKey.substring(0, 10) + '...'
        });
    }

    // 生成AI写真 - 修复版本
    async generatePhoto(imageData, stylePrompt, styleId) {
        console.log('🚀 开始API调用...');
        console.log('📸 图片数据长度:', imageData.length);
        console.log('🎭 风格提示:', stylePrompt.substring(0, 100) + '...');
        
        try {
            // 尝试多种可能的API端点
            const possibleEndpoints = [
                '/images/generations',
                '/generate',
                '/v1/images/generations',
                '/chat/completions',
                '/completions'
            ];
            
            for (const endpoint of possibleEndpoints) {
                console.log(`🔍 尝试端点: ${endpoint}`);
                
                try {
                    const result = await this.tryEndpoint(endpoint, imageData, stylePrompt, styleId);
                    if (result.success) {
                        console.log(`✅ 端点 ${endpoint} 调用成功`);
                        return result;
                    }
                } catch (error) {
                    console.log(`❌ 端点 ${endpoint} 失败:`, error.message);
                    continue;
                }
            }
            
            // 如果所有端点都失败，返回错误
            throw new Error('所有API端点都无法访问，请检查API配置');
            
        } catch (error) {
            console.error('❌ API调用完全失败:', error);
            return {
                success: false,
                error: error.message,
                code: 'API_CALL_FAILED'
            };
        }
    }
    
    // 尝试特定端点
    async tryEndpoint(endpoint, imageData, stylePrompt, styleId) {
        const url = `${this.apiConfig.baseURL}${endpoint}`;
        console.log(`📡 请求URL: ${url}`);
        
        // 根据端点类型使用不同的请求格式
        if (endpoint.includes('images/generations')) {
            return await this.tryImageGenerationFormat(url, imageData, stylePrompt);
        } else if (endpoint.includes('chat/completions')) {
            return await this.tryChatCompletionFormat(url, imageData, stylePrompt);
        } else {
            return await this.tryGenericFormat(url, imageData, stylePrompt, styleId);
        }
    }
    
    // 图片生成格式 (类似OpenAI DALL-E)
    async tryImageGenerationFormat(url, imageData, stylePrompt) {
        const requestBody = {
            prompt: stylePrompt,
            n: 1,
            size: "512x640",
            response_format: "url"
        };
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiConfig.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });
        
        console.log(`📊 响应状态: ${response.status}`);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.log(`❌ 错误响应: ${errorText}`);
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
        
        const data = await response.json();
        console.log('📦 响应数据:', data);
        
        if (data.data && data.data[0] && data.data[0].url) {
            return {
                success: true,
                imageUrl: data.data[0].url,
                metadata: data
            };
        }
        
        throw new Error('响应格式不正确');
    }
    
    // 聊天完成格式 (类似GPT)
    async tryChatCompletionFormat(url, imageData, stylePrompt) {
        const requestBody = {
            model: "gpt-4-vision-preview",
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: `请根据以下风格要求生成AI写真: ${stylePrompt}`
                        },
                        {
                            type: "image_url",
                            image_url: {
                                url: imageData
                            }
                        }
                    ]
                }
            ],
            max_tokens: 300
        };
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiConfig.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });
        
        console.log(`📊 响应状态: ${response.status}`);
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
        
        const data = await response.json();
        
        // 这种格式通常返回文本，需要特殊处理
        throw new Error('Chat completion格式不适用于图片生成');
    }
    
    // 通用格式 (FormData)
    async tryGenericFormat(url, imageData, stylePrompt, styleId) {
        const formData = new FormData();
        
        // 将base64转换为blob
        const imageBlob = this.base64ToBlob(imageData);
        formData.append('image', imageBlob, 'upload.jpg');
        formData.append('prompt', stylePrompt);
        formData.append('style_id', styleId);
        
        // 添加常见参数
        formData.append('width', '512');
        formData.append('height', '640');
        formData.append('steps', '20');
        formData.append('guidance_scale', '7.5');
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiConfig.apiKey}`
                // 不设置Content-Type，让浏览器自动设置
            },
            body: formData
        });
        
        console.log(`📊 响应状态: ${response.status}`);
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
        
        const data = await response.json();
        console.log('📦 响应数据:', data);
        
        // 尝试多种可能的响应格式
        const possibleImageUrls = [
            data.image_url,
            data.imageUrl,
            data.url,
            data.data?.image_url,
            data.data?.url,
            data.result?.image_url,
            data.result?.url
        ];
        
        for (const url of possibleImageUrls) {
            if (url && typeof url === 'string') {
                return {
                    success: true,
                    imageUrl: url,
                    metadata: data
                };
            }
        }
        
        throw new Error('响应中未找到图片URL');
    }
    
    // Base64转Blob
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
    
    // 获取API状态
    getStatus() {
        return {
            mode: 'real',
            apiUrl: this.apiConfig.baseURL,
            available: true
        };
    }
}

// 导出API类
window.NanoPhotoAPI = NanoPhotoAPI;