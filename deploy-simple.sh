#!/bin/bash

# 简化版部署脚本 - 无需npm依赖
# 适用于静态部署（Vercel, Netlify等）

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🚀 Nano Photo 简化部署${NC}"

# 检查必要文件
check_files() {
    echo -e "${YELLOW}📋 检查文件...${NC}"
    
    required_files=("index-production.html" "styles.css" "script-production.js" "api.js")
    
    for file in "${required_files[@]}"; do
        if [ ! -f "$file" ]; then
            echo -e "${RED}❌ 缺少文件: $file${NC}"
            exit 1
        fi
    done
    
    echo -e "${GREEN}✅ 文件检查完成${NC}"
}

# 创建部署目录
create_deploy_dir() {
    echo -e "${YELLOW}📁 创建部署目录...${NC}"
    
    rm -rf deploy
    mkdir -p deploy
    
    # 复制文件到部署目录
    cp index-production.html deploy/index.html
    cp styles.css deploy/
    cp script-production.js deploy/script.js
    cp api.js deploy/
    cp .env deploy/ 2>/dev/null || echo "# 请配置环境变量" > deploy/.env
    
    echo -e "${GREEN}✅ 部署目录创建完成${NC}"
}

# Vercel部署
deploy_vercel() {
    echo -e "${YELLOW}▲ 准备Vercel部署...${NC}"
    
    if ! command -v vercel &> /dev/null; then
        echo -e "${YELLOW}正在安装 Vercel CLI...${NC}"
        npm install -g vercel 2>/dev/null || {
            echo -e "${RED}❌ 无法安装Vercel CLI，请手动安装：npm install -g vercel${NC}"
            echo -e "${BLUE}💡 或者访问 https://vercel.com 进行手动部署${NC}"
            return 1
        }
    fi
    
    cd deploy
    echo -e "${GREEN}✅ 可以运行 'vercel' 命令进行部署${NC}"
    cd ..
}

# Netlify部署准备
prepare_netlify() {
    echo -e "${YELLOW}🌐 准备Netlify部署...${NC}"
    
    # 创建netlify配置
    cat > deploy/_redirects << EOF
/api/* /.netlify/functions/:splat 200
/* /index.html 200
EOF
    
    echo -e "${GREEN}✅ Netlify配置完成${NC}"
    echo -e "${BLUE}💡 可以将 deploy/ 目录拖拽到 https://app.netlify.com/drop 进行部署${NC}"
}

# GitHub Pages准备
prepare_github_pages() {
    echo -e "${YELLOW}📚 准备GitHub Pages部署...${NC}"
    
    # 创建GitHub Pages配置
    cat > deploy/.nojekyll << EOF
EOF
    
    echo -e "${GREEN}✅ GitHub Pages配置完成${NC}"
    echo -e "${BLUE}💡 将 deploy/ 目录内容推送到 gh-pages 分支${NC}"
}

# 显示部署选项
show_deploy_options() {
    echo -e "${BLUE}🎯 部署选项：${NC}"
    echo -e "${YELLOW}1. Vercel (推荐)${NC}"
    echo -e "   - cd deploy && vercel"
    echo -e ""
    echo -e "${YELLOW}2. Netlify${NC}"
    echo -e "   - 访问 https://app.netlify.com/drop"
    echo -e "   - 拖拽 deploy/ 目录"
    echo -e ""
    echo -e "${YELLOW}3. GitHub Pages${NC}"
    echo -e "   - git add deploy/*"
    echo -e "   - git commit -m 'Deploy to GitHub Pages'"
    echo -e "   - git subtree push --prefix deploy origin gh-pages"
    echo -e ""
    echo -e "${YELLOW}4. 本地测试${NC}"
    echo -e "   - cd deploy && python3 -m http.server 8080"
}

# 本地测试
test_local() {
    echo -e "${YELLOW}🧪 启动本地测试服务器...${NC}"
    cd deploy
    echo -e "${GREEN}✅ 访问 http://localhost:8080 查看应用${NC}"
    python3 -m http.server 8080
}

# 主函数
main() {
    case "$1" in
        "test")
            check_files
            create_deploy_dir
            test_local
            ;;
        "vercel")
            check_files
            create_deploy_dir
            deploy_vercel
            ;;
        "netlify")
            check_files
            create_deploy_dir
            prepare_netlify
            ;;
        "github")
            check_files
            create_deploy_dir
            prepare_github_pages
            ;;
        *)
            check_files
            create_deploy_dir
            prepare_netlify
            show_deploy_options
            ;;
    esac
    
    echo -e "${GREEN}🎉 部署准备完成！${NC}"
}

# 执行主函数
main "$@"