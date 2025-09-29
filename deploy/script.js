class NanoPhotoApp {
    constructor() {
        this.currentImage = null;
        this.currentStyle = null;
        this.generationId = null;
        this.stylePreferences = this.loadStylePreferences();
        this.photoStyles = this.initializePhotoStyles();
        this.api = new NanoPhotoAPI();
        this.initializeEventListeners();
        this.checkUserQuota();
    }

    // 初始化17种写真风格
    initializePhotoStyles() {
        return [
            {
                id: 1,
                name: "Professional Headshot",
                prompt: "将上传的人像转换为美式风格的专业 headshot（企业高管摄影风格），需保留原照片人物的面部特征和身份。要求：半身像，蓝色纹理背景，自然柔和的棚拍打光，高清清晰，肤色真实自然，画面简洁优雅。人物穿无袖黑色连衣裙，简约优雅设计，直筒略收身版型，面料光滑无图案，现代感与专业感兼具，搭配简约金色首饰，整体现代干练。表情放松自信，眼神有神，自然露齿微笑。镜头对焦清晰，背景轻微虚化，整体效果专业、精致、干净"
            },
            {
                id: 2,
                name: "Commercial Portrait",
                prompt: "請為圖中的角色拍攝一張商業寫真照片，人物的五官特徵要保持一致。人物描述擁有精緻的五官，溫柔而自信的眼神。如果角色为女性，则她的髮型是隨性而慵懶的低盤發，額前留著幾縷散髮，營造出一種不經意的鬆弛感，妝容方面，強調自然的裸妝感，重點突出清透的底妝、根根分明的睫毛和橘粉色系的口紅，整體妝面乾淨而有光澤。服裝與配飾方面，人物穿著一件黑色吊帶連衣裙，吊帶部分由閃亮的水鑽或銀色鏈條構成，增加了高級感和設計感。她佩戴了與吊帶相呼應的水鑽流蘇耳環，以及簡約的銀色手鐲和戒指。如果角色为男性，则发型干净清爽，妆容干净即可。"
            },
            {
                id: 3,
                name: "Black & White Art",
                prompt: "将上传的照片生成黑白肖像艺术作品，采用编辑类和艺术摄影风格。背景呈现柔和渐变效果，从中灰过渡到近乎纯白，营造出层次感与寂静氛围。细腻的胶片颗粒质感为画面培添了一种可触摸的、模拟摄影般的柔和质地，让人联想到经典的黑白摄影。他的脸部因为光线的轮廓，唤起神秘、亲密与优雅之感。他的五官精致而深刻，散发出忧郁与诗意之美，却不显矫饰。一束温柔的定向光，柔和地漫射开来，轻抚他的面颊曲线，或在眼中闪现光点—这是画面的情感核心。其余部分以大量负空间占据，刻意保持简洁，使画面自由呼吸。画面中没有文字、没有标志——只有光影与情绪交织"
            },
            {
                id: 4,
                name: "Magazine Cover",
                prompt: "生成一张杂志照封面：Using my picture in chic fashion portrait of a glamorous woman sitting indoors, holding and reading a fashion magazine. She wears a patterned silk headscarf, black cat-eye sunglasses, sheer mesh gloves, and a simple black dress with thin straps. Her lips are painted in a bold dark red, and she accessories with a pearl necklace. The style is inspired by vintage Hollywood elegance, exuding sophistication and mystery. Bright minimal background with soft natural lighting."
            },
            {
                id: 5,
                name: "Japanese Fashion",
                prompt: "Keep the same person as the reference photo, maintain facial structure and identity, East Asian female, short bob haircut with airy bangs, natural makeup, realistic skin texture, consistent appearance across all photos Japanese fashion magazine cover, autumn vibe, close-up portrait in soft natural daylight, film grain texture, cinematic lighting, stylish outfit with oversized wool coat and scarf, high-fashion look, authentic photography. Minimal background, realistic detail, editorial cover design. Typography overlay: bold Japanese vertical headline, magazine logo in top corner, smaller Japanese subtext captions, Vogue Japan / FUDGE cover style, authentic magazine scan look keep the same person as the reference photo"
            },
            {
                id: 6,
                name: "Comic Style",
                prompt: "The central figure, extracted from the uploaded image, isrendered in full, vibrant photorealistic color and sharp detail.They are dramatically lit to powerfully stand out. The backgroundis an intricately detailed, multi-panel, black and white comic strip,entirely wordless and filled with humorous, exaggeratednarratives directly featuring the central figure. These comicpanels should not only depict the subject in funny, light-hearted,or slightly absurd scenarios, but also seamlessly integrate thecentral figure into the surrounding comic world. The colorfulmain subject should"
            },
            {
                id: 7,
                name: "1970s Polaroid",
                prompt: "重新塑造成身处经典年代的形象照片，自然地融入当时的服装、发型、动作、场景和风格，比如身处1970年代。要呈现出拍立得相纸白边和拍立得胶片色调质感（拍立得相纸下方的白边区域用马克笔写下年代的四位数字），照片按2:3的拍立得相纸比例。"
            },
            {
                id: 8,
                name: "1980s Polaroid",
                prompt: "重新塑造成身处经典年代的形象照片，自然地融入当时的服装、发型、动作、场景和风格，比如身处1980年代。要呈现出拍立得相纸白边和拍立得胶片色调质感（拍立得相纸下方的白边区域用马克笔写下年代的四位数字），照片按2:3的拍立得相纸比例"
            },
            {
                id: 9,
                name: "1950s Polaroid",
                prompt: "重新塑造成身处经典年代的形象照片，自然地融入当时的服装、发型、动作、场景和风格，比如身处1950年代。要呈现出拍立得相纸白边和拍立得胶片色调质感（拍立得相纸下方的白边区域用马克笔写下年代的四位数字），照片按2:3的拍立得相纸比例"
            },
            {
                id: 10,
                name: "1990s Polaroid",
                prompt: "重新塑造成身处经典年代的形象照片，自然地融入当时的服装、发型、动作、场景和风格，比如身处1990年代。要呈现出拍立得相纸白边和拍立得胶片色调质感（拍立得相纸下方的白边区域用马克笔写下年代的四位数字），照片按2:3的拍立得相纸比例"
            },
            {
                id: 11,
                name: "2010s Polaroid",
                prompt: "重新塑造成身处经典年代的形象照片，自然地融入当时的服装、发型、动作、场景和风格，比如身处2010年代。要呈现出拍立得相纸白边和拍立得胶片色调质感（拍立得相纸下方的白边区域用马克笔写下年代的四位数字），照片按2:3的拍立得相纸比例"
            },
            {
                id: 12,
                name: "Kodak Portra Style",
                prompt: "将图中的人物转换为一张摄影棚拍摄的高分辨率的彩色肖像艺术作品，模仿柯达波特拉胶卷（Kodak Portra）的独特风格。要求半身照，动作协调自然，特写镜头，聚焦在面部。人物的服装和动作改为都市休闲风格，整体氛围偏向深邃但不刻意。整体效果安静、深邃且温柔。背景呈现柔和渐变效果，营造出层次感与寂静氛围。细腻的胶片颗粒质感为画面增添了一种可触摸的、模拟摄影般的柔和质地，色彩温暖而饱和，人物肤色呈现出健康迷人的奶油色调。一束温柔的定向光，柔和地漫射开来，轻抚他的面颊曲线，或在眼中闪现光点——这是画面的情感核心。其余部分以大量负空间占据，刻意保持简洁，使画面自由呼吸。画面中没有文字、没有标志——只有色彩与情绪交织。顶级摄影师的人物肖像照风格，非中心构图。"
            },
            {
                id: 13,
                name: "Artistic Portrait 1",
                prompt: "针对图中人物，需要确保人脸高还原度，并转换成高分辨率的彩色肖像艺术作品，背景呈现柔和渐变效果，营造出层次感与寂静氛围。细腻的胶片颗粒质感为画面增添了一种可触摸的、模拟摄影般的柔和质地，让人联想到经典的黑白摄影。画面中的人物非传统的摆拍，而像是被捕捉于思索或呼吸之间的瞬间。他的脸部因为光线的轮廓，唤起神秘、优雅之感。他的五官精致而深刻，散发出忧郁与诗意之美。一束温柔的定向光，柔和地漫射在他的面颊曲线，或在眼中闪现光点，这是画面的情感核心。其余部分以大量负空间占据，保持简洁，画面中没有文字、标志——只有光影与情绪交织。整体氛围仿佛一瞥即逝的目光，有种令人怅然的美。要求没有实物的背景"
            },
            {
                id: 14,
                name: "Artistic Portrait 2",
                prompt: "针对图中人物，需要确保人脸高还原度，并转换成高分辨率的彩色肖像艺术作品，背景呈现柔和渐变效果，营造出层次感与寂静氛围。细腻的胶片颗粒质感为画面增添了一种可触摸的、模拟摄影般的柔和质地，让人联想到经典的黑白摄影。画面中的人物非传统的摆拍，而像是被捕捉于思索或呼吸之间的瞬间。他的脸部因为光线的轮廓，唤起神秘、优雅之感。他的五官精致而深刻，散发出忧郁与诗意之美。一束温柔的定向光，柔和地漫射在他的面颊曲线，或在眼中闪现光点，这是画面的情感核心。其余部分以大量负空间占据，保持简洁，画面中没有文字、标志——只有光影与情绪交织。整体氛围仿佛一瞥即逝的目光，有种令人怅然的美。要求没有实物的背景"
            },
            {
                id: 15,
                name: "Modern B&W Art",
                prompt: "根据nano-banana model模型，将上传的人物照片转换成高分辨率的黑白肖像艺术作品，采用编辑类和现代艺术摄影风格。可以改变人物的动作姿势、表情、服饰、造型，增强画面张力。突出人物面部和光影质感。背景呈现柔和渐变效果，从中灰过渡到近乎纯白，营造出层次感与氛围感。细腻的胶片颗粒质感为画面增添了一种柔和质地，让人联想到经典的黑白摄影"
            },
            {
                id: 16,
                name: "Cinematic Film",
                prompt: "根据nano-banana model模型，将上传的人物照片转换成高分辨率的电影剧照。充满了高端模拟电影制作的灵魂。可以改变人物的动作姿势、表情、服饰、造型，以增强画面张力。突出人物面部和光影质感。采用原始 35 毫米柯达胶片拍摄。细腻的胶片颗粒质感，定焦镜头的柔和质感"
            },
            {
                id: 17,
                name: "Vogue Cover",
                prompt: "根据nano-banana model模型，将提供的照片重新创作为一张时尚杂志封面。保持人物的面部特征不变。可以改变人物的动作姿势、表情、服饰、造型，增强画面整体的设计感。使用专业的摄影棚灯光，并添加现代、简约的杂志标题和文字排版，使其看起来像《VOGUE》杂志的封面。"
            }
        ];
    }

    // 初始化事件监听器
    initializeEventListeners() {
        // 上传区域点击事件
        const uploadBox = document.getElementById('upload-box');
        const fileInput = document.getElementById('file-input');
        
        uploadBox.addEventListener('click', () => {
            fileInput.click();
        });

        // 文件选择事件
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                this.handleImageUpload(file);
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
                this.handleImageUpload(file);
            }
        });

        // 卡片翻转事件
        const photoCard = document.getElementById('photo-card');
        photoCard.addEventListener('click', () => {
            this.handleCardFlip();
        });

        // 操作按钮事件
        document.getElementById('like-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.handleLike();
        });

        document.getElementById('dislike-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.handleDislike();
        });

        document.getElementById('download-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.handleDownload();
        });

        // 再次生成按钮事件
        document.getElementById('generate-again-btn').addEventListener('click', () => {
            this.generateAgain();
        });

        document.getElementById('back-to-start-btn').addEventListener('click', () => {
            this.backToStart();
        });
    }

    // 检查用户配额
    async checkUserQuota() {
        const quota = await this.api.getUserQuota();
        if (quota.success) {
            console.log(`剩余配额: ${quota.remaining}/${quota.total}`);
            if (quota.remaining <= 0) {
                this.showQuotaExhaustedMessage();
            }
        }
    }

    // 显示配额用尽消息
    showQuotaExhaustedMessage() {
        const uploadBox = document.getElementById('upload-box');
        uploadBox.innerHTML = `
            <div class="quota-message">
                <div class="upload-icon">⚠️</div>
                <h3>配额已用完</h3>
                <p>请稍后再试或升级您的账户</p>
            </div>
        `;
        uploadBox.style.pointerEvents = 'none';
    }

    // 处理图片上传
    handleImageUpload(file) {
        // 检查文件大小（限制为5MB）
        if (file.size > 5 * 1024 * 1024) {
            this.showError('图片文件过大，请选择小于5MB的图片');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            this.currentImage = e.target.result;
            this.showLoadingScreen();
            this.generatePhoto();
        };
        reader.readAsDataURL(file);
    }

    // 显示错误消息
    showError(message) {
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

    // 显示加载界面
    showLoadingScreen() {
        this.hideAllScreens();
        document.getElementById('loading-screen').classList.add('active');
    }

    // 生成照片
    async generatePhoto() {
        try {
            // 随机选择风格（基于偏好权重）
            this.currentStyle = this.selectRandomStyle();
            
            // 更新加载文本
            this.updateLoadingText(`正在生成 ${this.currentStyle.name} 风格...`);
            
            // 调用真实API
            const result = await this.api.generatePhoto(
                this.currentImage, 
                this.currentStyle.prompt, 
                this.currentStyle.id
            );

            if (result.success) {
                this.generatedImageUrl = result.imageUrl;
                this.generationId = result.generationId;
                
                // 如果API返回的是异步生成，需要轮询状态
                if (result.generationId && !result.imageUrl) {
                    await this.pollGenerationStatus(result.generationId);
                }
                
                this.showResultScreen();
            } else {
                throw new Error(result.error || '生成失败');
            }

        } catch (error) {
            console.error('生成照片失败:', error);
            this.showError(`生成失败: ${error.message}`);
            this.backToStart();
        }
    }

    // 轮询生成状态
    async pollGenerationStatus(generationId) {
        const maxAttempts = 60; // 最多等待5分钟
        let attempts = 0;

        while (attempts < maxAttempts) {
            const status = await this.api.checkGenerationStatus(generationId);
            
            if (status.success) {
                if (status.status === 'completed') {
                    this.generatedImageUrl = status.imageUrl;
                    return;
                } else if (status.status === 'failed') {
                    throw new Error('生成失败');
                } else {
                    // 更新进度
                    this.updateLoadingProgress(status.progress);
                }
            }

            attempts++;
            await this.delay(5000); // 每5秒检查一次
        }

        throw new Error('生成超时');
    }

    // 更新加载文本
    updateLoadingText(text) {
        const loadingText = document.querySelector('.loading-text');
        if (loadingText) {
            loadingText.textContent = text;
        }
    }

    // 更新加载进度
    updateLoadingProgress(progress) {
        const loadingWait = document.querySelector('.loading-wait');
        if (loadingWait && progress) {
            loadingWait.textContent = `Progress: ${Math.round(progress)}%`;
        }
    }

    // 根据偏好权重选择随机风格
    selectRandomStyle() {
        const styles = this.photoStyles.map(style => ({
            ...style,
            weight: this.stylePreferences[style.id] || 1
        }));

        const totalWeight = styles.reduce((sum, style) => sum + style.weight, 0);
        let random = Math.random() * totalWeight;

        for (const style of styles) {
            random -= style.weight;
            if (random <= 0) {
                return style;
            }
        }

        return styles[0]; // 备用选择
    }

    // 显示结果界面
    showResultScreen() {
        this.hideAllScreens();
        document.getElementById('result-screen').classList.add('active');
        
        // 设置生成的图片
        const generatedImage = document.getElementById('generated-image');
        generatedImage.src = this.generatedImageUrl;
        
        // 添加图片加载错误处理
        generatedImage.onerror = () => {
            this.showError('图片加载失败');
            this.backToStart();
        };
        
        // 重置卡片状态
        const photoCard = document.getElementById('photo-card');
        photoCard.classList.remove('flipped');
        
        // 隐藏再次生成选项
        document.getElementById('next-actions').style.display = 'none';
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
        this.trackUserAction('like', this.currentStyle.id);
        console.log(`Liked style: ${this.currentStyle.name}`);
    }

    // 处理点踩
    handleDislike() {
        this.addButtonAnimation('dislike-btn');
        this.updateStylePreference(this.currentStyle.id, 0.8);
        this.trackUserAction('dislike', this.currentStyle.id);
        console.log(`Disliked style: ${this.currentStyle.name}`);
    }

    // 处理下载
    async handleDownload() {
        this.addButtonAnimation('download-btn');
        
        try {
            // 从URL获取图片数据
            const response = await fetch(this.generatedImageUrl);
            const blob = await response.blob();
            
            // 创建下载链接
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `nano-photo-${this.currentStyle.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // 清理URL对象
            URL.revokeObjectURL(link.href);
            
            this.trackUserAction('download', this.currentStyle.id);
            console.log('Downloaded photo');
            
        } catch (error) {
            console.error('下载失败:', error);
            this.showError('下载失败，请稍后重试');
        }
    }

    // 用户行为追踪
    trackUserAction(action, styleId) {
        // 发送用户行为数据到分析服务
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                'event_category': 'photo_generation',
                'event_label': `style_${styleId}`,
                'value': 1
            });
        }
    }

    // 添加按钮动画
    addButtonAnimation(buttonId) {
        const button = document.getElementById(buttonId);
        button.classList.add('clicked');
        setTimeout(() => {
            button.classList.remove('clicked');
        }, 300);
    }

    // 更新风格偏好
    updateStylePreference(styleId, multiplier) {
        if (!this.stylePreferences[styleId]) {
            this.stylePreferences[styleId] = 1;
        }
        this.stylePreferences[styleId] *= multiplier;
        
        // 限制权重范围
        this.stylePreferences[styleId] = Math.max(0.1, Math.min(5, this.stylePreferences[styleId]));
        
        this.saveStylePreferences();
    }

    // 再次生成
    generateAgain() {
        this.showLoadingScreen();
        this.generatePhoto();
    }

    // 返回开始
    backToStart() {
        this.hideAllScreens();
        document.getElementById('upload-screen').classList.add('active');
        
        // 重置文件输入
        document.getElementById('file-input').value = '';
        this.currentImage = null;
        this.currentStyle = null;
        this.generationId = null;
    }

    // 隐藏所有界面
    hideAllScreens() {
        const screens = document.querySelectorAll('.screen');
        screens.forEach(screen => {
            screen.classList.remove('active');
        });
    }

    // 延迟函数
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 加载风格偏好
    loadStylePreferences() {
        const saved = localStorage.getItem('nano-photo-preferences');
        return saved ? JSON.parse(saved) : {};
    }

    // 保存风格偏好
    saveStylePreferences() {
        localStorage.setItem('nano-photo-preferences', JSON.stringify(this.stylePreferences));
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    new NanoPhotoApp();
});