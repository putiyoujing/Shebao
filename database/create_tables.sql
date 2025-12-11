-- 创建城市标准表
CREATE TABLE IF NOT EXISTS cities (
  id SERIAL PRIMARY KEY,
  city_name TEXT NOT NULL,
  year TEXT NOT NULL,
  base_min INTEGER NOT NULL,
  base_max INTEGER NOT NULL,
  rate FLOAT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 创建员工工资表
CREATE TABLE IF NOT EXISTS salaries (
  id SERIAL PRIMARY KEY,
  employee_id TEXT NOT NULL,
  employee_name TEXT NOT NULL,
  month TEXT NOT NULL,
  salary_amount INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
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
  calculated_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- 禁用 RLS（仅用于开发环境）
ALTER TABLE cities DISABLE ROW LEVEL SECURITY;
ALTER TABLE salaries DISABLE ROW LEVEL SECURITY;
ALTER TABLE results DISABLE ROW LEVEL SECURITY;

-- 插入示例城市数据
INSERT INTO cities (city_name, year, base_min, base_max, rate) VALUES
('北京', '2024', 6326, 33891, 0.17),
('上海', '2024', 7310, 36549, 0.165),
('广州', '2024', 5284, 26421, 0.155),
('深圳', '2024', 3523, 26421, 0.155),
('杭州', '2024', 4462, 24060, 0.155);