// Nano Photo 配置文件
window.NANO_CONFIG = {
    // API配置
    API_BASE_URL: 'https://api.nano-banana.com/v1',
    API_KEY: 'sk-dfAkmORblJdJRK56tSsioIERIpj4kAw5ZWp7jz1j1mjYMFL0', // 将通过环境变量或用户输入设置
    
    // 应用配置
    APP_NAME: 'Nano Photo',
    VERSION: '1.0.0',
    
    // 功能配置
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    SUPPORTED_FORMATS: ['image/jpeg', 'image/png', 'image/webp'],
    
    // 17种写真风格配置
    PHOTO_STYLES: [
        {
            id: 1,
            name: '专业商务头像',
            description: '美式企业高管摄影风格',
            prompt: '将上传的人像转换为美式风格的专业 headshot（企业高管摄影风格），需保留原照片人物的面部特征和身份。要求：半身像，蓝色纹理背景，自然柔和的棚拍打光，高清清晰，肤色真实自然，画面简洁优雅。人物穿无袖黑色连衣裙，简约优雅设计，直筒略收身版型，面料光滑无图案，现代感与专业感兼具，搭配简约金色首饰，整体现代干练。表情放松自信，眼神有神，自然露齿微笑。镜头对焦清晰，背景轻微虚化，整体效果专业、精致、干净',
            weight: 1.0
        },
        {
            id: 2,
            name: '商业写真',
            description: '高级商业摄影风格',
            prompt: '請為圖中的角色拍攝一張商業寫真照片，人物的五官特徵要保持一致。人物描述擁有精緻的五官，溫柔而自信的眼神。如果角色为女性，则她的髮型是隨性而慵懶的低盤發，額前留著幾縷散髮，營造出一種不經意的鬆弛感，妝容方面，強調自然的裸妝感，重點突出清透的底妝、根根分明的睫毛和橘粉色系的口紅，整體妝面乾淨而有光澤。服裝與配飾方面，人物穿著一件黑色吊帶連衣裙，吊帶部分由閃亮的水鑽或銀色鏈條構成，增加了高級感和設計感。她佩戴了與吊帶相呼應的水鑽流蘇耳環，以及簡約的銀色手鐲和戒指。如果角色为男性，则发型干净清爽，妆容干净即可。',
            weight: 1.0
        },
        {
            id: 3,
            name: '黑白艺术肖像',
            description: '经典黑白摄影艺术',
            prompt: '将上传的照片生成黑白肖像艺术作品，采用编辑类和艺术摄影风格。背景呈现柔和渐变效果，从中灰过渡到近乎纯白，营造出层次感与寂静氛围。细腻的胶片颗粒质感为画面培添了一种可触摸的、模拟摄影般的柔和质地，让人联想到经典的黑白摄影。他的脸部因为光线的轮廓，唤起神秘、亲密与优雅之感。他的五官精致而深刻，散发出忧郁与诗意之美，却不显矫饰。一束温柔的定向光，柔和地漫射开来，轻抚他的面颊曲线，或在眼中闪现光点—这是画面的情感核心。其余部分以大量负空间占据，刻意保持简洁，使画面自由呼吸。画面中没有文字、没有标志——只有光影与情绪交织',
            weight: 1.0
        },
        {
            id: 4,
            name: '时尚杂志封面',
            description: '高端时尚杂志风格',
            prompt: '生成一张杂志照封面：Using my picture in chic fashion portrait of a glamorous woman sitting indoors, holding and reading a fashion magazine. She wears a patterned silk headscarf, black cat-eye sunglasses, sheer mesh gloves, and a simple black dress with thin straps. Her lips are painted in a bold dark red, and she accessories with a pearl necklace. The style is inspired by vintage Hollywood elegance, exuding sophistication and mystery. Bright minimal background with soft natural lighting.',
            weight: 1.0
        },
        {
            id: 5,
            name: '日式时尚风格',
            description: '日本时尚杂志风格',
            prompt: 'Keep the same person as the reference photo, maintain facial structure and identity, East Asian female, short bob haircut with airy bangs, natural makeup, realistic skin texture, consistent appearance across all photos Japanese fashion magazine cover, autumn vibe, close-up portrait in soft natural daylight, film grain texture, cinematic lighting, stylish outfit with oversized wool coat and scarf, high-fashion look, authentic photography. Minimal background, realistic detail, editorial cover design. Typography overlay: bold Japanese vertical headline, magazine logo in top corner, smaller Japanese subtext captions, Vogue Japan / FUDGE cover style, authentic magazine scan look keep the same person as the reference photo',
            weight: 1.0
        },
        {
            id: 6,
            name: '漫画风格融合',
            description: '真人与漫画结合',
            prompt: 'The central figure, extracted from the uploaded image, isrendered in full, vibrant photorealistic color and sharp detail.They are dramatically lit to powerfully stand out. The backgroundis an intricately detailed, multi-panel, black and white comic strip,entirely wordless and filled with humorous, exaggeratednarratives directly featuring the central figure. These comicpanels should not only depict the subject in funny, light-hearted,or slightly absurd scenarios, but also seamlessly integrate thecentral figure into the surrounding comic world. The colorfulmain subject should',
            weight: 1.0
        },
        {
            id: 7,
            name: '1970年代复古',
            description: '70年代拍立得风格',
            prompt: '重新塑造成身处经典年代的形象照片，自然地融入当时的服装、发型、动作、场景和风格，比如身处1970年代。要呈现出拍立得相纸白边和拍立得胶片色调质感（拍立得相纸下方的白边区域用马克笔写下年代的四位数字），照片按2:3的拍立得相纸比例。',
            weight: 1.0
        },
        {
            id: 8,
            name: '1980年代复古',
            description: '80年代拍立得风格',
            prompt: '重新塑造成身处经典年代的形象照片，自然地融入当时的服装、发型、动作、场景和风格，比如身处1980年代。要呈现出拍立得相纸白边和拍立得胶片色调质感（拍立得相纸下方的白边区域用马克笔写下年代的四位数字），照片按2:3的拍立得相纸比例',
            weight: 1.0
        },
        {
            id: 9,
            name: '1950年代复古',
            description: '50年代拍立得风格',
            prompt: '重新塑造成身处经典年代的形象照片，自然地融入当时的服装、发型、动作、场景和风格，比如身处1950年代。要呈现出拍立得相纸白边和拍立得胶片色调质感（拍立得相纸下方的白边区域用马克笔写下年代的四位数字），照片按2:3的拍立得相纸比例',
            weight: 1.0
        },
        {
            id: 10,
            name: '1990年代复古',
            description: '90年代拍立得风格',
            prompt: '重新塑造成身处经典年代的形象照片，自然地融入当时的服装、发型、动作、场景和风格，比如身处1990年代。要呈现出拍立得相纸白边和拍立得胶片色调质感（拍立得相纸下方的白边区域用马克笔写下年代的四位数字），照片按2:3的拍立得相纸比例',
            weight: 1.0
        },
        {
            id: 11,
            name: '2010年代复古',
            description: '2010年代拍立得风格',
            prompt: '重新塑造成身处经典年代的形象照片，自然地融入当时的服装、发型、动作、场景和风格，比如身处2010年代。要呈现出拍立得相纸白边和拍立得胶片色调质感（拍立得相纸下方的白边区域用马克笔写下年代的四位数字），照片按2:3的拍立得相纸比例',
            weight: 1.0
        },
        {
            id: 12,
            name: '柯达胶片质感',
            description: '柯达Portra胶卷风格',
            prompt: '将图中的人物转换为一张摄影棚拍摄的高分辨率的彩色肖像艺术作品，模仿柯达波特拉胶卷（Kodak Portra）的独特风格。要求半身照，动作协调自然，特写镜头，聚焦在面部。人物的服装和动作改为都市休闲风格，整体氛围偏向深邃但不刻意。整体效果安静、深邃且温柔。背景呈现柔和渐变效果，营造出层次感与寂静氛围。细腻的胶片颗粒质感为画面增添了一种可触摸的、模拟摄影般的柔和质地，色彩温暖而饱和，人物肤色呈现出健康迷人的奶油色调。一束温柔的定向光，柔和地漫射开来，轻抚他的面颊曲线，或在眼中闪现光点——这是画面的情感核心。其余部分以大量负空间占据，刻意保持简洁，使画面自由呼吸。画面中没有文字、没有标志——只有色彩与情绪交织。顶级摄影师的人物肖像照风格，非中心构图。',
            weight: 1.0
        },
        {
            id: 13,
            name: '艺术肖像A',
            description: '高分辨率艺术肖像',
            prompt: '针对图中人物，需要确保人脸高还原度，并转换成高分辨率的彩色肖像艺术作品，背景呈现柔和渐变效果，营造出层次感与寂静氛围。细腻的胶片颗粒质感为画面增添了一种可触摸的、模拟摄影般的柔和质地，让人联想到经典的黑白摄影。画面中的人物非传统的摆拍，而像是被捕捉于思索或呼吸之间的瞬间。他的脸部因为光线的轮廓，唤起神秘、优雅之感。他的五官精致而深刻，散发出忧郁与诗意之美。一束温柔的定向光，柔和地漫射在他的面颊曲线，或在眼中闪现光点，这是画面的情感核心。其余部分以大量负空间占据，保持简洁，画面中没有文字、标志——只有光影与情绪交织。整体氛围仿佛一瞥即逝的目光，有种令人怅然的美。要求没有实物的背景',
            weight: 1.0
        },
        {
            id: 14,
            name: '艺术肖像B',
            description: '高分辨率艺术肖像变体',
            prompt: '针对图中人物，需要确保人脸高还原度，并转换成高分辨率的彩色肖像艺术作品，背景呈现柔和渐变效果，营造出层次感与寂静氛围。细腻的胶片颗粒质感为画面增添了一种可触摸的、模拟摄影般的柔和质地，让人联想到经典的黑白摄影。画面中的人物非传统的摆拍，而像是被捕捉于思索或呼吸之间的瞬间。他的脸部因为光线的轮廓，唤起神秘、优雅之感。他的五官精致而深刻，散发出忧郁与诗意之美。一束温柔的定向光，柔和地漫射在他的面颊曲线，或在眼中闪现光点，这是画面的情感核心。其余部分以大量负空间占据，保持简洁，画面中没有文字、标志——只有光影与情绪交织。整体氛围仿佛一瞥即逝的目光，有种令人怅然的美。要求没有实物的背景',
            weight: 1.0
        },
        {
            id: 15,
            name: '现代黑白摄影',
            description: '现代艺术摄影风格',
            prompt: '根据nano-banana model模型，将上传的人物照片转换成高分辨率的黑白肖像艺术作品，采用编辑类和现代艺术摄影风格。可以改变人物的动作姿势、表情、服饰、造型，增强画面张力。突出人物面部和光影质感。背景呈现柔和渐变效果，从中灰过渡到近乎纯白，营造出层次感与氛围感。细腻的胶片颗粒质感为画面增添了一种柔和质地，让人联想到经典的黑白摄影',
            weight: 1.0
        },
        {
            id: 16,
            name: '电影剧照风格',
            description: '35mm胶片电影质感',
            prompt: '根据nano-banana model模型，将上传的人物照片转换成高分辨率的电影剧照。充满了高端模拟电影制作的灵魂。可以改变人物的动作姿势、表情、服饰、造型，以增强画面张力。突出人物面部和光影质感。采用原始 35 毫米柯达胶片拍摄。细腻的胶片颗粒质感，定焦镜头的柔和质感',
            weight: 1.0
        },
        {
            id: 17,
            name: 'VOGUE封面风格',
            description: '顶级时尚杂志封面',
            prompt: '根据nano-banana model模型，将提供的照片重新创作为一张时尚杂志封面。保持人物的面部特征不变。可以改变人物的动作姿势、表情、服饰、造型，增强画面整体的设计感。使用专业的摄影棚灯光，并添加现代、简约的杂志标题和文字排版，使其看起来像《VOGUE》杂志的封面。',
            weight: 1.0
        }
    ],
    
    // UI配置
    ANIMATIONS: {
        CARD_FLIP_DURATION: 600,
        LOADING_TIMEOUT: 30000,
        BUTTON_FEEDBACK_DURATION: 200
    },
    
    // 错误消息
    ERROR_MESSAGES: {
        FILE_TOO_LARGE: '图片文件过大，请选择小于5MB的图片',
        INVALID_FORMAT: '不支持的图片格式，请选择JPG、PNG或WebP格式',
        API_ERROR: 'AI生成服务暂时不可用，请稍后重试',
        NETWORK_ERROR: '网络连接异常，请检查网络后重试',
        QUOTA_EXCEEDED: '今日生成次数已达上限，请明天再试'
    }
};
