// Nano Photo App - 最终修复版本
console.log('🎨 Nano Photo 应用启动...');

class NanoPhotoApp {
    constructor() {
        console.log('📱 初始化 Nano Photo 应用');
        this.currentImage = null;
        this.currentStyle = null;
        this.generatedImage = null;
        this.isGenerating = false;
        
        // 确保DOM加载完成后初始化
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }
    
    init() {
        console.log('🚀 开始初始化应用组件');
        try {
            this.initializeElements();
            this.initializeEventListeners();
            this.loadUserPreferences();
            console.log('✅ 应用初始化完成');
        } catch (error) {
            console.error('❌ 应用初始化失败:', error);
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
            }
        });
        
        if (missingElements.length > 0) {
            console.warn('⚠️ 缺少DOM元素:', missingElements);
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
                this.handleImageUpload(e);
            });
            console.log('✅ 文件输入事件已设置');
        }
        
        // 拖拽事件
        if (this.elements.uploadArea) {
            this.elements.uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                this.elements.uploadArea.classList.add('dragover');
            });
            
            this.elements.uploadArea.addEventListener('dragleave', () => {
                this.elements.uploadArea.classList.remove('dragover');
            });
            
            this.elements.uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                this.elements.uploadArea.classList.remove('dragover');
                const files = e.dataTransfer.files;
                if (files.length > 0) {
                    console.log('🎯 拖拽文件:', files[0].name);
                    this.handleImageUpload({ target: { files } });
                }
            });
            console.log('✅ 拖拽事件已设置');
        }
        
        // 卡片点击事件
        if (this.elements.cardBack) {
            this.elements.cardBack.addEventListener('click', () => {
                console.log('🎴 点击卡片背面');
                this.flipCard();
            });
        }
        
        if (this.elements.cardFront) {
            this.elements.cardFront.addEventListener('click', () => {
                console.log('🔄 点击卡片正面');
                this.showActionScreen();
            });
        }
        
        // 按钮事件
        if (this.elements.likeBtn) {
            this.elements.likeBtn.addEventListener('click', () => this.handleLike());
        }
        
        if (this.elements.dislikeBtn) {
            this.elements.dislikeBtn.addEventListener('click', () => this.handleDislike());
        }
        
        if (this.elements.downloadBtn) {
            this.elements.downloadBtn.addEventListener('click', () => this.handleDownload());
        }
        
        if (this.elements.againBtn) {
            this.elements.againBtn.addEventListener('click', () => this.generateAgain());
        }
        
        if (this.elements.backBtn) {
            this.elements.backBtn.addEventListener('click', () => this.backToStart());
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
            this.startGeneration();
        };
        
        reader.onerror = () => {
            console.error('❌ 文件读取失败');
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
        
        // 切换到生成界面
        this.showScreen('generatingScreen');
        
        // 选择随机风格
        this.currentStyle = this.selectRandomStyle();
        console.log('🎭 选择的风格:', this.currentStyle.name);
        
        // 开始生成过程
        this.simulateGeneration();
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
            
            this.updateProgress(progress);
            
            if (progress >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    this.completeGeneration();
                }, 500);
            }
        }, 200);
        
        // 超时保护
        setTimeout(() => {
            clearInterval(interval);
            if (this.isGenerating) {
                console.log('⏰ 生成超时，使用演示图片');
                this.completeGeneration();
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
            // 使用模拟API生成图片
            if (window.MockNanoPhotoAPI && this.currentImage && this.currentStyle) {
                console.log('🤖 使用模拟API生成图片...');
                const mockAPI = new MockNanoPhotoAPI();
                const result = await mockAPI.generatePhoto(
                    this.currentImage, 
                    this.currentStyle.prompt, 
                    this.currentStyle.id
                );
                
                if (result.success) {
                    console.log('✅ 模拟API生成成功');
                    this.generatedImage = result.imageUrl;
                } else {
                    console.error('❌ 模拟API生成失败:', result.error);
                    // 使用备用图片
                    this.generatedImage = 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=600&fit=crop&crop=face';
                }
            } else {
                console.log('📸 使用默认演示图片');
                // 使用演示图片
                this.generatedImage = 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=600&fit=crop&crop=face';
            }
            
            this.isGenerating = false;
            
            // 显示结果
            this.showResult();
            
        } catch (error) {
            console.error('❌ 生成过程出错:', error);
            this.isGenerating = false;
            
            // 使用备用图片
            this.generatedImage = 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=600&fit=crop&crop=face';
            this.showResult();
        }
    }
    
    showResult() {
        console.log('📸 显示生成结果');
        
        // 切换到结果界面
        this.showScreen('resultScreen');
        
        // 显示卡片背面
        if (this.elements.cardBack) {
            this.elements.cardBack.style.display = 'flex';
        }
        if (this.elements.cardFront) {
            this.elements.cardFront.style.display = 'none';
        }
    }
    
    flipCard() {
        console.log('🔄 翻转卡片');
        
        if (this.elements.cardBack && this.elements.cardFront && this.elements.generatedImg) {
            // 设置生成的图片
            this.elements.generatedImg.src = this.generatedImage;
            
            // 翻转动画
            this.elements.cardBack.style.transform = 'rotateY(180deg)';
            this.elements.cardFront.style.transform = 'rotateY(0deg)';
            
            setTimeout(() => {
                this.elements.cardBack.style.display = 'none';
                this.elements.cardFront.style.display = 'flex';
            }, 300);
        }
    }
    
    showActionScreen() {
        console.log('⚡ 显示操作界面');
        this.showScreen('actionScreen');
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
    
    showScreen(screenId) {
        console.log(`📱 切换到界面: ${screenId}`);
        
        const screens = ['uploadScreen', 'generatingScreen', 'resultScreen', 'actionScreen'];
        screens.forEach(id => {
            const screen = document.getElementById(id);
            if (screen) {
                screen.style.display = id === screenId ? 'flex' : 'none';
            }
        });
    }
    
    showFeedback(message) {
        console.log(`💬 反馈: ${message}`);
        // 这里可以添加toast提示
        alert(message);
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
console.log('🌟 准备启动 Nano Photo 应用...');

// 等待配置文件加载
function waitForConfig() {
    if (window.NANO_CONFIG) {
        console.log('⚙️ 配置文件已加载');
        new NanoPhotoApp();
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