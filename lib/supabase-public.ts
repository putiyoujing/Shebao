import { createClient } from '@supabase/supabase-js'

// 使用匿名密钥创建客户端（用于测试）
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('缺少 Supabase 环境变量。请检查 .env.local 文件。')
}

// 创建客户端实例
export const supabasePublic = createClient(supabaseUrl, supabaseAnonKey)