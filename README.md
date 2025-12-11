# 五险一金计算器

一个基于 Next.js 和 Supabase 的 Web 应用，用于计算公司为员工应缴纳的社保公积金费用。

## 功能特性

- 📊 支持多城市社保标准
- 📤 Excel 文件批量上传
- 🧮 自动计算缴费基数和应缴金额
- 📈 结果展示和数据导出
- 🎨 现代化的 UI 设计

## 技术栈

- **前端框架**: Next.js 14 (App Router)
- **UI 框架**: Tailwind CSS
- **数据库**: Supabase
- **文件处理**: xlsx
- **图标**: Lucide React
- **文件上传**: react-dropzone

## 快速开始

### 1. 克隆项目

```bash
git clone <repository-url>
cd shebao-app
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置 Supabase

1. 访问 [Supabase](https://supabase.com) 并创建新项目
2. 在项目的 Settings > API 中获取以下信息：
   - Project URL
   - anon public key
   - service_role key（需要手动生成）
3. 复制 `.env.local` 文件并填入你的 Supabase 配置：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

### 4. 创建数据库表

在 Supabase Dashboard 的 SQL Editor 中执行 `database/setup.sql` 文件中的 SQL 语句来创建三张数据表：

```sql
-- 创建城市标准表
CREATE TABLE IF NOT EXISTS cities (
  id SERIAL PRIMARY KEY,
  city_name TEXT NOT NULL,
  year TEXT NOT NULL,
  base_min INTEGER NOT NULL,
  base_max INTEGER NOT NULL,
  rate FLOAT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建员工工资表
CREATE TABLE IF NOT EXISTS salaries (
  id SERIAL PRIMARY KEY,
  employee_id TEXT NOT NULL,
  employee_name TEXT NOT NULL,
  month TEXT NOT NULL,
  salary_amount INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建计算结果表
CREATE TABLE IF NOT EXISTS results (
  id SERIAL PRIMARY KEY,
  employee_id TEXT NOT NULL,
  employee_name TEXT NOT NULL,
  city_name TEXT NOT NULL,
  year TEXT NOT NULL,
  avg_salary FLOAT NOT NULL,
  contribution_base FLOAT NOT NULL,
  company_fee FLOAT NOT NULL,
  calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 5. 运行项目

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 使用说明

### 1. 准备数据文件

#### 城市标准数据文件 (cities.xlsx)
需要包含以下列：
- `city_name`: 城市名称（如：佛山、广州）
- `year`: 年份（如：2024）
- `base_min`: 社保基数下限
- `base_max`: 社保基数上限
- `rate`: 综合缴纳比例（如：0.15）

#### 员工工资数据文件 (salaries.xlsx)
需要包含以下列：
- `employee_id`: 员工唯一ID
- `employee_name`: 员工姓名
- `month`: 月份（格式：YYYYMM，如：202401）
- `salary_amount`: 当月工资金额

### 2. 操作流程

1. **选择城市和年份**
   - 在数据上传页面选择要计算的城市和年份

2. **上传数据**
   - 上传城市标准文件 (cities.xlsx)
   - 上传员工工资文件 (salaries.xlsx)

3. **执行计算**
   - 点击"执行计算并存储结果"按钮
   - 系统会自动计算每位员工的缴费基数和公司应缴金额

4. **查看结果**
   - 在结果页面查看计算详情
   - 可以导出结果为 Excel 文件

### 3. 计算规则

1. 计算员工的年度月平均工资
2. 根据城市基数上下限确定缴费基数：
   - 低于下限：使用下限
   - 高于上限：使用上限
   - 在区间内：使用实际平均工资
3. 计算公司应缴金额：缴费基数 × 费率

## 项目结构

```
shebao-app/
├── app/                    # Next.js App Router
│   ├── api/               # API 路由
│   │   ├── upload/        # 文件上传 API
│   │   ├── calculate/     # 计算触发 API
│   │   ├── results/       # 结果获取 API
│   │   └── cities/        # 城市列表 API
│   ├── upload/            # 上传页面
│   ├── results/           # 结果展示页面
│   └── page.tsx           # 首页
├── components/            # React 组件
│   ├── FileUpload.tsx     # 文件上传组件
│   └── CitySelector.tsx   # 城市选择组件
├── lib/                   # 工具库
│   └── supabase.ts        # Supabase 客户端配置
├── types/                 # TypeScript 类型定义
│   └── database.ts        # 数据库类型
├── utils/                 # 工具函数
│   ├── excelParser.ts     # Excel 解析工具
│   └── calculator.ts      # 计算核心逻辑
├── database/              # 数据库脚本
│   └── setup.sql          # 建表脚本
└── public/                # 静态资源
```

## 注意事项

1. 确保 Excel 文件格式正确，包含所有必需的列
2. 月份格式必须为 YYYYMM（如：202401）
3. 上传数据时会覆盖表中的所有现有数据
4. 每次计算前会清空 results 表
5. 建议定期备份 Supabase 数据

## 环境变量

需要配置以下环境变量：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## 部署

### Vercel 部署

1. 将代码推送到 GitHub
2. 在 Vercel 中导入项目
3. 配置环境变量
4. 部署完成

### 其他平台

项目可以部署到任何支持 Next.js 的平台，如 Netlify、Railway 等。
