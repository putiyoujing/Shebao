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

-- 创建索引优化查询性能
CREATE INDEX IF NOT EXISTS idx_cities_name_year ON cities(city_name, year);
CREATE INDEX IF NOT EXISTS idx_salaries_employee ON salaries(employee_id, month);
CREATE INDEX IF NOT EXISTS idx_results_employee ON results(employee_id);
CREATE INDEX IF NOT EXISTS idx_results_city_year ON results(city_name, year);

-- 创建更新时间戳的函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为 cities 表添加更新触发器
CREATE TRIGGER update_cities_updated_at BEFORE UPDATE
    ON cities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 为 salaries 表添加更新触发器
CREATE TRIGGER update_salaries_updated_at BEFORE UPDATE
    ON salaries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();