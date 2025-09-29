// Nano Photo Gemini API 专用版本
class NanoPhotoGeminiAPI {
    constructor() {
        this.apiConfig = {
            baseURL: 'https://api.tu-zi.com/v1',
            apiKey: window.NANO_CONFIG?.API_KEY || 'sk-3RNycSK4jptF86qmwtFAzYNiNAKEt0i1xNZZEufKs6OmU0Mm',
            modelName: window.NANO_CONFIG?.MODEL_NAME || 'gemini-2.5-flash-image',
            timeout: 60000
        };
        
        console.log('🔧 Gemini API配置:', {
            baseURL: this.apiConfig.baseURL,
            apiKey: this.apiConfig.apiKey.substring(0, 10) + '...',
            modelName: this.apiConfig.modelName
        });
    }

    // 生成AI写真 - Gemini专用版本
    async generatePhoto(imageData, stylePrompt, styleId) {
        console.log('🚀 开始Gemini API调用...');
        console.log('📸 图片数据长度:', imageData.length);
        console.log('🎭 风格提示:', stylePrompt.substring(0, 100) + '...');
        
        try {
            // 使用测试中成功的端点和格式
            const url = `${this.apiConfig.baseURL}/chat/completions`;
            
            // 构建请求体 - 基于测试成功的格式
            const requestBody = {
                model: this.apiConfig.modelName,
                messages: [
                    {
                        role: "user",
                        content: [
                            {
                                type: "text",
                                text: stylePrompt
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
                max_tokens: 1000
            };
            
            console.log('📡 发送请求到:', url);
            console.log('📦 请求体大小:', JSON.stringify(requestBody).length);
            
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiConfig.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });
            
            console.log(`📊 响应状态: ${response.status} ${response.statusText}`);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ API错误响应:', errorText);
                throw new Error(`API调用失败: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log('📦 API响应数据:', data);
            
            // 解析Gemini的响应格式
            if (data.choices && data.choices[0] && data.choices[0].message) {
                const content = data.choices[0].message.content;
                console.log('💬 消息内容:', content);
                
                // 提取图片URL - 支持多种格式
                const imageUrl = this.extractImageUrl(content);
                
                if (imageUrl) {
                    console.log('✅ 成功提取图片URL:', imageUrl);
                    return {
                        success: true,
                        imageUrl: imageUrl,
                        metadata: {
                            model: data.model,
                            usage: data.usage,
                            originalContent: content
                        }
                    };
                } else {
                    console.error('❌ 无法从响应中提取图片URL');
                    console.error('响应内容:', content);
                    throw new Error('API响应中未找到图片URL');
                }
            } else {
                console.error('❌ API响应格式不正确');
                console.error('响应数据:', data);
                throw new Error('API响应格式不正确');
            }
            
        } catch (error) {
            console.error('❌ Gemini API调用失败:', error);
            return {
                success: false,
                error: error.message,
                code: 'GEMINI_API_ERROR'
            };
        }
    }
    
    // 从响应内容中提取图片URL
    extractImageUrl(content) {
        console.log('🔍 开始提取图片URL...');
        console.log('📝 内容:', content);
        
        // 方法1: 提取markdown格式的图片链接 ![image](url)
        const markdownMatch = content.match(/!\[.*?\]\((https?:\/\/[^\)]+)\)/);
        if (markdownMatch) {
            console.log('✅ 找到markdown格式图片:', markdownMatch[1]);
            return markdownMatch[1];
        }
        
        // 方法2: 提取任何https链接
        const httpsMatch = content.match(/https?:\/\/[^\s\)]+/);
        if (httpsMatch) {
            console.log('✅ 找到https链接:', httpsMatch[0]);
            return httpsMatch[0];
        }
        
        // 方法3: 提取常见图片URL格式
        const imageUrlMatch = content.match(/https?:\/\/[^\s\)]+\.(jpg|jpeg|png|gif|webp)/i);
        if (imageUrlMatch) {
            console.log('✅ 找到图片URL:', imageUrlMatch[0]);
            return imageUrlMatch[0];
        }
        
        // 方法4: 提取filesystem.site链接（基于测试结果）
        const filesystemMatch = content.match(/https?:\/\/filesystem\.site\/[^\s\)]+/);
        if (filesystemMatch) {
            console.log('✅ 找到filesystem.site链接:', filesystemMatch[0]);
            return filesystemMatch[0];
        }
        
        console.log('❌ 未找到任何图片URL');
        return null;
    }
    
    // 获取API状态
    getStatus() {
        return {
            mode: 'gemini',
            apiUrl: this.apiConfig.baseURL,
            model: this.apiConfig.modelName,
            available: true
        };
    }
    
    // 测试API连接
    async testConnection() {
        try {
            const response = await fetch(`${this.apiConfig.baseURL}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiConfig.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: this.apiConfig.modelName,
                    messages: [{
                        role: 'user',
                        content: 'test connection'
                    }],
                    max_tokens: 10
                })
            });
            
            return {
                success: response.ok,
                status: response.status,
                statusText: response.statusText
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
}

// 导出API类
window.NanoPhotoGeminiAPI = NanoPhotoGeminiAPI;
window.NanoPhotoAPI = NanoPhotoGeminiAPI; // 直接设置为主API类

console.log('✅ Gemini API已加载并设置为主API');