#!/bin/bash

# 进入项目目录
cd /path/to/your/project/directory

# 拉取最新代码
git pull

# 如果是Node.js项目，可能需要安装依赖和构建
npm install
npm run build

# 如果需要重启服务
# pm2 restart your-app-name

echo "部署完成！"
