// Nano Photo App - 修复版本
console.log('Nano Photo script loading...');

// 确保DOM完全加载后再初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing app...');
    
    // 检查必要的配置是否存在
    if (typeof window.NANO_CONFIG === 'undefined') {
        console.error('NANO_CONFIG not found, using default config');
        window.NANO_CONFIG = {
            API_BASE_URL: 'https://api.nano-banana.com/v1',
            API_KEY: '',
            MAX_FILE_SIZE: 5 * 1024 * 1024,
            SUPPORTED_FORMATS: ['image/jpeg', 'image/png', 'image/webp']
        };
    }
    
    // 初始化应用
    try {
        const app = new NanoPhotoApp();
        console.log('App initialized successfully');
        window.nanoApp = app; // 全局访问
    } catch (error) {
        console.error('Failed to initialize app:', error);
        showInitError();
    }
});

// 显示初始化错误
function showInitError() {
    const uploadBox = document.getElementById('upload-box');
    if (uploadBox) {
        uploadBox.innerHTML = `
            <div class="error-message">
                <div class="upload-icon">⚠️</div>
                <h3>应用初始化失败</h3>
                <p>请刷新页面重试</p>
                <button onclick="location.reload()" style="margin-top: 10px; padding: 8px 16px; background: #667eea; color: white; border: none; border-radius: 5px; cursor: pointer;">刷新页面</button>
            </div>
        `;
    }
}

class NanoPhotoApp {
    constructor() {
        console.log('NanoPhotoApp constructor called');
        
        this.currentImage = null;
        this.currentStyle = null;
        this.generationId = null;
        this.generatedImageUrl = null;
        
        // 初始化风格偏好
        this.stylePreferences = this.loadStylePreferences();
        
        // 初始化写真风格
        this.photoStyles = this.getPhotoStyles();
        
        // 初始化API
        this.api = new NanoPhotoAPI();
        
        // 初始化事件监听器
        this.initializeEventListeners();
        
        console.log('NanoPhotoApp initialized with', this.photoStyles.length, 'styles');
    }

    // 获取写真风格配置
    getPhotoStyles() {
        if (window.NANO_CONFIG && window.NANO_CONFIG.PHOTO_STYLES) {
            return window.NANO_CONFIG.PHOTO_STYLES;
        }
        
        // 默认风格配置
        return [
            {
                id: 1,
                name: "Professional Headshot",
                description: "专业商务头像",
                prompt: "将上传的人像转换为美式风格的专业 headshot（企业高管摄影风格），需保留原照片人物的面部特征和身份。要求：半身像，蓝色纹理背景，自然柔和的棚拍打光，高清清晰，肤色真实自然，画面简洁优雅。",
                weight: 1.0
            },
            {
                id: 2,
                name: "Commercial Portrait",
                description: "商业写真",
                prompt: "請為圖中的角色拍攝一張商業寫真照片，人物的五官特徵要保持一致。人物描述擁有精緻的五官，溫柔而自信的眼神。",
                weight: 1.0
            },
            {
                id: 3,
                name: "Black & White Art",
                description: "黑白艺术肖像",
                prompt: "将上传的照片生成黑白肖像艺术作品，采用编辑类和艺术摄影风格。背景呈现柔和渐变效果，从中灰过渡到近乎纯白，营造出层次感与寂静氛围。",
                weight: 1.0
            }
        ];
    }

