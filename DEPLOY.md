# 部署说明

## 推荐部署平台

### 1. Vercel (推荐)
```bash
# 1. 安装 Vercel CLI
npm i -g vercel

# 2. 登录并部署
vercel
vercel --prod
```

### 2. Netlify
1. 运行 `npm run build`
2. 将 `.next` 文件夹上传到 Netlify

## 环境变量配置

需要设置以下环境变量：
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## 数据库设置

在 Supabase 中创建必要的表（参考 database 目录下的 SQL 文件）。