#!/bin/bash

# Nano Photo 部署脚本
# 使用方法: ./deploy.sh [环境] [版本]
# 例如: ./deploy.sh production v1.0.0

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 默认参数
ENVIRONMENT=${1:-staging}
VERSION=${2:-$(date +%Y%m%d-%H%M%S)}
PROJECT_NAME="nano-photo"

echo -e "${BLUE}🚀 开始部署 Nano Photo${NC}"
echo -e "${BLUE}环境: ${ENVIRONMENT}${NC}"
echo -e "${BLUE}版本: ${VERSION}${NC}"

# 检查必要的工具
check_dependencies() {
    echo -e "${YELLOW}📋 检查依赖...${NC}"
    
    if ! command -v node &> /dev/null; then
        echo -e "${RED}❌ Node.js 未安装${NC}"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        echo -e "${RED}❌ npm 未安装${NC}"
        exit 1
    fi
    
    if ! command -v git &> /dev/null; then
        echo -e "${RED}❌ Git 未安装${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ 依赖检查完成${NC}"
}

# 构建项目
build_project() {
    echo -e "${YELLOW}🔨 构建项目...${NC}"
    
    # 安装依赖
    npm ci --production=false
    
    # 运行测试
    if [ "$ENVIRONMENT" = "production" ]; then
        npm run test
    fi
    
    # 构建优化版本
    npm run build
    
    echo -e "${GREEN}✅ 项目构建完成${NC}"
}

# Docker部署
deploy_docker() {
    echo -e "${YELLOW}🐳 Docker部署...${NC}"
    
    # 构建Docker镜像
    docker build -t ${PROJECT_NAME}:${VERSION} .
    docker tag ${PROJECT_NAME}:${VERSION} ${PROJECT_NAME}:latest
    
    # 停止旧容器
    docker stop ${PROJECT_NAME} 2>/dev/null || true
    docker rm ${PROJECT_NAME} 2>/dev/null || true
    
    # 启动新容器
    docker run -d \
        --name ${PROJECT_NAME} \
        --restart unless-stopped \
        -p 3000:3000 \
        --env-file .env.${ENVIRONMENT} \
        ${PROJECT_NAME}:${VERSION}
    
    echo -e "${GREEN}✅ Docker部署完成${NC}"
}

# Vercel部署
deploy_vercel() {
    echo -e "${YELLOW}▲ Vercel部署...${NC}"
    
    if ! command -v vercel &> /dev/null; then
        echo -e "${YELLOW}安装 Vercel CLI...${NC}"
        npm install -g vercel
    fi
    
    # 部署到Vercel
    if [ "$ENVIRONMENT" = "production" ]; then
        vercel --prod --yes
    else
        vercel --yes
    fi
    
    echo -e "${GREEN}✅ Vercel部署完成${NC}"
}

# Netlify部署
deploy_netlify() {
    echo -e "${YELLOW}🌐 Netlify部署...${NC}"
    
    if ! command -v netlify &> /dev/null; then
        echo -e "${YELLOW}安装 Netlify CLI...${NC}"
        npm install -g netlify-cli
    fi
    
    # 构建并部署
    netlify build
    
    if [ "$ENVIRONMENT" = "production" ]; then
        netlify deploy --prod --dir=dist
    else
        netlify deploy --dir=dist
    fi
    
    echo -e "${GREEN}✅ Netlify部署完成${NC}"
}

# AWS S3 + CloudFront部署
deploy_aws() {
    echo -e "${YELLOW}☁️ AWS部署...${NC}"
    
    if ! command -v aws &> /dev/null; then
        echo -e "${RED}❌ AWS CLI 未安装${NC}"
        exit 1
    fi
    
    # 同步到S3
    aws s3 sync dist/ s3://${AWS_BUCKET_NAME} --delete
    
    # 清除CloudFront缓存
    if [ ! -z "$CLOUDFRONT_DISTRIBUTION_ID" ]; then
        aws cloudfront create-invalidation \
            --distribution-id $CLOUDFRONT_DISTRIBUTION_ID \
            --paths "/*"
    fi
    
    echo -e "${GREEN}✅ AWS部署完成${NC}"
}

# 健康检查
health_check() {
    echo -e "${YELLOW}🏥 健康检查...${NC}"
    
    local url="http://localhost:3000/api/health"
    if [ "$ENVIRONMENT" = "production" ]; then
        url="https://nanophoto.app/api/health"
    fi
    
    # 等待服务启动
    sleep 10
    
    # 检查健康状态
    for i in {1..5}; do
        if curl -f -s "$url" > /dev/null; then
            echo -e "${GREEN}✅ 健康检查通过${NC}"
            return 0
        fi
        echo -e "${YELLOW}⏳ 等待服务启动... ($i/5)${NC}"
        sleep 5
    done
    
    echo -e "${RED}❌ 健康检查失败${NC}"
    exit 1
}

# 发送通知
send_notification() {
    echo -e "${YELLOW}📢 发送部署通知...${NC}"
    
    local message="🚀 Nano Photo 部署成功！
环境: ${ENVIRONMENT}
版本: ${VERSION}
时间: $(date)
URL: https://nanophoto.app"
    
    # 发送到Slack（如果配置了）
    if [ ! -z "$SLACK_WEBHOOK_URL" ]; then
        curl -X POST -H 'Content-type: application/json' \
            --data "{\"text\":\"$message\"}" \
            $SLACK_WEBHOOK_URL
    fi
    
    # 发送邮件通知（如果配置了）
    if [ ! -z "$NOTIFICATION_EMAIL" ]; then
        echo "$message" | mail -s "Nano Photo 部署通知" $NOTIFICATION_EMAIL
    fi
    
    echo -e "${GREEN}✅ 通知发送完成${NC}"
}

# 回滚功能
rollback() {
    echo -e "${YELLOW}🔄 执行回滚...${NC}"
    
    # 获取上一个版本
    local previous_version=$(docker images ${PROJECT_NAME} --format "table {{.Tag}}" | grep -v latest | head -2 | tail -1)
    
    if [ -z "$previous_version" ]; then
        echo -e "${RED}❌ 没有找到可回滚的版本${NC}"
        exit 1
    fi
    
    echo -e "${YELLOW}回滚到版本: ${previous_version}${NC}"
    
    # 停止当前容器
    docker stop ${PROJECT_NAME}
    docker rm ${PROJECT_NAME}
    
    # 启动上一个版本
    docker run -d \
        --name ${PROJECT_NAME} \
        --restart unless-stopped \
        -p 3000:3000 \
        --env-file .env.${ENVIRONMENT} \
        ${PROJECT_NAME}:${previous_version}
    
    echo -e "${GREEN}✅ 回滚完成${NC}"
}

# 主函数
main() {
    case "$1" in
        "rollback")
            rollback
            ;;
        *)
            check_dependencies
            build_project
            
            # 根据环境选择部署方式
            case "$DEPLOY_METHOD" in
                "docker")
                    deploy_docker
                    ;;
                "vercel")
                    deploy_vercel
                    ;;
                "netlify")
                    deploy_netlify
                    ;;
                "aws")
                    deploy_aws
                    ;;
                *)
                    echo -e "${YELLOW}使用默认Docker部署${NC}"
                    deploy_docker
                    ;;
            esac
            
            health_check
            send_notification
            ;;
    esac
    
    echo -e "${GREEN}🎉 部署完成！${NC}"
}

# 错误处理
trap 'echo -e "${RED}❌ 部署失败！${NC}"; exit 1' ERR

# 执行主函数
main "$@"