    // 初始化事件监听器
    initializeEventListeners() {
        console.log('Initializing event listeners...');
        
        const uploadBox = document.getElementById('upload-box');
        const fileInput = document.getElementById('file-input');
        
        if (!uploadBox || !fileInput) {
            console.error('Upload elements not found!');
            return;
        }
        
        console.log('Upload elements found, adding listeners...');
        
        // 上传区域点击事件
        uploadBox.addEventListener('click', (e) => {
            console.log('Upload box clicked');
            e.preventDefault();
            fileInput.click();
        });

        // 文件选择事件
        fileInput.addEventListener('change', (e) => {
            console.log('File input changed');
            const file = e.target.files[0];
            if (file) {
                console.log('File selected:', file.name, file.size, file.type);
                this.handleImageUpload(file);
            } else {
                console.log('No file selected');
            }
        });

        // 拖拽上传
        uploadBox.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadBox.style.borderColor = '#667eea';
            uploadBox.style.background = 'rgba(102, 126, 234, 0.1)';
        });

        uploadBox.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadBox.style.borderColor = '#cbd5e0';
            uploadBox.style.background = 'rgba(247, 250, 252, 0.8)';
        });

        uploadBox.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadBox.style.borderColor = '#cbd5e0';
            uploadBox.style.background = 'rgba(247, 250, 252, 0.8)';
            
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                console.log('File dropped:', file.name);
                this.handleImageUpload(file);
            }
        });

        // 其他按钮事件
        this.initializeButtonEvents();
        
        console.log('Event listeners initialized successfully');
    }

    // 初始化按钮事件
    initializeButtonEvents() {
        // 卡片翻转事件
        const photoCard = document.getElementById('photo-card');
        if (photoCard) {
            photoCard.addEventListener('click', () => {
                this.handleCardFlip();
            });
        }

        // 操作按钮事件
        const likeBtn = document.getElementById('like-btn');
        const dislikeBtn = document.getElementById('dislike-btn');
        const downloadBtn = document.getElementById('download-btn');
        
        if (likeBtn) {
            likeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleLike();
            });
        }
        
        if (dislikeBtn) {
            dislikeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleDislike();
            });
        }
        
        if (downloadBtn) {
            downloadBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleDownload();
            });
        }

        // 再次生成按钮事件
        const generateAgainBtn = document.getElementById('generate-again-btn');
        const backToStartBtn = document.getElementById('back-to-start-btn');
        
        if (generateAgainBtn) {
            generateAgainBtn.addEventListener('click', () => {
                this.generateAgain();
            });
        }
        
        if (backToStartBtn) {
            backToStartBtn.addEventListener('click', () => {
                this.backToStart();
            });
        }
    }

    // 处理图片上传
    handleImageUpload(file) {
        console.log('Handling image upload:', file.name);
        
        // 检查文件大小
        const maxSize = window.NANO_CONFIG?.MAX_FILE_SIZE || 5 * 1024 * 1024;
        if (file.size > maxSize) {
            this.showError('图片文件过大，请选择小于5MB的图片');
            return;
        }

        // 检查文件类型
        const supportedFormats = window.NANO_CONFIG?.SUPPORTED_FORMATS || ['image/jpeg', 'image/png', 'image/webp'];
        if (!supportedFormats.includes(file.type)) {
            this.showError('不支持的图片格式，请选择JPG、PNG或WebP格式');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            console.log('File read successfully');
            this.currentImage = e.target.result;
            this.showLoadingScreen();
            this.generatePhoto();
        };
        
        reader.onerror = (e) => {
            console.error('File read error:', e);
            this.showError('文件读取失败，请重试');
        };
        
        reader.readAsDataURL(file);
    }

    // 显示加载界面
    showLoadingScreen() {
        console.log('Showing loading screen');
        document.getElementById('upload-screen').classList.remove('active');
        document.getElementById('loading-screen').classList.add('active');
    }

    // 生成照片
    async generatePhoto() {
        console.log('Starting photo generation...');
        
        try {
            // 选择随机风格
            this.currentStyle = this.selectRandomStyle();
            console.log('Selected style:', this.currentStyle.name);
            
            // 调用API生成照片
            const result = await this.api.generatePhoto(this.currentImage, this.currentStyle.prompt);
            
            if (result.success) {
                console.log('Photo generated successfully');
                this.generatedImageUrl = result.imageUrl;
                this.generationId = result.generationId;
                this.showResultScreen();
            } else {
                console.error('Photo generation failed:', result.error);
                this.showError(result.error || '生成失败，请重试');
                this.backToStart();
            }
        } catch (error) {
            console.error('Generation error:', error);
            this.showError('生成过程中出现错误，请重试');
            this.backToStart();
        }
    }

    // 选择随机风格
    selectRandomStyle() {
        const styles = this.photoStyles.map(style => ({
            ...style,
            weight: this.stylePreferences[style.id] || 1.0
        }));
        
        const totalWeight = styles.reduce((sum, style) => sum + style.weight, 0);
        let random = Math.random() * totalWeight;
        
        for (const style of styles) {
            random -= style.weight;
            if (random <= 0) {
                return style;
            }
        }
        
        return styles[0]; // 备选
    }

    // 显示结果界面
    showResultScreen() {
        console.log('Showing result screen');
        
        document.getElementById('loading-screen').classList.remove('active');
        document.getElementById('result-screen').classList.add('active');
        
        // 设置风格名称
        const styleNameElement = document.getElementById('style-name');
        if (styleNameElement) {
            styleNameElement.textContent = this.currentStyle.name;
        }
        
        // 设置生成的图片
        const generatedImage = document.getElementById('generated-image');
        if (generatedImage) {
            generatedImage.src = this.generatedImageUrl;
        }
        
        // 重置卡片状态
        const photoCard = document.getElementById('photo-card');
        if (photoCard) {
            photoCard.classList.remove('flipped');
        }
        
        const nextActions = document.getElementById('next-actions');
        if (nextActions) {
            nextActions.style.display = 'none';
        }
    }

    // 处理卡片翻转
    handleCardFlip() {
        const photoCard = document.getElementById('photo-card');
        const nextActions = document.getElementById('next-actions');
        
        if (photoCard.classList.contains('flipped')) {
            // 从正面翻回背面
            photoCard.classList.remove('flipped');
            nextActions.style.display = 'flex';
        } else {
            // 从背面翻到正面
            photoCard.classList.add('flipped');
            nextActions.style.display = 'none';
        }
    }

    // 处理点赞
    handleLike() {
        this.addButtonAnimation('like-btn');
        this.updateStylePreference(this.currentStyle.id, 1.2);
        console.log(`Liked style: ${this.currentStyle.name}`);
    }

    // 处理点踩
    handleDislike() {
        this.addButtonAnimation('dislike-btn');
        this.updateStylePreference(this.currentStyle.id, 0.8);
        console.log(`Disliked style: ${this.currentStyle.name}`);
    }

    // 处理下载
    async handleDownload() {
        this.addButtonAnimation('download-btn');
        
        try {
            const response = await fetch(this.generatedImageUrl);
            const blob = await response.blob();
            
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `nano-photo-${this.currentStyle.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            URL.revokeObjectURL(link.href);
            console.log('Downloaded photo');
            
        } catch (error) {
            console.error('下载失败:', error);
            this.showError('下载失败，请稍后重试');
        }
    }

    // 再次生成
    generateAgain() {
        console.log('Generating again...');
        this.showLoadingScreen();
        this.generatePhoto();
    }

    // 返回开始
    backToStart() {
        console.log('Back to start');
        document.getElementById('result-screen').classList.remove('active');
        document.getElementById('loading-screen').classList.remove('active');
        document.getElementById('upload-screen').classList.add('active');
        
        // 重置状态
        this.currentImage = null;
        this.currentStyle = null;
        this.generationId = null;
        this.generatedImageUrl = null;
        
        // 重置文件输入
        const fileInput = document.getElementById('file-input');
        if (fileInput) {
            fileInput.value = '';
        }
    }

    // 添加按钮动画
    addButtonAnimation(buttonId) {
        const button = document.getElementById(buttonId);
        if (button) {
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
                button.style.transform = 'scale(1)';
            }, 150);
        }
    }

    // 更新风格偏好
    updateStylePreference(styleId, multiplier) {
        this.stylePreferences[styleId] = (this.stylePreferences[styleId] || 1.0) * multiplier;
        this.saveStylePreferences();
    }

    // 加载风格偏好
    loadStylePreferences() {
        try {
            const saved = localStorage.getItem('nano-photo-preferences');
            return saved ? JSON.parse(saved) : {};
        } catch (error) {
            console.error('Failed to load preferences:', error);
            return {};
        }
    }

    // 保存风格偏好
    saveStylePreferences() {
        try {
            localStorage.setItem('nano-photo-preferences', JSON.stringify(this.stylePreferences));
        } catch (error) {
            console.error('Failed to save preferences:', error);
        }
    }

    // 显示错误消息
    showError(message) {
        console.error('Error:', message);
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <div class="error-content">
                <span class="error-icon">❌</span>
                <span class="error-text">${message}</span>
            </div>
        `;
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #ff6b6b;
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(255, 107, 107, 0.3);
            z-index: 1000;
            animation: slideDown 0.3s ease;
        `;

        document.body.appendChild(errorDiv);
        setTimeout(() => {
            errorDiv.remove();
        }, 3000);
    }
}

console.log('Nano Photo script loaded successfully');