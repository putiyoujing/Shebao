@echo off
echo ===============================================
echo 五险一金计算器 - 启动脚本
echo ===============================================
echo.

echo 检查环境变量...
if not exist .env.local (
  echo [错误] .env.local 文件不存在！
  echo 请复制 .env.example 为 .env.local 并填入正确的配置。
  pause
  exit /b 1
)

echo [✓] 环境变量文件存在

echo.
echo 检查依赖...
if not exist node_modules (
  echo 安装依赖...
  npm install
)

echo [✓] 依赖已安装

echo.
echo 启动开发服务器...
echo 访问地址: http://localhost:3000
echo.
echo 测试步骤：
echo 1. 打开浏览器访问 http://localhost:3000
echo 2. 打开开发者工具 (F12)
echo 3. 在控制台运行以下命令进行自动测试：
echo    fetch('/public/test.js').then(r => r.text()).then(eval)
echo.
echo ===============================================

npm run dev