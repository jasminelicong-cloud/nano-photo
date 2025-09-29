// Nano Photo App - 调试版本
console.log('🎨 Nano Photo 调试版本启动...');

class NanoPhotoAppDebug {
    constructor() {
        console.log('📱 初始化 Nano Photo 应用 (调试模式)');
        this.currentImage = null;
        this.currentStyle = null;
        this.generatedImage = null;
        this.isGenerating = false;
        
        // 添加全局错误监听
        this.setupErrorHandling();
        
        // 确保DOM加载完成后初始化
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }
    
    setupErrorHandling() {
        window.addEventListener('error', (e) => {
            console.error('🚨 全局JavaScript错误:', e.error);
            console.error('📍 错误位置:', e.filename, ':', e.lineno);
            this.logError(`JavaScript错误: ${e.message}`);
        });

        window.addEventListener('unhandledrejection', (e) => {
            console.error('🚨 未处理的Promise拒绝:', e.reason);
            this.logError(`Promise拒绝: ${e.reason}`);
        });
    }
    
    logError(message) {
        // 在页面上显示错误信息
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: #ff4444;
            color: white;
            padding: 10px;
            border-radius: 5px;
            z-index: 10000;
            max-width: 300px;
            font-size: 12px;
        `;
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 5000);
    }
    
    init() {
        console.log('🚀 开始初始化应用组件 (调试模式)');
        try {
            this.initializeElements();
            this.initializeEventListeners();
            this.loadUserPreferences();
            console.log('✅ 应用初始化完成');
        } catch (error) {
            console.error('❌ 应用初始化失败:', error);
            this.logError(`初始化失败: ${error.message}`);
        }
    }
    
    initializeElements() {
        console.log('🔍 获取DOM元素...');
        
        // 获取所有必要的DOM元素
        this.elements = {
            uploadArea: document.getElementById('uploadArea'),
            fileInput: document.getElementById('fileInput'),
            uploadScreen: document.getElementById('uploadScreen'),
            generatingScreen: document.getElementById('generatingScreen'),
            resultScreen: document.getElementById('resultScreen'),
            actionScreen: document.getElementById('actionScreen'),
            cardBack: document.querySelector('.card-back'),
            cardFront: document.querySelector('.card-front'),
            generatedImg: document.getElementById('generatedImg'),
            likeBtn: document.getElementById('likeBtn'),
            dislikeBtn: document.getElementById('dislikeBtn'),
            downloadBtn: document.getElementById('downloadBtn'),
            againBtn: document.getElementById('againBtn'),
            backBtn: document.getElementById('backBtn'),
            loadingText: document.querySelector('.loading-text'),
            progressBar: document.querySelector('.progress-fill')
        };
        
        // 检查关键元素是否存在
        const missingElements = [];
        Object.entries(this.elements).forEach(([key, element]) => {
            if (!element) {
                missingElements.push(key);
                console.warn(`⚠️ 缺少DOM元素: ${key}`);
            } else {
                console.log(`✅ 找到元素: ${key}`);
            }
        });
        
        if (missingElements.length > 0) {
            console.warn('⚠️ 缺少DOM元素:', missingElements);
            this.logError(`缺少${missingElements.length}个DOM元素`);
        } else {
            console.log('✅ 所有DOM元素获取成功');
        }
    }
    
    initializeEventListeners() {
        console.log('🎧 设置事件监听器...');
        
        // 上传区域点击事件
        if (this.elements.uploadArea) {
            this.elements.uploadArea.addEventListener('click', (e) => {
                console.log('📸 点击上传区域');
                e.preventDefault();
                if (this.elements.fileInput) {
                    this.elements.fileInput.click();
                }
            });
            console.log('✅ 上传区域点击事件已设置');
        }
        
        // 文件输入事件
        if (this.elements.fileInput) {
            this.elements.fileInput.addEventListener('change', (e) => {
                console.log('📁 文件选择事件触发');
                try {
                    this.handleImageUpload(e);
                } catch (error) {
                    console.error('❌ 处理图片上传时出错:', error);
                    this.logError(`上传处理错误: ${error.message}`);
                }
            });
            console.log('✅ 文件输入事件已设置');
        }
        
        // 卡片点击事件
        if (this.elements.cardBack) {
            this.elements.cardBack.addEventListener('click', () => {
                console.log('🎴 点击卡片背面');
                try {
                    this.flipCard();
                } catch (error) {
                    console.error('❌ 翻转卡片时出错:', error);
                    this.logError(`卡片翻转错误: ${error.message}`);
                }
            });
        }
        
        if (this.elements.cardFront) {
            this.elements.cardFront.addEventListener('click', () => {
                console.log('🔄 点击卡片正面');
                try {
                    this.showActionScreen();
                } catch (error) {
                    console.error('❌ 显示操作界面时出错:', error);
                    this.logError(`显示操作界面错误: ${error.message}`);
                }
            });
        }
        
        // 按钮事件
        if (this.elements.likeBtn) {
            this.elements.likeBtn.addEventListener('click', () => {
                try {
                    this.handleLike();
                } catch (error) {
                    console.error('❌ 点赞处理错误:', error);
                    this.logError(`点赞错误: ${error.message}`);
                }
            });
        }
        
        if (this.elements.dislikeBtn) {
            this.elements.dislikeBtn.addEventListener('click', () => {
                try {
                    this.handleDislike();
                } catch (error) {
                    console.error('❌ 点踩处理错误:', error);
                    this.logError(`点踩错误: ${error.message}`);
                }
            });
        }
        
        if (this.elements.downloadBtn) {
            this.elements.downloadBtn.addEventListener('click', () => {
                try {
                    this.handleDownload();
                } catch (error) {
                    console.error('❌ 下载处理错误:', error);
                    this.logError(`下载错误: ${error.message}`);
                }
            });
        }
        
        if (this.elements.againBtn) {
            this.elements.againBtn.addEventListener('click', () => {
                try {
                    this.generateAgain();
                } catch (error) {
                    console.error('❌ 再次生成错误:', error);
                    this.logError(`再次生成错误: ${error.message}`);
                }
            });
        }
        
        if (this.elements.backBtn) {
            this.elements.backBtn.addEventListener('click', () => {
                try {
                    this.backToStart();
                } catch (error) {
                    console.error('❌ 返回首页错误:', error);
                    this.logError(`返回首页错误: ${error.message}`);
                }
            });
        }
        
        console.log('✅ 所有事件监听器设置完成');
    }
    
    handleImageUpload(event) {
        console.log('🖼️ 处理图片上传...');
        
        const files = event.target.files;
        if (!files || files.length === 0) {
            console.log('❌ 没有选择文件');
            return;
        }
        
        const file = files[0];
        console.log('📄 选择的文件:', {
            name: file.name,
            size: file.size,
            type: file.type
        });
        
        // 验证文件
        if (!this.validateFile(file)) {
            return;
        }
        
        // 读取文件
        const reader = new FileReader();
        reader.onload = (e) => {
            console.log('✅ 文件读取成功');
            this.currentImage = e.target.result;
            try {
                this.startGeneration();
            } catch (error) {
                console.error('❌ 开始生成时出错:', error);
                this.logError(`开始生成错误: ${error.message}`);
            }
        };
        
        reader.onerror = () => {
            console.error('❌ 文件读取失败');
            this.logError('文件读取失败');
            alert('文件读取失败，请重试');
        };
        
        reader.readAsDataURL(file);
    }
    
    validateFile(file) {
        console.log('🔍 验证文件...');
        
        const maxSize = 5 * 1024 * 1024; // 5MB
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        
        if (file.size > maxSize) {
            const sizeMB = (file.size / 1024 / 1024).toFixed(1);
            console.log(`❌ 文件过大: ${sizeMB}MB`);
            alert(`图片文件过大 (${sizeMB}MB)，请选择小于5MB的图片`);
            return false;
        }
        
        if (!allowedTypes.includes(file.type)) {
            console.log(`❌ 文件格式不支持: ${file.type}`);
            alert('不支持的图片格式，请选择JPG、PNG或WebP格式');
            return false;
        }
        
        console.log('✅ 文件验证通过');
        return true;
    }
    
    startGeneration() {
        console.log('🎨 开始AI写真生成...');
        
        if (this.isGenerating) {
            console.log('⚠️ 正在生成中，忽略重复请求');
            return;
        }
        
        this.isGenerating = true;
        
        try {
            // 切换到生成界面
            this.showScreen('generatingScreen');
            
            // 选择随机风格
            this.currentStyle = this.selectRandomStyle();
            console.log('🎭 选择的风格:', this.currentStyle.name);
            
            // 开始生成过程
            this.simulateGeneration();
        } catch (error) {
            console.error('❌ 开始生成过程时出错:', error);
            this.logError(`生成过程错误: ${error.message}`);
            this.isGenerating = false;
        }
    }
    
    selectRandomStyle() {
        if (!window.NANO_CONFIG || !window.NANO_CONFIG.PHOTO_STYLES) {
            console.error('❌ 配置文件未加载');
            // 返回默认风格
            return {
                id: 1,
                name: '专业商务头像',
                description: '美式企业高管摄影风格',
                prompt: '专业商务头像风格',
                weight: 1.0
            };
        }
        
        const styles = window.NANO_CONFIG.PHOTO_STYLES;
        const preferences = this.getUserPreferences();
        
        // 根据权重选择风格
        const weightedStyles = styles.map(style => ({
            ...style,
            weight: preferences[style.id] || 1.0
        }));
        
        const totalWeight = weightedStyles.reduce((sum, style) => sum + style.weight, 0);
        let random = Math.random() * totalWeight;
        
        for (const style of weightedStyles) {
            random -= style.weight;
            if (random <= 0) {
                return style;
            }
        }
        
        return weightedStyles[0]; // 备用
    }
    
    simulateGeneration() {
        console.log('⏳ 模拟AI生成过程...');
        
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress > 100) progress = 100;
            
            try {
                this.updateProgress(progress);
            } catch (error) {
                console.error('❌ 更新进度时出错:', error);
                this.logError(`进度更新错误: ${error.message}`);
            }
            
            if (progress >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    try {
                        this.completeGeneration();
                    } catch (error) {
                        console.error('❌ 完成生成时出错:', error);
                        this.logError(`完成生成错误: ${error.message}`);
                    }
                }, 500);
            }
        }, 200);
        
        // 超时保护
        setTimeout(() => {
            clearInterval(interval);
            if (this.isGenerating) {
                console.log('⏰ 生成超时，使用演示图片');
                try {
                    this.completeGeneration();
                } catch (error) {
                    console.error('❌ 超时处理时出错:', error);
                    this.logError(`超时处理错误: ${error.message}`);
                }
            }
        }, 10000);
    }
    
    updateProgress(progress) {
        if (this.elements.progressBar) {
            this.elements.progressBar.style.width = `${progress}%`;
        }
        
        if (this.elements.loadingText) {
            if (progress < 30) {
                this.elements.loadingText.textContent = 'Analyzing your photo...';
            } else if (progress < 60) {
                this.elements.loadingText.textContent = 'Applying AI magic...';
            } else if (progress < 90) {
                this.elements.loadingText.textContent = 'Creating your portrait...';
            } else {
                this.elements.loadingText.textContent = 'Almost done...';
            }
        }
    }
    
    async completeGeneration() {
        console.log('🎉 开始AI生成完成流程');
        
        try {
            // 强制使用真实API
            if (this.currentImage && this.currentStyle) {
                console.log('🚀 调用真实API生成个性化写真...');
                console.log('📸 原图数据长度:', this.currentImage.length);
                console.log('🎭 选择的风格:', this.currentStyle.name);
                
                const realAPI = new NanoPhotoAPI();
                const result = await realAPI.generatePhoto(
                    this.currentImage, 
                    this.currentStyle.prompt, 
                    this.currentStyle.id
                );
                
                if (result.success && result.imageUrl) {
                    console.log('✅ 真实API生成成功！');
                    console.log('🖼️ 生成的图片URL:', result.imageUrl);
                    this.generatedImage = result.imageUrl;
                    this.isGenerating = false;
                    
                    // 安全地显示结果
                    try {
                        this.showResult();
                    } catch (error) {
                        console.error('❌ 显示结果时出错:', error);
                        this.logError(`显示结果错误: ${error.message}`);
                    }
                    return;
                } else {
                    console.error('❌ 真实API生成失败:', result.error);
                    throw new Error(`API生成失败: ${result.error}`);
                }
            } else {
                throw new Error('缺少必要的图片或风格数据');
            }
            
        } catch (error) {
            console.error('❌ 生成过程出错:', error);
            this.logError(`生成失败: ${error.message}`);
            this.isGenerating = false;
            
            // 显示错误信息给用户
            this.showError(`生成失败: ${error.message}`);
            
            // 返回到上传界面
            setTimeout(() => {
                try {
                    this.showScreen('uploadScreen');
                    this.resetApp();
                } catch (resetError) {
                    console.error('❌ 重置应用时出错:', resetError);
                    this.logError(`重置错误: ${resetError.message}`);
                }
            }, 3000);
        }
    }
    
    showResult() {
        console.log('📸 显示生成结果');
        
        try {
            // 切换到结果界面
            this.showScreen('resultScreen');
            
            // 显示卡片背面
            if (this.elements.cardBack) {
                this.elements.cardBack.style.display = 'flex';
                console.log('✅ 卡片背面已显示');
            }
            if (this.elements.cardFront) {
                this.elements.cardFront.style.display = 'none';
                console.log('✅ 卡片正面已隐藏');
            }
        } catch (error) {
            console.error('❌ 显示结果时出错:', error);
            this.logError(`显示结果错误: ${error.message}`);
        }
    }
    
    flipCard() {
        console.log('🔄 翻转卡片');
        
        try {
            if (this.elements.cardBack && this.elements.cardFront && this.elements.generatedImg) {
                // 设置生成的图片
                console.log('🖼️ 设置图片源:', this.generatedImage);
                this.elements.generatedImg.src = this.generatedImage;
                
                // 翻转动画
                this.elements.cardBack.style.transform = 'rotateY(180deg)';
                this.elements.cardFront.style.transform = 'rotateY(0deg)';
                
                setTimeout(() => {
                    this.elements.cardBack.style.display = 'none';
                    this.elements.cardFront.style.display = 'flex';
                    console.log('✅ 卡片翻转完成');
                }, 300);
            } else {
                console.error('❌ 卡片翻转所需元素缺失');
                this.logError('卡片翻转元素缺失');
            }
        } catch (error) {
            console.error('❌ 翻转卡片时出错:', error);
            this.logError(`卡片翻转错误: ${error.message}`);
        }
    }
    
    showActionScreen() {
        console.log('⚡ 显示操作界面');
        try {
            this.showScreen('actionScreen');
        } catch (error) {
            console.error('❌ 显示操作界面时出错:', error);
            this.logError(`操作界面错误: ${error.message}`);
        }
    }
    
    showScreen(screenId) {
        console.log(`📱 切换到界面: ${screenId}`);
        
        try {
            const screens = ['uploadScreen', 'generatingScreen', 'resultScreen', 'actionScreen'];
            screens.forEach(id => {
                const screen = document.getElementById(id);
                if (screen) {
                    const shouldShow = id === screenId;
                    screen.style.display = shouldShow ? 'flex' : 'none';
                    console.log(`📺 ${id}: ${shouldShow ? '显示' : '隐藏'}`);
                } else {
                    console.warn(`⚠️ 找不到屏幕元素: ${id}`);
                }
            });
        } catch (error) {
            console.error('❌ 切换屏幕时出错:', error);
            this.logError(`屏幕切换错误: ${error.message}`);
        }
    }
    
    handleLike() {
        console.log('👍 用户点赞');
        this.updateStylePreference(this.currentStyle.id, 0.2);
        this.showFeedback('👍 已记录您的喜好！');
    }
    
    handleDislike() {
        console.log('👎 用户点踩');
        this.updateStylePreference(this.currentStyle.id, -0.2);
        this.showFeedback('👎 已记录您的反馈！');
    }
    
    handleDownload() {
        console.log('⬇️ 下载图片');
        
        if (this.generatedImage) {
            const link = document.createElement('a');
            link.href = this.generatedImage;
            link.download = `nano-photo-${Date.now()}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            this.showFeedback('📥 图片下载已开始！');
        }
    }
    
    generateAgain() {
        console.log('🔄 再次生成');
        this.startGeneration();
    }
    
    backToStart() {
        console.log('🏠 返回首页');
        this.showScreen('uploadScreen');
        this.resetApp();
    }
    
    showFeedback(message) {
        console.log(`💬 反馈: ${message}`);
        alert(message);
    }
    
    showError(message) {
        console.error(`❌ 错误: ${message}`);
        
        // 更新加载界面显示错误
        if (this.elements.loadingText) {
            this.elements.loadingText.textContent = message;
            this.elements.loadingText.style.color = '#ff4444';
        }
        
        // 停止进度条
        if (this.elements.progressBar) {
            this.elements.progressBar.style.width = '100%';
            this.elements.progressBar.style.background = '#ff4444';
        }
    }
    
    updateStylePreference(styleId, change) {
        const preferences = this.getUserPreferences();
        preferences[styleId] = Math.max(0.1, Math.min(2.0, (preferences[styleId] || 1.0) + change));
        localStorage.setItem('nanoPhotoPreferences', JSON.stringify(preferences));
        console.log(`📊 更新风格偏好 ${styleId}: ${preferences[styleId]}`);
    }
    
    getUserPreferences() {
        try {
            return JSON.parse(localStorage.getItem('nanoPhotoPreferences') || '{}');
        } catch {
            return {};
        }
    }
    
    loadUserPreferences() {
        const preferences = this.getUserPreferences();
        console.log('📊 加载用户偏好:', Object.keys(preferences).length, '个风格');
    }
    
    resetApp() {
        console.log('🔄 重置应用状态');
        this.currentImage = null;
        this.currentStyle = null;
        this.generatedImage = null;
        this.isGenerating = false;
        
        if (this.elements.fileInput) {
            this.elements.fileInput.value = '';
        }
        
        if (this.elements.progressBar) {
            this.elements.progressBar.style.width = '0%';
        }
    }
}

// 确保在DOM加载完成后启动应用
console.log('🌟 准备启动 Nano Photo 调试版本...');

// 等待配置文件加载
function waitForConfig() {
    if (window.NANO_CONFIG) {
        console.log('⚙️ 配置文件已加载');
        new NanoPhotoAppDebug();
    } else {
        console.log('⏳ 等待配置文件加载...');
        setTimeout(waitForConfig, 100);
    }
}

// 启动应用
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', waitForConfig);
} else {
    waitForConfig();
}