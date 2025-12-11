import { createClient } from '@supabase/supabase-js'

// 需要在 .env.local 中配置这些环境变量
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('缺少 Supabase 环境变量。请检查 .env.local 文件。')
}

// 创建客户端实例
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 服务端操作使用 Service Role Key（仅用于 API 路由等）
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)