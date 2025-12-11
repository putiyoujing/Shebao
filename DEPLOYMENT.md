# 五险一金计算器 - 部署指南

## 前置要求

1. Node.js 18+
2. npm 或 yarn
3. Supabase 账号和项目

## 部署步骤

### 1. 克隆项目

```bash
git clone https://github.com/your-username/shebao-calculator.git
cd shebao-calculator
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

创建 `.env.local` 文件：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 4. 设置数据库

在 Supabase 中创建以下表：

1. **cities 表**
   ```sql
   CREATE TABLE cities (
     id SERIAL PRIMARY KEY,
     city_name TEXT NOT NULL,
     year TEXT NOT NULL,
     base_min INTEGER NOT NULL,
     base_max INTEGER NOT NULL,
     rate FLOAT NOT NULL,
     created_at TIMESTAMP DEFAULT NOW(),
     updated_at TIMESTAMP DEFAULT NOW()
   );
   ```

2. **salaries 表**
   ```sql
   CREATE TABLE salaries (
     id SERIAL PRIMARY KEY,
     employee_id TEXT NOT NULL,
     employee_name TEXT NOT NULL,
     month TEXT NOT NULL,
     salary_amount INTEGER NOT NULL,
     created_at TIMESTAMP DEFAULT NOW(),
     updated_at TIMESTAMP DEFAULT NOW()
   );
   ```

3. **results 表**
   ```sql
   CREATE TABLE results (
     id SERIAL PRIMARY KEY,
     employee_id TEXT NOT NULL,
     employee_name TEXT NOT NULL,
     city_name TEXT NOT NULL,
     year TEXT NOT NULL,
     avg_salary FLOAT NOT NULL,
     contribution_base FLOAT NOT NULL,
     company_fee FLOAT NOT NULL,
     calculated_at TIMESTAMP DEFAULT NOW(),
     created_at TIMESTAMP DEFAULT NOW()
   );
   ```

### 5. 部署选项

#### 选项 A: Vercel (推荐)

1. 安装 Vercel CLI
   ```bash
   npm i -g vercel
   ```

2. 登录 Vercel
   ```bash
   vercel login
   ```

3. 部署
   ```bash
   vercel
   ```

4. 配置环境变量
   ```bash
   vercel env add
   ```

#### 选项 B: Netlify

1. 构建项目
   ```bash
   npm run build
   ```

2. 将 `out` 文件夹拖拽到 Netlify 部署页面

3. 配置重定向规则，创建 `netlify.toml`：
   ```toml
   [[redirects]]
     from = "/api/*"
     to = "/.netlify/functions/:splat"
     status = 200
   ```

#### 选项 C: Cloudflare Pages

由于应用包含 API 路由，需要使用 Cloudflare Functions。

1. 安装 Wrangler
   ```bash
   npm install -g wrangler
   ```

2. 构建项目
   ```bash
   npm run build
   ```

3. 部署
   ```bash
   wrangler pages publish out
   ```

### 6. 初始化数据

使用提供的 SQL 文件初始化城市数据：

```bash
psql -h your_host -U your_user -d your_database -f database/seed_cities.sql
```

## 注意事项

1. 确保在 Supabase 中设置了正确的 RLS (Row Level Security) 策略
2. API 路由需要适当的环境变量才能正常工作
3. 文件上传功能有大小限制，可根据需要调整

## 故障排除

1. **API 路由 404 错误**
   - 检查部署平台是否支持服务端功能
   - 确认 API 文件在 `app/api` 目录中

2. **数据库连接失败**
   - 验证环境变量是否正确设置
   - 检查 Supabase 项目是否正常运行

3. **文件上传失败**
   - 检查文件大小是否超出限制
   - 确认文件格式是否为支持的 Excel 格式

## 维护

- 定期更新城市社保标准数据
- 备份数据库
- 监控 API 使用情况