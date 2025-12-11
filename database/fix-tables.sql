-- 修复数据库表结构以符合需求

-- 1. 删除现有的 results 表（如果存在）
DROP TABLE IF EXISTS results;

-- 2. 重新创建符合需求的 results 表
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

-- 3. 创建索引以优化查询性能
CREATE INDEX idx_results_employee_id ON results(employee_id);
CREATE INDEX idx_results_city_year ON results(city_name, year);
CREATE INDEX idx_results_calculated_at ON results(calculated_at);

-- 4. 插入一些示例数据进行测试
INSERT INTO results (
  employee_id,
  employee_name,
  city_name,
  year,
  avg_salary,
  contribution_base,
  company_fee
) VALUES
('E001', '张三', '北京', '2024', 8416.67, 8416.67, 1262.50),
('E002', '李四', '北京', '2024', 15833.33, 15833.33, 2375.00),
('E003', '王五', '北京', '2024', 4250.00, 5000.00, 750.00);