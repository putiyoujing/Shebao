-- 禁用 RLS 并允许所有访问（仅用于开发环境）

-- 1. 禁用所有表的 RLS
ALTER TABLE cities DISABLE ROW LEVEL SECURITY;
ALTER TABLE salaries DISABLE ROW LEVEL SECURITY;
ALTER TABLE results DISABLE ROW LEVEL SECURITY;

-- 2. 创建允许所有访问的策略（如果需要启用 RLS）
-- 注释：在开发环境中，我们可以直接禁用 RLS

-- 为 cities 表创建服务角色的访问策略（如果启用 RLS）
-- DROP POLICY IF EXISTS "Allow all access to cities" ON cities;
-- CREATE POLICY "Allow all access to cities" ON cities
--   FOR ALL USING (true)
--   WITH CHECK (true);

-- 为 salaries 表创建服务角色的访问策略（如果启用 RLS）
-- DROP POLICY IF EXISTS "Allow all access to salaries" ON salaries;
-- CREATE POLICY "Allow all access to salaries" ON salaries
--   FOR ALL USING (true)
--   WITH CHECK (true);

-- 为 results 表创建服务角色的访问策略（如果启用 RLS）
-- DROP POLICY IF EXISTS "Allow all access to results" ON results;
-- CREATE POLICY "Allow all access to results" ON results
--   FOR ALL USING (true)
--   WITH CHECK (true);

-- 3. 确保 public schema 的使用权限
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated, service_role;

-- 4. 刷新权限
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;